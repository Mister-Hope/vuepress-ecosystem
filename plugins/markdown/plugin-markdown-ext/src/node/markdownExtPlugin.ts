import { footnote as footnotePlugin } from '@mdit/plugin-footnote'
import { tasklist as tasklistPlugin } from '@mdit/plugin-tasklist'
import type { Plugin } from 'vuepress/core'
import { isPlainObject } from 'vuepress/shared'

import {
  component as componentPlugin,
  vPre as vPrePlugin,
} from './markdown-it-plugins/index.js'
import type { MarkdownExtPluginOptions } from './options.js'
import { prepareClientConfigFile } from './prepreClientConfigFile.js'
import { PLUGIN_NAME } from './utils.js'

/**
 * Markdown extensions plugin
 *
 * Markdown 扩展插件
 *
 * @param options - Plugin options / 插件选项
 * @returns VuePress plugin / VuePress 插件
 *
 * @example
 * ```ts
 * import { markdownExtPlugin } from '@vuepress/plugin-markdown-ext'
 *
 * export default {
 *   plugins: [
 *     markdownExtPlugin({
 *       gfm: true,
 *       component: true,
 *       vPre: true,
 *     }),
 *   ],
 * }
 * ```
 */
export const markdownExtPlugin = ({
  gfm,
  breaks,
  linkify,
  footnote,
  tasklist,
  component,
  vPre,
}: MarkdownExtPluginOptions): Plugin => ({
  name: PLUGIN_NAME,

  extendsMarkdown: (md) => {
    // Behavior
    if (breaks ?? gfm) md.options.breaks = true
    if (linkify ?? gfm) md.options.linkify = true

    if (footnote ?? gfm) md.use(footnotePlugin)
    if (tasklist ?? gfm)
      md.use(tasklistPlugin, [isPlainObject(tasklist) ? tasklist : {}])
    if (component) md.use(componentPlugin)
    if (vPre) md.use(vPrePlugin)
  },

  clientConfigFile: (app) =>
    prepareClientConfigFile(app, {
      gfm,
      footnote,
      tasklist,
    }),
})
