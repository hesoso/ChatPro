import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    speechArtPanelShow: true // 是否显示右侧的话术面板
  }),
  actions: {
    toggleSpeechArtPanel() {
      this.speechArtPanelShow = !this.speechArtPanelShow
    },
    persist: true
  }
})
