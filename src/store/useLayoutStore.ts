import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    speechArtPanelShow: true
  }),
  actions: {
    toggleSpeechArtPanel() {
      this.speechArtPanelShow = !this.speechArtPanelShow
    },
    persist: true
  }
})
