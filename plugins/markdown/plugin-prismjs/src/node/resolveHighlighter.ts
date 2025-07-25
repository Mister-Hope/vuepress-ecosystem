import Prism from 'prismjs'
import { loadLanguages } from './loadLanguages.js'
import { resolveLanguage } from './utils/index.js'

const languageNameMap: Record<string, string> = {
  html: 'markup',
  vue: 'markup',
}

// documentation language of corresponding language
const docLangMap: Record<string, string> = {
  csharp: 'xml-doc',
  fsharp: 'xml-doc',
  java: 'javadoc',
  javascript: 'jsdoc',
  php: 'phpdoc',
  typescript: 'jsdoc',
}

export type Highlighter = (code: string) => string

/**
 * Resolve syntax highlighter for corresponding language
 *
 * 解析对应语言的语法高亮器
 *
 * @param language - Language name / 语言名称
 * @returns Highlighter function or null / 高亮器函数或 null
 * @example
 * ```ts
 * const highlighter = resolveHighlighter('javascript')
 * if (highlighter) {
 *   const result = highlighter('console.log("hello")')
 * }
 * ```
 */
export const resolveHighlighter = (language: string): Highlighter | null => {
  const languageInfo = resolveLanguage(language)
  const languageName = languageInfo.name

  // get the languages that need to be loaded
  const lang = languageNameMap[languageName] || languageName
  const langsToLoad = [lang]

  // doc language of current language
  if (docLangMap[lang]) {
    langsToLoad.push(docLangMap[lang])
  }

  // try to load languages
  loadLanguages(langsToLoad)

  // return null if current language could not be loaded
  // the doc language is not required so we don't check it here
  if (!(lang in Prism.languages)) {
    return null
  }

  return (code) => Prism.highlight(code, Prism.languages[lang], lang)
}
