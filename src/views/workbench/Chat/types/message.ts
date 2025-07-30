export interface CpMessage {
  type: number
  content: string
  nickname: string
  avatar: string
  isSelf: boolean
}
export interface CpMessageProps {
  messageData: CpMessage
}
