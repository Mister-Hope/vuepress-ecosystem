import type { App } from 'vuepress/core'
import { colors } from 'vuepress/utils'
import { logger } from './logger.js'

const GIT_PLUGIN_NAME = '@vuepress/plugin-git'

/**
 * Check if git plugin is enabled
 *
 * 检查 git 插件是否已启用
 *
 * @param app - VuePress app instance / VuePress 应用实例
 */
export const isGitPluginEnabled = (app: App): boolean => {
  if (
    app.pluginApi.plugins.every((plugin) => plugin.name !== GIT_PLUGIN_NAME)
  ) {
    try {
      import.meta.resolve(GIT_PLUGIN_NAME)

      logger.info(`${colors.magenta(GIT_PLUGIN_NAME)} is not enabled.`)

      return false
    } catch {
      logger.error(
        `${colors.magenta(
          GIT_PLUGIN_NAME,
        )} is required for this plugin, please install it.`,
      )
    }

    return false
  }

  return true
}
