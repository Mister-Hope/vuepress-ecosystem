---
icon: trash-2
---

# remove-pwa

<NpmBadge package="@vuepress/plugin-remove-pwa" />

此插件从你的 VuePress 站点中删除任何相关的 Service Worker，因此如果你在启用后任何 PWA 插件后移除它们，用户仍然可以获得更新。

::: tip 如果你启用过 PWA，为什么需要这个插件？

PWA 插件，如 [`@vuepress/plugin-pwa`](./pwa/README.md) 将 Service Worker 注册到你的站点，这将缓存你的站点并使其离线可用。

但是，如果你删除 PWA 插件，先前的 Service Worker 仍将在那里，但它们永远无法获得更新，因为他们永远无法找到要更新的新 Service Worker。 因此，用户将继续使用你网站的旧版本。

要解决这个问题：

1. 一个新的内容为空的 Service Worker 需要生成在原位置。

1. 新的 Service Worker 应该尝试删除旧 Service Worker 缓存的内容，然后它应该注销自己。

:::

## 使用方法

```bash
npm i -D @vuepress/plugin-remove-pwa@next
```

```ts title=".vuepress/config.ts"
import { removePwaPlugin } from '@vuepress/plugin-remove-pwa'

export default {
  plugins: [
    removePwaPlugin({
      // options
    }),
  ],
}
```

## 选项

### cachePrefix

- 类型：`string`
- 默认值：`'workbox'`
- 详情：Service worker 的缓存前缀。

### swLocation

- 类型： `string`
- 默认值：`'service-worker.js'`
- 详情：旧 Service Worker 的位置。
