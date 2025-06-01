import { defineStore } from 'pinia'
import { ConversationModeEnum, ConversationStatusEnum } from '../enums/conversation.ts'

export const useConversationStore = defineStore('conversation', {
  state: () => ({
    conversationMode: ConversationModeEnum.independent,
    conversationStatus: ConversationStatusEnum.wait
  }),
  actions: {
    setConversationMode(mode: number) {
      this.conversationMode = mode
    },
    setConversationStatus(status: number) {
      this.conversationStatus = status
    }
  },
  persist: true
})
