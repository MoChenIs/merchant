import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import type { Theme } from '@/types/common'

/** 主题切换的薄封装（底层状态在 app store，DOM 副作用也由 store 负责） */
export function useTheme() {
  const appStore = useAppStore()

  const theme = computed(() => appStore.theme)
  const isDark = computed(() => appStore.theme === 'dark')

  const toggle = () => appStore.toggleTheme()
  const set = (t: Theme) => appStore.setTheme(t)

  return { theme, isDark, toggle, set }
}
