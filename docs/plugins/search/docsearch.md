---
icon: https://docsearch.algolia.com/img/favicon.ico
---

# docsearch

<NpmBadge package="@vuepress/plugin-docsearch" />

Integrate [Algolia DocSearch](https://docsearch.algolia.com/) into VuePress, which can provide search to your documentation site.

## Usage

```bash
npm i -D @vuepress/plugin-docsearch@next
```

```ts title=".vuepress/config.ts"
import { docsearchPlugin } from '@vuepress/plugin-docsearch'

export default {
  plugins: [
    docsearchPlugin({
      // options
    }),
  ],
}
```

## Get Search Index

You need to [submit the URL of your site](https://docsearch.algolia.com/apply/) to join the DocSearch program. The DocSearch team will send [apiKey](#apikey) and [indexName](#indexname) to your email once the index is generated. Then you can configure this plugin to enable DocSearch in VuePress.

Alternatively, you can [run your own crawler](https://docsearch.algolia.com/docs/run-your-own/) to generate the index, and then use your own [appId](#appid), [apiKey](#apikey) and [indexName](#indexname) to configure this plugin.

::: details Official crawler config

```js{35-50,59}
new Crawler({
  appId: 'YOUR_APP_ID',
  apiKey: 'YOUR_API_KEY',
  rateLimit: 8,
  startUrls: [
    // These are urls which Algolia starts to crawl
    // If your site is divided into multiple parts,
    // you may want to set multiple entry links
    'https://YOUR_WEBSITE_URL/',
  ],
  sitemaps: [
    // if you are using sitemap plugins (e.g.: @vuepress-plugin/sitemap), you may provide one
    'https://YOUR_WEBSITE_URL/sitemap.xml',
  ],
  ignoreCanonicalTo: false,
  exclusionPatterns: [
    // You can use this to stop algolia crawing some paths
  ],
  discoveryPatterns: [
    // These are urls which Algolia is looking for,
    'https://YOUR_WEBSITE_URL/**',
  ],
  // Crawler schedule, set it according to your docs update frequency
  schedule: 'at 02:00 every 1 day',
  actions: [
    // you may have multiple actions, especially when you are deploying multiple docs under one domain
    {
      // name the index with name you like
      indexName: 'YOUR_INDEX_NAME',
      // paths where the index take effect
      pathsToMatch: ['https://YOUR_WEBSITE_URL/**'],
      // controls how algolia extracts records from your site
      recordExtractor: ({ $, helpers }) => {
        // options for @vuepress/theme-default
        return helpers.docsearch({
          recordProps: {
            lvl0: {
              selectors: '.vp-sidebar-heading.active',
              defaultValue: 'Documentation',
            },
            lvl1: '[vp-content] h1',
            lvl2: '[vp-content] h2',
            lvl3: '[vp-content] h3',
            lvl4: '[vp-content] h4',
            lvl5: '[vp-content] h5',
            lvl6: '[vp-content] h6',
            content: '[vp-content] p, [vp-content] li',
          },
          indexHeadings: true,
        })
      },
    },
  ],
  initialIndexSettings: {
    // controls how indexes are initialized
    // only has effects before index are initialize
    // you may need to delete your index and recraw after modification
    YOUR_INDEX_NAME: {
      attributesForFaceting: ['type', 'lang'],
      attributesToRetrieve: ['hierarchy', 'content', 'anchor', 'url'],
      attributesToHighlight: ['hierarchy', 'hierarchy_camel', 'content'],
      attributesToSnippet: ['content:10'],
      camelCaseAttributes: ['hierarchy', 'hierarchy_radio', 'content'],
      searchableAttributes: [
        'unordered(hierarchy_radio_camel.lvl0)',
        'unordered(hierarchy_radio.lvl0)',
        'unordered(hierarchy_radio_camel.lvl1)',
        'unordered(hierarchy_radio.lvl1)',
        'unordered(hierarchy_radio_camel.lvl2)',
        'unordered(hierarchy_radio.lvl2)',
        'unordered(hierarchy_radio_camel.lvl3)',
        'unordered(hierarchy_radio.lvl3)',
        'unordered(hierarchy_radio_camel.lvl4)',
        'unordered(hierarchy_radio.lvl4)',
        'unordered(hierarchy_radio_camel.lvl5)',
        'unordered(hierarchy_radio.lvl5)',
        'unordered(hierarchy_radio_camel.lvl6)',
        'unordered(hierarchy_radio.lvl6)',
        'unordered(hierarchy_camel.lvl0)',
        'unordered(hierarchy.lvl0)',
        'unordered(hierarchy_camel.lvl1)',
        'unordered(hierarchy.lvl1)',
        'unordered(hierarchy_camel.lvl2)',
        'unordered(hierarchy.lvl2)',
        'unordered(hierarchy_camel.lvl3)',
        'unordered(hierarchy.lvl3)',
        'unordered(hierarchy_camel.lvl4)',
        'unordered(hierarchy.lvl4)',
        'unordered(hierarchy_camel.lvl5)',
        'unordered(hierarchy.lvl5)',
        'unordered(hierarchy_camel.lvl6)',
        'unordered(hierarchy.lvl6)',
        'content',
      ],
      distinct: true,
      attributeForDistinct: 'url',
      customRanking: [
        'desc(weight.pageRank)',
        'desc(weight.level)',
        'asc(weight.position)',
      ],
      ranking: [
        'words',
        'filters',
        'typo',
        'attribute',
        'proximity',
        'exact',
        'custom',
      ],
      highlightPreTag: '<span class="algolia-docsearch-suggestion--highlight">',
      highlightPostTag: '</span>',
      minWordSizefor1Typo: 3,
      minWordSizefor2Typos: 7,
      allowTyposOnNumericTokens: false,
      minProximity: 1,
      ignorePlurals: true,
      advancedSyntax: true,
      attributeCriteriaComputedByMinProximity: true,
      removeWordsIfNoResults: 'allOptional',
    },
  },
})
```

The above `recordProps` is the configuration used for the default theme. You can modify them according to the theme you are using.

Notice that the `initialIndexSettings.YOUR_INDEX_NAME.attributesForFaceting` fields must include `'lang'` to make this plugin work properly.
:::

::: tip
If you are not using default theme, or you meet any problems when using docsearch, you can also check the above example crawler config, and ahead to [Algolia Crawler](https://crawler.algolia.com/admin/crawlers/), and edit your config with 'Editor' panel in project sidebar.
:::

## Options

### apiKey

- Type: `string`
- Required: Yes
- Details: The `apiKey` that you received from the DocSearch team, or generated by yourself.

- Also see:
  - [DocSearch > Options > apiKey](https://docsearch.algolia.com/docs/api#apikey)

### indexName

- Type: `string`
- Required: Yes
- Details: The `indexName` that you received from the DocSearch team, or generated by yourself.

- Also see:
  - [DocSearch > Options > indexName](https://docsearch.algolia.com/docs/api#indexname)

### appId

- Type: `string`
- Required: Yes
- Details: It defines your own application ID.

- Also see:
  - [DocSearch > Options > appId](https://docsearch.algolia.com/docs/api#appid)

### searchParameters

- Type: `SearchParameters`
- Details: Algolia Search API parameters.

- Reference:
  - [DocSearch > Options > searchParameters](https://docsearch.algolia.com/docs/api/#searchparameters)
  - [Algolia > Search API Parameters](https://www.algolia.com/doc/api-reference/search-api-parameters/)

### placeholder

- Type: `string`
- Default: `'Search docs'`
- Details: The placeholder attribute of the search input.

- Reference:
  - [DocSearch > Options > placeholder](https://docsearch.algolia.com/docs/api/#placeholder)

### disableUserPersonalization

- Type: `boolean`
- Default: `false`
- Details: Whether to disable all personalized features: recent searches, favorite searches, etc.

- Reference:
  - [DocSearch > Options > disableUserPersonalization](https://docsearch.algolia.com/docs/api/#disableuserpersonalization)

### initialQuery

- Type: `string`
- Details: The initial query when the modal opens.

- Reference:
  - [DocSearch > Options > initialQuery](https://docsearch.algolia.com/docs/api/#initialquery)

### maxResultsPerGroup

- Type: `number`
- Default: `5`
- Details: The maximum number of results per group.

- Also see:
  - [DocSearch > Options > maxResultsPerGroup](https://docsearch.algolia.com/docs/api/#maxresultspergroup)

### translations

- Type: `Partial<DocSearchTranslations>`
- Details: Allow replacing the default text in the DocSearch button or modal.

- Also see:
  - [DocSearch > Options > translations](https://docsearch.algolia.com/docs/api/#translations)

### locales

- Type: `Record<string, DocSearchPluginOptions>`
- Details: Options of this plugin in different locales. All other options of this plugin are acceptable in locale config.

- Example:

```ts title=".vuepress/config.ts"
export default {
  plugins: [
    docsearchPlugin({
      appId: '<APP_ID>',
      apiKey: '<API_KEY>',
      indexName: '<INDEX_NAME>',
      locales: {
        '/': {
          placeholder: 'Search Documentation',
          translations: {
            button: {
              buttonText: 'Search Documentation',
            },
          },
        },
        '/zh/': {
          placeholder: '搜索文档',
          translations: {
            button: {
              buttonText: '搜索文档',
            },
          },
        },
      },
    }),
  ],
}
```

- Also see:
  - [Guide > I18n](https://vuejs.press/guide/i18n.html)

### indexBase

- Type: `string`
- Default: [base](https://vuejs.press/reference/config.html#base)
- Details: The base path of the search index.

  If you are deploying your site to multiple domains, you don't need to submit all of them to DocSearch and generate search index separately. You could choose one of the domains as the _index domain_, and only submit the _index domain_ to DocSearch for crawling search index. Then, you could reuse the search index across all deployments.

  However, if the [base](https://vuejs.press/reference/config.html#base) of your deployments are different for different domains, you need to set the option to the [base](https://vuejs.press/reference/config.html#base) of your _index domain_, so that other deployments could reuse the search index correctly.

### injectStyles

- Type: `boolean`
- Default: `true`
- Details: Whether to inject the default styles of DocSearch or not.

  If you think the default styles of DocSearch is not compatible with your site, you can try to override the default styles, or set this option to `false` to totally exclude the default styles.

  When this option is disabled, you need to import your own styles for DocSearch. Also notice that all styles customization in [Styles](#styles) section would be unavailable.

## Client options

### defineDocSearchConfig

```ts
type DocSearchClientLocaleOptions = Partial<DocSearchProps>

interface DocSearchClientOptions extends DocSearchClientLocaleOptions {
  locales?: Record<string, DocSearchClientLocaleOptions>
}

const defineDocSearchConfig: (
  options: MaybeRefOrGetter<DocSearchClientOptions>,
) => void
```

Customize DocSearch options, support plain object, ref or getter.

::: warning

To support VuePress's routing and other optimizations, the `transformItems`, `hitComponent` `navigator` and `transformSearchClient` options have been configured internally. Overriding them directly may lead to unexpected behavior.

If you need to customize them, you may need to first understand [VuePress's adaptation](https://github.com/vuepress/ecosystem/blob/main/plugins/search/plugin-docsearch/src/client/composables/useDocSearchSlim.ts) and make sure not to break them.

:::

## Styles

You can customize styles via CSS variables that provided by [@docsearch/css](https://docsearch.algolia.com/docs/styling):

```css
:root {
  --docsearch-primary-color: rgb(84, 104, 255);
  --docsearch-text-color: rgb(28, 30, 33);
  --docsearch-spacing: 12px;
  --docsearch-icon-stroke-width: 1.4;
  --docsearch-highlight-color: var(--docsearch-primary-color);
  --docsearch-muted-color: rgb(150, 159, 175);
  --docsearch-container-background: rgba(101, 108, 133, 0.8);
  --docsearch-logo-color: rgba(84, 104, 255);

  /* modal */
  --docsearch-modal-width: 560px;
  --docsearch-modal-height: 600px;
  --docsearch-modal-background: rgb(245, 246, 247);
  --docsearch-modal-shadow:
    inset 1px 1px 0 0 rgba(255, 255, 255, 0.5), 0 3px 8px 0 rgba(85, 90, 100, 1);

  /* searchbox */
  --docsearch-searchbox-height: 56px;
  --docsearch-searchbox-background: rgb(235, 237, 240);
  --docsearch-searchbox-focus-background: #fff;
  --docsearch-searchbox-shadow: inset 0 0 0 2px var(--docsearch-primary-color);

  /* hit */
  --docsearch-hit-height: 56px;
  --docsearch-hit-color: rgb(68, 73, 80);
  --docsearch-hit-active-color: #fff;
  --docsearch-hit-background: #fff;
  --docsearch-hit-shadow: 0 1px 3px 0 rgb(212, 217, 225);

  /* key */
  --docsearch-key-gradient: linear-gradient(
    -225deg,
    rgb(213, 219, 228) 0%,
    rgb(248, 248, 248) 100%
  );
  --docsearch-key-shadow:
    inset 0 -2px 0 0 rgb(205, 205, 230), inset 0 0 1px 1px #fff,
    0 1px 2px 1px rgba(30, 35, 90, 0.4);

  /* footer */
  --docsearch-footer-height: 44px;
  --docsearch-footer-background: #fff;
  --docsearch-footer-shadow:
    0 -1px 0 0 rgb(224, 227, 232), 0 -3px 6px 0 rgba(69, 98, 155, 0.12);
}
```

## Components

- SearchBox
