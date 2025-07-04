import { watchImmediate } from '@vueuse/core'
import type { MaybeRef, Ref } from 'vue'
import { isRef, toValue } from 'vue'
import { useSiteLocale, withBase } from 'vuepress/client'
import { Watermark } from 'watermark-js-plus'
import type { WatermarkOptions } from '../helper/index.js'

/**
 * Setup watermark functionality
 *
 * 设置水印功能
 *
 * @param options - Watermark options / 水印选项
 * @param enabled - Whether watermark is enabled / 是否启用水印
 */
export const setupWatermark = (
  options: MaybeRef<WatermarkOptions>,
  enabled: Ref<boolean>,
): void => {
  if (__VUEPRESS_SSR__) return

  const siteLocale = useSiteLocale()

  const watermark = new Watermark()

  const updateWaterMark = (): void => {
    if (toValue(enabled)) {
      const watermarkOptions = {
        // set default text to site title
        content: siteLocale.value.title,
        // set font color to make it readable both lightmode and darkmode
        fontColor: '#76747f',
        // default alpha of blind mode is 0.005 while default mode is 0.165
        globalAlpha: toValue(options).mode === 'blind' ? 0.005 : 0.165,
        ...toValue(options),
      }

      if (watermarkOptions.image?.startsWith('/')) {
        watermarkOptions.image = withBase(watermarkOptions.image)
      }

      void watermark.changeOptions(watermarkOptions)
    } else {
      watermark.destroy()
    }
  }

  watchImmediate([enabled, isRef(options) ? options : null], updateWaterMark, {
    flush: 'post',
  })
}
