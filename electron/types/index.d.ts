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

// 聊天类型 (1:私聊 2:群聊 3:模拟)
type T_Chat = '1' | '2' | '3'

// 额外参数，确保多传的参数不影响主业务
interface I_Extra_Params {
    [p: string]: any
}

// -- 消息表 (T_BEE_CHAT_MSG)
// CREATE TABLE IF NOT EXISTS T_BEE_CHAT_MSG (
//     ID                  INTEGER PRIMARY KEY AUTOINCREMENT, -- '主键'
//     WECHAT_ID           TEXT NOT NULL, -- '微信ID'
//     CHAT_TYPE           TEXT, -- '聊天类型(1:私聊,2:群聊,3:模拟)'
//     SENDER              TEXT NOT NULL, -- '发送人(微信ID|群成员微信ID|模拟群成员微信ID)'
//     SENDER_AVATAR       TEXT, -- '发送人头像'
//     SENDER_NICKNAME     TEXT, -- '发送人昵称'
//     RECEIVER            TEXT NOT NULL, -- '接收人(微信ID|群ID|模拟群成员微信ID)'
//     RECEIVER_AVATAR     TEXT, -- '接收人头像'
//     RECEIVER_NICKNAME   TEXT, -- '接收人昵称'
//     SOURCE_ROOM_AVATAR  TEXT, -- '来源群头像'
//     SOURCE_ROOM_NAME    TEXT, -- '来源群名称'
//     MSG_ID              TEXT NOT NULL, -- '消息ID'
//     CONTENT_TYPE        TEXT, -- '消息类型(@枚举)'
//     CONTENT             TEXT, -- '消息内容'
//     REVOKE_FLAG         TEXT, -- '撤回标识(1:是,0:否)'
//     CLIENT_FLAG         TEXT, -- '客户端消息标识(1:是,0:否)' 默认传1
//     SEND_USER_ID        TEXT, -- '发送用户ID'
//     SEND_USER_NICKNAME  TEXT, -- '发送用户昵称'
//     CREATE_BY           TEXT, -- '创建人'
//     CREATE_TIME         INTEGER, -- '创建时间'
//     UPDATE_BY           TEXT, -- '修改人'
//     UPDATE_TIME         INTEGER,  -- '修改时间'
//     QUOTE_MSG_ID        TEXT, -- '引用消息ID'
//     SEND_FLAG           TEXT -- '消息方向(0:接收,1:发送)'
// );

interface I_OnMessageParams extends I_Extra_Params {
    wechatId: string // 微信ID
    chatType: T_Chat
    sender: string // 发送人(微信ID|群成员微信ID|模拟群成员微信ID)
    receiver: string // 接收人(微信ID|群ID|模拟群成员微信ID)
    senderNickname: string // 发送人昵称
    msgId: string // 消息ID
    msgTime: number // 消息创建时间
    room: boolean // 是否群聊
    contentType: T_Msg_Content
    content: string // 消息内容
    draft?: string // 草稿内容
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