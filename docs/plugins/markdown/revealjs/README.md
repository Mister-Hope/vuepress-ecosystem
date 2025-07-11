---
icon: presentation
---

# revealjs

<NpmBadge package="@vuepress/plugin-revealjs" />

Add presentation in your VuePress site via Reveal.js.

<!-- more -->

## Usage

```bash
npm i -D @vuepress/plugin-revealjs@next
```

```js {7} title=".vuepress/config.js"
import { revealJsPlugin } from '@vuepress/plugin-revealjs'

export default {
  plugins: [
    revealJsPlugin({
      // plugin options
    }),
  ],
}
```

## Slide Syntax

- Use `---` to split slides
- Use `--` to split slides vertically

```md
@slidestart

<!-- slide1 -->

---

<!-- slide2 -->

---

<!-- slide3 -->

@slideend
```

::: preview Slide Demo

@slidestart

## Slide Title

A paragraph with some text and a [link](https://mister-hope.com)

---

## Highlight

```js [2-4|1-5]
const add = (a, b) => {
  if (typeof b === 'undefined') return a + 1

  return a + b
}
```

@slideend

:::

By default, we use `auto` theme to render the presentation, but you can also use other themes with `@slidestart THEME_NAME`.

You can enable the following themes in reveal.js via `themes` in plugin options:

- `auto` (Default)
- `black`
- `white`
- `league`
- `beige`
- `sky`
- `night`
- `serif`
- `simple`
- `solarized`
- `blood`
- `moon`

For the appearance of each theme, see [Themes demo](themes.md).

::: important Assets Path

Since markdown content between `@slidestart` and `@slideend` is handled by Reveal.js in the browser, you can only use absolute paths for assets in slides, which must be directly accessible in the browser. Relative paths or aliases are not supported.

:::

## Slide Layout

By default, the plugin registers a layout named `SlidePage` for you to render slides pages.

In pages using this layout, you should only include a single slide syntax and no other content to avoid rendering problems.

```md
---
layout: SlidePage
---

@slidestart

<!-- slide content here -->

@slideend
```

You can customize this behavior via `layout` in plugin options with `false` to disable it or another layout name.

## Demo

Please see [Slides Demo](demo.md)

## Customize Reveal.js

### Built-in Plugins

You can enable built-in plugins in reveal.js via `plugins` in plugin options. It accepts an array of the following plugin names:

- `highlight`
- `math`
- `search`
- `notes`
- `zoom`

::: note

`markdown` plugin is enabled anyway to support markdown grammar.

:::

### Advanced Configuration

You can also import and call `defineRevealJsConfig` in [client config file][client-config] to customize reveal.js:

The `defineRevealJsConfig` function accepts a ref, getter or plain object as reveal.js options:

```js title=".vuepress/client.js"
import { defineRevealJsConfig } from '@vuepress/plugin-revealjs/client'

// plain object
const options1 = {
  // options
}

// or getter
const options2 = () => ({
  // options
})

// or ref
const options3 = ref({
  // options
})

defineRevealJsConfig(options1or2or3)
```

::: note

Reveal.js also provides [more plugins](https://github.com/hakimel/reveal.js/wiki/Plugins,-Tools-and-Hardware), you can add them via `plugins` option in `defineRevealJsConfig`. Built-in plugins you request at node side will be added automatically.

:::

### Per Page Configuration

You can also set `revealJs` to pass options to reveal.js per page in frontmatter.

For reveal.js options, see [reveal.js config](https://revealjs.com/config/). For reveal.js usage, see [reveal.js documentation](https://revealjs.com/)

## Options

### plugins

- Type: `RevealJsPlugin[]`
- Details: Built-in reveal.js plugins to enable.

  Available values: `highlight`, `math`, `search`, `notes`, `zoom`

### themes

- Type: `RevealJsTheme[]`
- Default: `['auto']`
- Details: Themes to enable.

  Available values: `auto`, `black`, `white`, `league`, `beige`, `sky`, `night`, `serif`, `simple`, `solarized`, `blood`, `moon`

### layout

- Type: `string | false`
- Default: `'SlidePage'`
- Details: Layout component name to render slides.

## Styles

You can customize the style via CSS variables:

@[code css](@vuepress/plugin-revealjs/src/client/styles/vars.css)

[client-config]: https://vuejs.press/guide/configuration.html#client-config-file
