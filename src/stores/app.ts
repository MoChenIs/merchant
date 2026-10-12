import { defineStore } from 'pinia'
import type { Activity, Theme, Todo } from '@/types/common'
import { activitiesMock, todosMock } from '@/mocks/activity'

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: (localStorage.getItem('shixiao_theme') as Theme) || ('light' as Theme),
    currentStoreId: 's-101',
    notificationVisible: false,
    activities: activitiesMock as Activity[],
    todos: todosMock as Todo[],
  }),
  actions: {
    applyTheme() {
      document.documentElement.setAttribute('data-theme', this.theme)
      document.documentElement.classList.toggle('dark', this.theme === 'dark')
    },
    setTheme(theme: Theme) {
      this.theme = theme
      localStorage.setItem('shixiao_theme', theme)
      this.applyTheme()
    },
    toggleTheme() {
      this.setTheme(this.theme === 'light' ? 'dark' : 'light')
    },
    setCurrentStore(id: string) {
      this.currentStoreId = id
    },
    openNotification() {
      this.notificationVisible = true
    },
    closeNotification() {
      this.notificationVisible = false
    },
  },
})
