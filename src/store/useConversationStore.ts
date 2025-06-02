import { defineStore } from 'pinia'
import { ConversationModeEnum, ConversationStatusEnum } from '../enums/conversation.ts'

export const useConversationStore = defineStore('conversation', {
  state: () => ({
    conversationMode: ConversationModeEnum.independent, // 当前选择的会话模式，如独立、组合、接待
    conversationStatus: ConversationStatusEnum.recepting, // 当前选中会话的状态，如待接待、接待中
    multipleMessageStatus: false, // 是否开启聊天消息多选
    at: false // 是否at别人
  }),
  actions: {
    setConversationMode(mode: number) {
      this.conversationMode = mode
    },
    setConversationStatus(status: number) {
      this.conversationStatus = status
    },
    setMultipleMessageStatus(status: boolean) {
      this.multipleMessageStatus = status
    },
    setAt(a: boolean) {
      this.at = a
    }
  },
  // persist: true
})
