---
icon: database
---

# theme-data

<NpmBadge package="@vuepress/plugin-theme-data" />

Provide client data for your theme, with VuePress [i18n](https://vuejs.press/guide/i18n.html) support.

This plugin is mainly used to develop themes, and has been integrated into the default theme. You won't need to use it directly in most cases.

For theme authors, this plugin will help you use the same i18n mechanism as VuePress and the default theme. However, if you don't want to provide i18n support, or you want to implement your own approach, you don't need this plugin.

## Usage

```bash
npm i -D @vuepress/plugin-theme-data@next
```

```ts title=".vuepress/config.ts"
import { themeDataPlugin } from '@vuepress/plugin-theme-data'

export default {
  plugins: [
    themeDataPlugin({
      // options
    }),
  ],
}
```

## Options

### themeData

- Type: `ThemeData`

- Required: Yes

- Details:

  The theme data object that you want to use in client side.

  You can provide theme data in Node side via this option, and use it in client side via [useThemeData](#usethemedata) and [useThemeLocaleData](#usethemelocaledata).

- Example:

```ts title=".vuepress/config.ts"
export default {
  plugins: [
    themeDataPlugin({
      themeData: {
        foo: 'foo',
        locales: {
          '/zh/': {
            foo: 'zh-foo',
          },
        },
      },
    }),
  ],
}
```

::: warning
The theme data object will be processed by `JSON.stringify()` before forwarding to client side, so you should ensure that you provide a JSON-friendly object.
:::

## Composition API

### useThemeData

- Details:

  Returns the theme data ref object.

  The value is provided by [themeData](#themedata) option.

- Example:

```ts
import type { ThemeData } from '@vuepress/plugin-theme-data/client'
import { useThemeData } from '@vuepress/plugin-theme-data/client'

type MyThemeData = ThemeData<{
  foo: string
}>

export default {
  setup(): void {
    const themeData = useThemeData<MyThemeData>()
    console.log(themeData.value)
  },
}
```

### useThemeLocaleData

- Details:

  Returns the theme data ref object in current locale.

  The properties of current locale have been merged into the root-level properties.

- Example:

```ts
import type { ThemeData } from '@vuepress/plugin-theme-data/client'
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client'

type MyThemeData = ThemeData<{
  foo: string
}>

export default {
  setup(): void {
    const themeLocaleData = useThemeLocaleData<MyThemeData>()
    console.log(themeLocaleData.value)
  },
}
```
