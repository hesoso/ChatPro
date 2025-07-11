import { defineStore } from 'pinia'
import { ConversationModeEnum, ConversationStatusEnum } from '../enums/conversation.ts'
import { EnumConvoMode, EnumFlag } from '../views/workbench/Chat/types/chat.d.ts'
export const useConversationStore = defineStore('conversation', {
  state: () => ({
    chatPanel: {
      convoMode: '1',
      extractMemberMsgFlag: '0',
      targetContactFlag: '0',
      targetRoomFlag: '0',
      targetMemberFlag: '0',
    },
    conversationMode: EnumConvoMode.mix, // 当前选择的会话模式，如独立、组合、接待
    conversationStatus: ConversationStatusEnum.recepting, // 当前选中会话的状态，如待接待、接待中
    multipleMessageStatus: false, // 是否开启聊天消息多选
    at: false // 是否at别人
  }),
  actions: {
    setConversationMode(mode: EnumConvoMode) {
      this.chatPanel.convoMode = mode
    },
    setExtractMemberMsgFlag(flag: EnumFlag) {
      this.chatPanel.extractMemberMsgFlag = flag
    },
    setTargetFlag(field: String, val: EnumFlag) {
      this.chatPanel[field] = val
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
  persist: {
    key: 'conversationStore', // 自定义存储键名
    storage: localStorage, // 使用 sessionStorage 而非 localStorage
    paths: ['conversationMode'], // 指定需要持久化的字段
  },
})
