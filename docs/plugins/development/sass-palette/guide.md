---
icon: lightbulb
---

# Guide

Comparing to [`@vuepress/plugin-palette`](../palette.md), this plugin allows you to:

- Derive related styles based on user configuration
- Provide style customization similar to themes in plugins
- Group applications across multiple plugins or themes via id option

Before using the plugin, you need to understand the id option, as well as three styling concepts: configuration, palette and generator.

## ID Option

To get started, you should understand that this plugin is designed to work across plugins and themes (unlike the official one only for themes).

We are providing `id` option to do that, and using this plugin (by calling `useSassPalette`) with same ID won't have any side effects. Also, all the aliases and module names have an ID prefix.

This will allow you to:

- Share the same style system across your plugins (or themes) using the same ID without any side effects.

  All aliases and module names have an ID prefix, which means you can use a set of style variables within your plugins (or theme) to unify your styles without being affected by other plugins (or themes).

  Users can configure all color variables, breakpoints, and other style configurations in the same file and have them automatically applied to themes and plugins with the same ID.

  ::: tip Example

  `vuepress-theme-hope` and other related plugins use the same ID `hope` to call the plugin, so the styles configured by the user in the theme will automatically take effect in all plugins.

  :::

- With different ID, plugins and theme won't affect others. We recommend you to set the `id` variable with your plugin name.

  With the default settings, users will set your plugin style under `.vuepress/styles` directory with Sass files starting with your ID prefix. And you can access the variables you need with `${id}-config` and `${id}-palette`.

  ::: tip Example

  `vuepress-theme-hope` is using ID `"hope"`, and just imagine a `vuepress-plugin-abc` is using `"abc"`. They can get their own variables with module name `hope-config` `hope-palette` and `abc-config` `abc-palette`.

  :::

- Calling the plugin with the same ID has no side effects.

  ::: tip example

  `vuepress-theme-hope` and other related plugins use the same ID `hope` to call the plugin.

  :::

## Config

Config file is used for Sass variable only. It holds Sass variables which can be used via `${id}-config` in other files later.

You can specify a file (probably in `.vuepress/styles/` directory) as user config file. So you can get the module containing every variable later in Sass files. Also, you are able to provide a default config files where you can place fallback values for variables with `!default`.

::: details An example

Imagine you are invoking the plugin with the following options in `vuepress-plugin-abc`:

```js
useSassPalette(app, {
  id: 'abc',
  defaultConfig: 'vuepress-plugin-abc/styles/config.scss',
})
```

User config file:

```scss title=".vuepress/styles/abc-palette.scss"
$navbar-height: 3.5rem;
```

Default config file:

```scss title="vuepress-plugin-abc/styles/palette.scss"
$navbar-height: 2rem !default;
$sidebar-width: 18rem !default;
```

You can get the following variables in the plugin Sass files:

```scss
// <style lang="scss"> block in vue sfc or scss file directly imported in scripts
@debug abc-config.$navbar-height; // 3.5rem
@debug abc-config.$sidebar-width; // 18rem
```

:::

### Limitations

We are using `additionalData` options to let `${id}-config` module available in your styles, but this has some limitations.

`additionalData` only works on Scss entry, so `${id}-config` is available only in :

- `<style lang="scss">` block in component files
- Scss files imported by script files directly (e.g.: `import "./a-scss-file.scss"` in client app enhance file).

If the Scss file is not imported directly, but is imported through `@use` or `@import` api, the module won't be available. So that in this case, you should manually import the module with `@use "@sass-palette/${id}-config";`.

## Palette

Palette files are used for CSS variable injection, where each variable will be injected in to root with kebab-name of variable name.

You can specify a file (probably in `.vuepress/styles/` directory) as user palette file, and the default filename is `${id}-palette.scss`. Also, you are able to provide a default palette files where you can place fallback values for variables with `!default`.

::: details An example

Imagine you are invoking the plugin with the following options in `vuepress-plugin-abc`:

```js
useSassPalette(app, {
  id: 'abc',
  defaultPalette: 'vuepress-plugin-abc/styles/palette.scss',
})
```

If users are setting:

```scss title=".vuepress/styles/abc-palette.scss"
$color-a: red;
```

And you are providing a default palette file with:

```scss title="vuepress-plugin-abc/styles/palette.scss"
$color-a: blue !default;
$color-b: green !default;
```

Then the below CSS variables will be available under root selector:

```scss
:root {
  --color-a: red;
  --color-b: green;
}
```

:::

Like config file, palette file provides a module named `${id}-palette` (also including generator values), and it is also limited by `additionalData` option, so you should import the module manually if you want to use it in other Sass files.

### Color Settings

Since the default theme provides dark mode, you probably want different colors under light mode and dark mode.

To achieve that, you should set color variables with a map containing `light` and `dark` keys. Later, the plugin will generate different colors for you.

::: details An example

```scss
// User palette
$text-color: (
  light: #222,
  dark: #999,
);

// Default palette
$text-color: (
  light: #2c3e50,
  dark: #9e9e9e,
) !default;
$bg-color: (
  light: #fff,
  dark: #1e1e1e,
) !default;
```

Then you will get:

```scss
:root {
  --text-color: #222;
  --bg-color: #fff;
}

[data-theme='dark'] {
  --text-color: #999;
  --bg-color: #1e1e1e;
}
```

:::

### Allowed Variable Types

Only colors (or color map for light/dark mode), length and strings are allowed in palette. Any other type will be dropped.

:::: tip Why only allow color and length besides strings

In common situations, you probably only want to make calculations with color and length. So it's quite safe to drop other type support, because any other value you want can be converted to string.

::: details Example

If you want a `--move-transition` with `width 0.3s ease`, you can use strings:

```scss
// this will be regarded as a list with (length, time, function) by Sass
// and will trigger a warning and be dropped by plugin
$moveTransition: width 0.3s ease;

// this will get what you want
// :root {
//   --move-transition: width 0.3s ease
// }
$moveTransition: 'width 0.3s ease';
```

:::

::::

## Helper

We are exposing internal functions that `@vuepress/plugin-sass-palette` uses, as a helper module.

You can use this helper with `@sass-palette/helper` alias and call its functions to achieve similar features yourself.

## Generator

A generator file is designed for developers to generate derived values based on palette file variables.

You can access variables from the palette file directly in this file and generate new values based on them.

Variables in the generator file will also be injected as CSS variables like palette, and they will be available in the palette module.

::: details Example

You may want a `$theme-color-light` based on `$theme-color`. So you can write a generator like this:

```scss
@use 'sass:color';
@use '@sass-palette/helper';

$theme-color-light: (
  light: color.scale(helper.get-color($theme-color), $lightness: 10%),
  dark: color.scale(helper.get-dark-color($theme-color), $lightness: 10%),
) !default;
```

You can also generate values based on variables provided by config files by importing it:

```scss
// generator with id "abc"
@use 'sass:color';
@use '@sass-palette/abc-config';
@use '@sass-palette/helper';

$code-c-bg: abc-config.$highlighter == 'shiki'? #fff: #f8f8f8;
```

:::

## User Styles

If you are a theme developer, you may want to provide your users a way to customize your theme or the site.

In this case you should set the `style` option as the user style file when using this plugin.

Later, you should manually include the user style file by importing `@sass-palette/${id}-style` **after your theme styles**.

::: tip

`@sass-palette/${id}-style` is an alias to user style file, and you can import it in JS/TS/SASS.

:::
