/**
 * Plugin options
 *
 * 插件选项
 */
export interface AppendDatePluginOptions {
  /**
   * Frontmatter key to use when appending date
   *
   * 追加时间时使用的 frontmatter 键名
   *
   * @default "date"
   */
  key?: string

  /**
   * Format of the date value when appending date
   *
   * 追加时间时使用的日期格式
   *
   * @default "date"
   */
  format?: 'date' | 'full' | 'time'
}
