import { h } from 'vue'
import MessageText from '../components/MessageText.vue'
import { CpMessageProps } from '../types/message'

export const MessageContent = (props: CpMessageProps) => {
  return h(MessageText, props, '')
}
