// 消息内容类型枚举
enum MSG_CONTENT_TYPE {
  unknow = 0,           // 未知
  revoke = 1,           // 撤回
  read = 2,             // 已读
  text = 3,             // 文本
  emoji = 4,            // 表情
  image = 5,            // 图片(消息为缩略图, 查看大图时前端发起加载大图请求)
  voice = 6,            // 语音
  video = 7,            // 视频(消息为封面缩略图, 查看视频时前端发起加载视频请求)
  weapp = 8,            // 小程序
  sph = 9,              // 视频号
  luckymoney = 10,      // 红包
  link = 11,            // 链接
  namecard = 12,        // 名片
  file = 13,            // 文件(消息为文件链接, 查看时弹出文件保存地址并下载)
  quote = 14,           // 引用
  forward = 15,         // 转发
  transfer = 16,        // 转账
  sys = 999,            // 系统
  voiceToText = 100000, // 语音转文字
}

// 消息内容类型
type T_Msg_Content = MSG_CONTENT_TYPE

// 聊天类型(1:私聊,2:群聊,3:模拟)
type T_Chat = '1' | '2' | '3'

// 额外参数，确保多传的参数不影响主业务
interface I_Extra_Params {
    [p: string]: any
}

interface I_OnMessageParams extends I_Extra_Params {
    wechatId: string
    chatType: T_Chat
    sender: string
    receiver: string
    senderNickname: string
    msgId: string
    msgTime: number
    room: boolean
    contentType: T_Msg_Content
    content: string
    draft?: string
}


interface I_GetMessagesParams extends I_Extra_Params {
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

interface I_GetSessionsParams extends I_Extra_Params {
    wechatId: string
    options?: {
        limit?: number
        offset?: number
        search?: string
        onlyUnread?: boolean
    }
}