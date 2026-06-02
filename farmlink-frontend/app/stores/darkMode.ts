import { defineStore } from 'pinia'

export const useDarkModeStore = defineStore('darkMode', {
  state: () => ({
    isDark: false,
  }),
  actions: {
    toggleDark() {
      this.isDark = !this.isDark
      localStorage.setItem('darkMode', this.isDark ? '1' : '0')
      document.documentElement.classList.toggle('dark', this.isDark)
    },
    initDark() {
      const saved = localStorage.getItem('darkMode')
      this.isDark = saved === '1'
      document.documentElement.classList.toggle('dark', this.isDark)
    }
  }
})