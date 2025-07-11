export enum EnumWechatType {
  wechat = 'wechat',
  wework = 'wework'
}

export enum EnumConvoMode {
  single = '1',
  mix = '2',
  server = '3'
}

export enum EnumConvoModeNames {
  '1' = '独立',
  '2' = '组合',
  '3' = '接待'
}

export enum EnumFlag {
  YES = '1',
  NO = '0'
}

export interface RobotDeviceModel {
  avatar: string,
  createTime: string,
  deviceName: string,
  deviceRemark: string,
  deviceStatus: string,
  expireTime: string,
  guid: string,
  guidLimitKey: string,
  id: string,
  onlineStatus: string,
  nickname: string,
  updateTime: string,
  wechatId: string,
  wechatType: EnumWechatType, // 微信类型(wechat:个微,wework:企微)
}

export interface ChatModePanel {
  convoMode?: EnumConvoMode, //会话模式(1:独立,2:组合,3:接待)
  extractMemberMsgFlag?: EnumFlag, //提取群成员消息标识(1:提取,0:不提取)
  targetContactFlag?: EnumFlag, //目标联系人标识(1:聚合或接待联系人,0:否)
  targetRoomFlag?: EnumFlag,  //目标群标识(1:聚合或接待联系人,0:否)
  targetMemberFlag?: EnumFlag, //目标群成员标识(提取群成员消息标识开启后生效)(1:聚合或接待联系人,0:否)
}
