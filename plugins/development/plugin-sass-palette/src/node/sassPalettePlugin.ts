import { addViteConfig, chainWebpack } from '@vuepress/helper'
import { watch } from 'chokidar'
import type { PluginFunction } from 'vuepress/core'
import { getDirname, path } from 'vuepress/utils'
import { injectScssConfigModule } from './injectScssConfigModule.js'
import type { SassPalettePluginOptions } from './options.js'
import {
  prepareClientConfigFile,
  prepareConfigSass,
  prepareInjectSass,
  preparePaletteSass,
  prepareStyleSass,
} from './prepare/index.js'
import { EMPTY_FILE, PLUGIN_NAME, getIdPrefix, logger } from './utils.js'

const __dirname = import.meta.dirname || getDirname(import.meta.url)

/**
 * Sass palette plugin
 *
 * Sass 调色板插件
 *
 * @description Plugin to provide palette and config file support for themes, allowing users to control theme colors and other style variables.
 *
 * 为主题提供调色板和配置文件支持的插件，允许用户控制主题颜色和其他样式变量。
 *
 * @example
 * ```ts
 * // Use with default options
 * export default {
 *   plugins: [
 *     sassPalettePlugin({
 *       id: "hope"
 *     })
 *   ]
 * }
 * ```
 */
export const sassPalettePlugin =
  (options: SassPalettePluginOptions): PluginFunction =>
  (app) => {
    if (app.env.isDebug) logger.info('Options:', options)

    const {
      id = '',
      config = `.vuepress/styles/${getIdPrefix(id)}config.scss`,
      defaultConfig = path.resolve(
        __dirname,
        '../../styles/default/config.scss',
      ),
      palette = `.vuepress/styles/${getIdPrefix(id)}palette.scss`,
      defaultPalette,
      generator = EMPTY_FILE,
      style = '',
    } = options

    const userConfig = app.dir.source(config)
    const userPalette = app.dir.source(palette)
    const userStyle = style ? app.dir.source(style) : null

    return {
      name: PLUGIN_NAME,

      multiple: true,

      id,

      alias: {
        [`@sass-palette/helper`]: path.resolve(
          __dirname,
          '../../styles/helper.scss',
        ),
        [`@sass-palette/${getIdPrefix(id)}config`]: app.dir.temp(
          `sass-palette/${getIdPrefix(id)}config.scss`,
        ),
        [`@sass-palette/${getIdPrefix(id)}inject`]: app.dir.temp(
          `sass-palette/${getIdPrefix(id)}inject.scss`,
        ),
        [`@sass-palette/${getIdPrefix(id)}palette`]: app.dir.temp(
          `sass-palette/${getIdPrefix(id)}palette.scss`,
        ),
        ...(style
          ? {
              [`@sass-palette/${getIdPrefix(id)}style`]: app.dir.temp(
                `sass-palette/${getIdPrefix(id)}style.scss`,
              ),
            }
          : {}),
      },

      extendsBundlerOptions: (bundlerOptions: unknown): void => {
        // switch to modern api and silent import deprecation for vite
        addViteConfig(bundlerOptions, app, {
          css: {
            preprocessorOptions: {
              sass: {
                api: 'modern',
                silenceDeprecations: ['import'],
              },
              scss: {
                api: 'modern',
                silenceDeprecations: ['import'],
              },
            },
          },
        })
        // silent import deprecation for webpack
        chainWebpack(bundlerOptions, app, (webpackOptions) => {
          webpackOptions.module
            .rule('scss')
            .use('sass-loader')
            .tap((loaderOptions) => ({
              ...loaderOptions,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              sassOptions: {
                ...loaderOptions.sassOptions,
                silenceDeprecations: [
                  'import',
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                  ...(loaderOptions.sassOptions?.silenceDeprecations ?? []),
                ],
              },
            }))
        })
        injectScssConfigModule(bundlerOptions, app, id)
      },

      onInitialized: (): Promise<void> =>
        Promise.all([
          prepareConfigSass(app, id, defaultConfig, userConfig),
          prepareInjectSass(app, id),
          preparePaletteSass(app, {
            id,
            defaultPalette,
            generator,
            userPalette,
          }),
          prepareStyleSass(app, id, userStyle),
        ]).then(() => {
          if (app.env.isDebug) logger.info(`Style file for ${id} generated`)
        }),

      onWatched: (_, watchers): void => {
        const configWatcher = watch(userConfig, {
          cwd: app.dir.source(),
          ignoreInitial: true,
        })

        const updateConfig = (): Promise<void> =>
          prepareConfigSass(app, id, defaultConfig, userConfig).then(() => {
            if (app.env.isDebug) logger.info(`Style file for ${id} updated`)
          })

        configWatcher.on('add', () => {
          void updateConfig()
        })
        configWatcher.on('unlink', () => {
          void updateConfig()
        })

        watchers.push(configWatcher)

        const paletteWatcher = watch(userPalette, {
          cwd: app.dir.source(),
          ignoreInitial: true,
        })

        const updatePalette = (): Promise<void> =>
          Promise.all([
            prepareConfigSass(app, id, defaultConfig, userConfig),
            preparePaletteSass(app, {
              id,
              defaultPalette,
              generator,
              userPalette,
            }),
          ]).then(() => {
            if (app.env.isDebug) logger.info(`Style file for ${id} updated`)
          })

        paletteWatcher.on('add', () => {
          void updatePalette()
        })
        paletteWatcher.on('unlink', () => {
          void updatePalette()
        })

        watchers.push(paletteWatcher)

        if (userStyle) {
          const styleWatcher = watch(userStyle, {
            cwd: app.dir.source(),
            ignoreInitial: true,
          })

          const updateStyle = (): Promise<void> =>
            prepareStyleSass(app, id, userStyle).then(() => {
              if (app.env.isDebug) logger.info(`Style file for ${id} updated`)
            })

          styleWatcher.on('add', () => {
            void updateStyle()
          })
          styleWatcher.on('unlink', () => {
            void updateStyle()
          })
          watchers.push(styleWatcher)
        }
      },

      clientConfigFile: () => prepareClientConfigFile(app, id),
    }
  }
