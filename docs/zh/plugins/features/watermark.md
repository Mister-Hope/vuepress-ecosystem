---
icon: droplet
---

# watermark

<NpmBadge package="@vuepress/plugin-watermark" />

将 [watermark-js-plus](https://github.com/zhensherlock/watermark-js-plus) 集成到 VuePress 中。

此插件可在页面中添加水印，你可以选择为全局页面或部分页面添加水印，还可以选择添加文字水印或图片水印。

## 使用

```sh
npm i -D @vuepress/plugin-watermark@next
```

```ts title=".vuepress/config.ts"
import { watermarkPlugin } from '@vuepress/plugin-watermark'

export default {
  plugins: [
    watermarkPlugin({
      enabled: true,
      watermarkOptions: {
        content: 'My Site',
      },
    }),
  ],
}
```

## 配置项

### enabled

- 类型：`boolean | ((page: Page) => boolean)`

- 默认值：`true`

- 详情：

  指定哪些页面需要添加水印。

  拥有 `true` 值的页面将会被添加水印。

### watermarkOptions

- 类型：`WatermarkOptions`

- 默认值：`undefined`

- 详情：配置项请参考 [watermark-js-plus](https://zhensherlock.github.io/watermark-js-plus/zh/config/)。

#### watermarkOptions.parent

- 类型：`string`

- 默认值：`'body'`

- 详情：添加水印的父元素选择器。

  默认插入到 body 中，可以指定插入到页面的某个元素中。

## Frontmatter

### watermark

- 类型：`boolean | WatermarkOptions`

- 详情：

  当类型为 `boolean` 时，表示是否启用水印。

  当类型为 `WatermarkOptions` 时，表示当前页面水印配置。

  可以参考 [watermark-js-plus](https://zhensherlock.github.io/watermark-js-plus/zh/config/) 。

```md
---
watermark:
  width: 200
  height: 200
  content: Your content
  opacity: 0.5
---
```

## 客户端配置

### defineWatermarkConfig(config)

- 类型：`(config: MaybeRefOrGetter<WatermarkOptions>) => void`

传递给 [watermark-js-plus](https://zhensherlock.github.io/watermark-js-plus/zh/config/) 的额外配置。

```ts title=".vuepress/client.ts"
import { defineWatermarkConfig } from '@vuepress/plugin-watermark/client'

defineWatermarkConfig({
  // 在此设置额外的 watermark 配置
})
```

通常来说，大部分选项应该在 Node 中定义，但存在一些特殊情况。
比如需要在 **深色/浅色 模式** 下控制不同的 水印 透明度、字体颜色等，
或者需要传入如 `onSuccess`、`extraDrawFunc` 等回调函数。

```ts title=".vuepress/client.ts"
import { useDarkMode } from '@vuepress/helper/client'
import { defineWatermarkConfig } from '@vuepress/plugin-watermark/client'
import { computed } from 'vue'
import { defineClientConfig } from 'vuepress/client'

export default defineClientConfig({
  setup() {
    const isDark = useDarkMode()

    const watermarkConfig = computed(() => ({
      fontColor: isDark.value ? '#fff' : '#000',
      onSuccess: () => {
        console.log('success')
      },
    }))

    defineWatermarkConfig(watermarkConfig)
  },
})
```
