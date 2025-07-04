---
icon: chart-no-axes-combined
---

# baidu-analytics

<NpmBadge package="@vuepress/plugin-baidu-analytics" />

Integrate [Baidu Analytics](https://tongji.baidu.com/) into VuePress.

::: tip

Do not enable [SPA mode in Baidu Analytics](https://tongji.baidu.com/web/help/article?id=324&type=0). The plugin will report page view events correctly.

:::

## Usage

```bash
npm i -D @vuepress/plugin-baidu-analytics@next
```

```ts title=".vuepress/config.ts"
import { baiduAnalyticsPlugin } from '@vuepress/plugin-baidu-analytics'

export default {
  plugins: [
    baiduAnalyticsPlugin({
      // options
    }),
  ],
}
```

### Reporting Events

The plugin automatically reports page view events on page visits and route changes.

A global `_hmt` array is available on the `window` object for [custom event reporting](https://tongji.baidu.com/holmes/Analytics/%E6%8A%80%E6%9C%AF%E6%8E%A5%E5%85%A5%E6%8C%87%E5%8D%97/JS%20API/JS%20API%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C).

## Options

### id

- Type: `string`
- Required: Yes
- Details: Baidu Analytics tracking ID, which is the query parameter in the `hm.js` URL.
