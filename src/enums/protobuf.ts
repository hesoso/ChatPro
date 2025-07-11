
export enum ProtoBufferType {
  WsDeviceAuthReq = 'type.googleapis.com/protobuf.websocket.WsDeviceAuthReq',
  WsDeviceAuthResp = 'type.googleapis.com/protobuf.websocket.WsDeviceAuthResp',
  MsgNewNotice = 'type.googleapis.com/protobuf.common.MsgNewNotice',
  Error = 'type.googleapis.com/protobuf.common.Error'
}

export enum NoticeType {
  // 通用
  error = 0,                  // 异常(服务端->客服系统客户端)

  msgNewNotice = 100,         // 新消息通知(协议->服务端->客服系统客户端)
  msgSendReq = 101,           // 发送消息请求(客服系统客户端->服务端->协议)
  msgSendResp = 102,          // 发送消息响应(服务端->客服系统客户端)

// Socket
  deviceAuthReq = 1000,       // 设备认证请求(PC或APP终端->服务端)
  deviceAuthResp = 1001,      // 设备认证响应(服务端->PC或APP终端)

// WebSocket
  wsDeviceAuthReq = 2000,     // 设备认证请求(客服系统客户端->服务端)
  wsDeviceAuthResp = 2001,    // 设备认证响应(服务端->客服系统客户端)
}

export enum EnumMsgContentType {
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
}

