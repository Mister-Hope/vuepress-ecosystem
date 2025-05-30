import { useEventListener } from '@vueuse/core'

/**
 * Add hotkey listener, remove it after triggered
 */
export const useDocSearchHotkeyListener = (callback: () => void): void => {
  useEventListener(
    'keydown',
    (event) => {
      const isHotKeyBind = event.key === 'k' && (event.ctrlKey || event.metaKey)
      const isSlashKey = event.key === '/'

      if (!isSlashKey && !isHotKeyBind) {
        return
      }

      event.preventDefault()
      callback()
    },
    { once: true },
  )
}
