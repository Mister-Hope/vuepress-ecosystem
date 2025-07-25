/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { isHTMLTag, isMathMLTag, isSVGTag } from '@vue/shared'
import { load } from 'cheerio'
import type { AnyNode, Element } from 'domhandler'
import matter from 'gray-matter'
import type { App, Page } from 'vuepress/core'
import { isLinkHttp, removeEndingSlash } from 'vuepress/shared'
import { isArray, isLinkAbsolute, startsWith } from '../../shared/index.js'

const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

interface NodeOptions
  extends Required<
    Pick<PageExcerptOptions, 'isCustomElement' | 'keepFenceDom'>
  > {
  base: string
}

const handleNode = (
  node: AnyNode,
  { base, isCustomElement, keepFenceDom }: NodeOptions,
): AnyNode | null => {
  if (node.type === 'tag') {
    // image using relative urls shall be dropped
    if (node.tagName === 'img') {
      const { src } = node.attribs

      // this is not a resolvable image link
      if (!isLinkHttp(src) && !isLinkAbsolute(src)) return null
    }

    // toc should be dropped
    if (
      [node.attribs.class, node.attribs.id].some((item) =>
        ['table-of-contents', 'toc'].includes(item),
      )
    )
      return null

    // standard tags can be returned
    if (
      isHTMLTag(node.tagName) ||
      isSVGTag(node.tagName) ||
      isMathMLTag(node.tagName)
    ) {
      // handing heading tags
      if (HEADING_TAGS.includes(node.tagName)) {
        // remove heading id tabindex
        delete node.attribs.id
        delete node.attribs.tabindex

        // extract heading tags and remove anchor
        if (
          node.children.length === 1 &&
          node.children[0].type === 'tag' &&
          node.children[0].tagName === 'a' &&
          node.children[0].attribs.class === 'header-anchor'
        )
          node.children = (node.children[0].children[0] as Element).children
      }

      if (
        node.tagName === 'div' &&
        startsWith(node.attribs.class, 'language-')
      ) {
        const pre = node.children.find(
          (childNode) =>
            childNode.type === 'tag' &&
            childNode.tagName === 'pre' &&
            startsWith(childNode.attribs.class, 'language-'),
        )

        if (
          // we are sure this is a code fence
          pre &&
          !keepFenceDom
        ) {
          node.attribs.class = node.attribs.class.replace(
            ' line-numbers-mode',
            '',
          )
          node.children = [pre]
        }
      }

      // remove `v-pre` attribute on code
      if (node.tagName === 'code' || node.tagName === 'pre')
        delete node.attribs['v-pre']

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      node.children = handleNodes(node.children, {
        base,
        isCustomElement,
        keepFenceDom,
      })

      return node
    }

    // we shall convert `<RouteLink>` and `<RouterLink>` to `<a>` tag
    if (node.tagName === 'routelink' || node.tagName === 'routerlink') {
      node.tagName = 'a'
      node.attribs.href = `${removeEndingSlash(base)}${node.attribs.to}`
      node.attribs.target = '_blank'
      delete node.attribs.to

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      node.children = handleNodes(node.children, {
        base,
        isCustomElement,
        keepFenceDom,
      })

      return node
    }

    // keep custom element as is
    if (isCustomElement(node.tagName)) return node

    // other tags are considered as vue components and dropped
    return null
  }

  return node
}

const handleNodes = (
  nodes: AnyNode[] | null,
  { base, isCustomElement, keepFenceDom }: NodeOptions,
): AnyNode[] =>
  isArray(nodes)
    ? nodes
        .map((node) =>
          handleNode(node, {
            base,
            isCustomElement,
            keepFenceDom,
          }),
        )
        .filter((node): node is AnyNode => node !== null)
    : []

const $ = load('')

const isH1Tag = (node: AnyNode): boolean =>
  node.type === 'tag' && node.tagName === 'h1'

/**
 * Get raw content of excerpt from page content
 *
 * 从页面内容中获取摘要的原始内容
 *
 * @param content - Raw content of page / 页面的原始内容
 * @param separator - Excerpt separator / 摘要分隔符
 *
 * @returns Raw content of excerpt / 摘要的原始内容
 */
export const getPageRawExcerpt = (
  content: string,
  separator = '<!-- more -->',
): string | undefined =>
  matter(content, {
    excerpt: true,
    excerpt_separator: separator,
  }).excerpt

/**
 * Options for `getPageExcerpt`
 */
export interface PageExcerptOptions {
  /**
   * Excerpt separator
   *
   * 摘要分隔符
   *
   * @default "<!-- more -->"
   */
  separator?: string

  /**
   * Length of excerpt
   *
   * @description Excerpt length will be the minimal possible length reaching this value
   *
   * 摘要的长度
   *
   * @description 摘要的长度会尽可能的接近这个值
   *
   * @default 300
   */
  length?: number

  /**
   * Tags which is considered as custom elements
   *
   * @description This is used to determine whether a tag is a custom element since all unknown tags are removed in excerpt.
   *
   * 被认为是自定义元素的标签
   *
   * @description 用于判断一个标签是否是自定义元素，因为在摘要中，所有的未知标签都会被移除。
   */
  isCustomElement?: (tagName: string) => boolean

  /**
   * Whether keep page title (first h1) in excerpt
   *
   * 是否保留页面标题 (第一个 h1)
   *
   * @default false
   */
  keepPageTitle?: boolean

  /**
   * Whether preserve tags like line numbers and highlight lines for code blocks
   *
   * 是否保留代码块的标签，诸如行号和高亮行
   *
   * @default false
   */
  keepFenceDom?: boolean
}

/**
 * Get excerpt content of a page
 *
 * 获取页面的摘要内容
 *
 * @param app - VuePress App / VuePress 应用
 * @param page - VuePress Page / VuePress 页面
 * @param excerptOptions - Excerpt behavior options / 摘要行为选项
 *
 * @returns Page excerpt / 页面摘要
 */
export const getPageExcerpt = (
  { markdown, options: { base } }: App,
  { content, contentRendered, filePath, filePathRelative, frontmatter }: Page,
  {
    isCustomElement = (): boolean => false,
    separator = '<!-- more -->',
    length = 300,
    keepPageTitle = false,
    keepFenceDom = false,
  }: PageExcerptOptions = {},
): string => {
  // get page content
  const rawExcerpt = getPageRawExcerpt(content, separator)

  if (rawExcerpt) {
    const renderedContent = markdown.render(
      rawExcerpt,
      // markdown env
      {
        base,
        filePath,
        filePathRelative,
        frontmatter: { ...frontmatter },
      },
    )

    const rootNodes = renderedContent ? $.parseHTML(renderedContent) : []

    if (rootNodes[0] && !keepPageTitle && isH1Tag(rootNodes[0]))
      rootNodes.shift()

    return $.html(
      handleNodes(rootNodes, {
        base,
        isCustomElement,
        keepFenceDom,
      }),
    )
  }

  if (length > 0) {
    let autoExcerpt = ''

    const rootNodes = contentRendered ? $.parseHTML(contentRendered) : []

    if (rootNodes[0] && !keepPageTitle && isH1Tag(rootNodes[0]))
      rootNodes.shift()

    for (const node of rootNodes) {
      const resolvedNode = handleNode(node, {
        base,
        isCustomElement,
        keepFenceDom,
      })

      if (resolvedNode) {
        autoExcerpt += $.html(resolvedNode)
        if (autoExcerpt.length >= length) break
      }
    }

    return autoExcerpt
  }

  return ''
}
