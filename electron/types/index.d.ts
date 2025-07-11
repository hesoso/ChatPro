// 聊天类型(1:私聊,2:群聊,3:模拟)
type T_Chat = '1' | '2' | '3'

// 消息类型(@枚举)
type T_Message = '1' | '2'

// 额外参数，多传不影响主业务逻辑
interface I_Extra_Params {
    [p: string]: any
}

interface I_OnMessageParams {
    wechatId: string
    chatType: T_Chat
    sender: string
    receiver: string
    senderNickname: string
    msgId: string
    msgTime: number
    room: boolean
    contentType: TMessage
    content: string
    draft?: string
}


interface I_GetMessagesParams {
    wechatId: string
    convoId: string
    chatType: T_Chat
    options?: {
        limit?: number
        offset?: number
        beforeTime?: number
        afterTime?: number
    }
}

interface I_GetSessionsParams {
    wechatId: string
    options?: {
        limit?: number
        offset?: number
        search?: string
        onlyUnread?: boolean
    }
}