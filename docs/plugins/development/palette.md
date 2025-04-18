---
icon: palette
---

# palette

<NpmBadge package="@vuepress/plugin-palette" />

Provide palette support for your theme.

This plugin is mainly used to develop themes, and has been integrated into the default theme. You won't need to use it directly in most cases.

For theme authors, this plugin will help you to provide styles customization for users.

## Usage

```bash
npm i -D @vuepress/plugin-palette@next
```

```ts title=".vuepress/config.ts"
import { palettePlugin } from '@vuepress/plugin-palette'

export default {
  plugins: [
    palettePlugin({
      // options
    }),
  ],
}
```

## Palette and Style

This plugin will provide a `@vuepress/plugin-palette/palette` (palette file) and a `@vuepress/plugin-palette/style` (style file) to be imported in your theme styles.

The palette file is used for defining style variables, so it's likely to be imported at the beginning of your theme styles. For example, users can define [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), [SASS variables](https://sass-lang.com/documentation/variables), [LESS variables](http://lesscss.org/features/#variables-feature) or [Stylus variables](https://stylus-lang.com/docs/variables.html) in the palette, and then you can use those variables in your theme styles.

The style file is used for overriding the default styles or adding extra styles, so it's likely to be imported at the end of your theme styles.

## Usage

Use this plugin in your theme, assuming you are using SASS:

```ts
import { palettePlugin } from '@vuepress/plugin-palette'

export default {
  // ...
  plugins: [
    palettePlugin({ preset: 'sass' }),
    // ...
  ],
}
```

### Usage of Palette

Import the plugin's palette file where your theme needs to use the corresponding variables, such as in the `Layout.vue` file:

```vue
<template>
  <h1 class="palette-title">Hello, Palette!</h1>
</template>

<style lang="scss">
/* import variables from the plugin's palette file */
@use '@vuepress/plugin-palette/palette' as *;

/* set default value for variables */
$color: red !default;

/* use variables in your styles */
.palette-title {
  color: $color;
}
</style>
```

Then users can customize variables in `.vuepress/styles/palette.scss`:

```scss
$color: green;
```

### Usage of Style

Import the plugin's style file after your theme's styles, for example, in the `clientConfigFile`:

```ts
// import your theme's style file
import 'path/to/your/theme/style'
// import the plugin's style file
import '@vuepress/plugin-palette/style'
```

Then users can add extra styles in `.vuepress/styles/index.scss` and override the default styles of your theme:

```scss
h1 {
  font-size: 2.5rem;
}
```

## Options

### preset

- Type: `'css' | 'sass' | 'less' | 'stylus'`

- Default: `'css'`

- Details:

  Set preset for other options.

  If you don't need advanced customization of the plugin, it's recommended to only set this option and omit other options.

### userPaletteFile

- Type: `string`

- Default:

  - css: `'.vuepress/styles/palette.css'`
  - sass: `'.vuepress/styles/palette.scss'`
  - less: `'.vuepress/styles/palette.less'`
  - stylus: `'.vuepress/styles/palette.styl'`

- Details:

  File path of the user palette file, relative to source directory.

  The default value depends on the [preset](#preset) option.

  The file is where users define style variables, and it's recommended to keep the default file path as a convention.

### tempPaletteFile

- Type: `string`

- Default:

  - css: `'styles/palette.css'`
  - sass: `'styles/palette.scss'`
  - less: `'styles/palette.less'`
  - stylus: `'styles/palette.styl'`

- Details:

  File path of the generated palette temp file, relative to temp directory.

  The default value depends on the [preset](#preset) option.

  You should import the palette file via `'@vuepress/plugin-palette/palette'` alias, so you don't need to change this option in most cases.

### userStyleFile

- Type: `string`

- Default:

  - css: `'.vuepress/styles/index.css'`
  - sass: `'.vuepress/styles/index.scss'`
  - less: `'.vuepress/styles/index.less'`
  - stylus: `'.vuepress/styles/index.styl'`

- Details:

  File path of the user style file, relative to source directory.

  The default value depends on the [preset](#preset) option.

  The file is where users override default styles or add extra styles, and it's recommended to keep the default file path as a convention.

### tempStyleFile

- Type: `string`

- Default:

  - css: `'styles/index.css'`
  - sass: `'styles/index.scss'`
  - less: `'styles/index.less'`
  - stylus: `'styles/index.styl'`

- Details:

  File path of the generated style temp file, relative to temp directory.

  The default value depends on the [preset](#preset) option.

  You should import the style file via `'@vuepress/plugin-palette/style'` alias, so you don't need to change this option in most cases.

### importCode

- Type: `(filePath: string) => string`

- Default:

  - css: `` (filePath) => `@import '${filePath}';\n` ``
  - sass: `` (filePath) => `@forward 'file:///${filePath}';\n` ``
  - less: `` (filePath) => `@import '${filePath}';\n` ``
  - stylus: `` (filePath) => `@require '${filePath}';\n` ``

- Details:

  Function to generate import code.

  The default value depends on the [preset](#preset) option.

  This option is used for generating [tempPaletteFile](#temppalettefile) and [tempStyleFile](#tempstylefile), and you don't need to change this option in most cases.
