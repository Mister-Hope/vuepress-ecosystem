---
icon: chart-no-axes-combined
---

# baidu-analytics

<NpmBadge package="@vuepress/plugin-baidu-analytics" />

将 [百度统计](https://tongji.baidu.com/) 集成到 VuePress 中。

::: tip

请勿打开[百度统计内置的“单页应用数据统计”功能](https://tongji.baidu.com/web/help/article?id=324&type=0)，本插件会正确处理相关逻辑。

:::

## 使用方法

```bash
npm i -D @vuepress/plugin-baidu-analytics@next
```

```ts title=".vuepress/config.ts"
import { baiduAnalyticsPlugin } from '@vuepress/plugin-baidu-analytics'

export default {
  plugins: [
    baiduAnalyticsPlugin({
      // 配置项
    }),
  ],
}
```

### 事件上报

插件会自动上报页面访问和路由切换事件。

此外，全局 `_hmt` 数组会挂载到 `window` 对象，可用于 [自定义事件上报](https://tongji.baidu.com/holmes/Analytics/%E6%8A%80%E6%9C%AF%E6%8E%A5%E5%85%A5%E6%8C%87%E5%8D%97/JS%20API/JS%20API%20%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C)。

## 选项

### id

- 类型：`string`
- 必填：是
- 详情：百度统计追踪 ID，即 `hm.js` URL 中的查询参数。
