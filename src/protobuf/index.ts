import protobuf from 'protobufjs'
import { UUID } from 'uuidjs'
import { EnumMsgContentType, NoticeType, ProtoBufferType } from '../enums/protobuf.ts'

class MessageBuffer {
  Any
  WsDeviceAuthReq
  WsDeviceAuthResp
  MsgNewNotice
  TextNotice
  MsgSendReq
  MsgSendResp
  Msg
  Error
  constructor(protobufRoot: any) {
    this.Any = protobufRoot.lookupType('google.protobuf.Any')
    this.WsDeviceAuthReq = protobufRoot.lookupType('protobuf.websocket.WsDeviceAuthReq')
    this.WsDeviceAuthResp = protobufRoot.lookupType('protobuf.websocket.WsDeviceAuthResp')
    this.Error = protobufRoot.lookupType('protobuf.common.Error')
    this.MsgNewNotice = protobufRoot.lookupType('protobuf.common.MsgNewNotice')
    this.TextNotice = protobufRoot.lookupType('protobuf.common.TextNotice')
    this.MsgSendReq = protobufRoot.lookupType('protobuf.common.MsgSendReq')
    this.MsgSendResp = protobufRoot.lookupType('protobuf.common.MsgSendResp')
    this.Error = protobufRoot.lookupType('protobuf.common.Error')

    this.Msg = protobufRoot.lookupType('protobuf.Msg')
  }

  // 鉴权buffer
  getWsDeviceAuthBuffer(payload: deviceAuthReqForm) {
    const payloadBuffer = this.WsDeviceAuthReq.encode({
      username: payload.username,
      password: payload.password,
    }).finish()

    const anyPayload = {
      type_url: ProtoBufferType.WsDeviceAuthReq,
      value: payloadBuffer
    }

    const msgPayload = {
      id: UUID.generate(),
      refId: '',
      token: '',
      noticeType: 2000,
      data: anyPayload
    }
    const msgBuffer = this.Msg.encode(msgPayload).finish()

    console.log(msgBuffer)

    return msgBuffer
  }

  decodeBuffer(msg: Buffer) {
    const buffer = new Uint8Array(msg)
    const decodedMsg = this.Msg.decode(buffer)
    console.log('解码后的 Msg:', decodedMsg)
    const decodedAny = decodedMsg.data

    // 解码业务数据
    // 根据不同的type_url,使用对应的proto来解码
    if (decodedMsg.noticeType === NoticeType.wsDeviceAuthResp) {
      decodedAny.value = this.WsDeviceAuthResp.decode(decodedAny.value)
    } else if (decodedMsg.noticeType === NoticeType.msgNewNotice) {
      decodedAny.value = this.MsgNewNotice.decode(decodedAny.value)
      let msgContent = ''
      if (decodedAny.value.contentType === EnumMsgContentType.text) {
        msgContent = this.TextNotice.decode(decodedAny.value.content.value)
      }
      decodedAny.value.content.value = msgContent
    } else if (decodedMsg.noticeType === NoticeType.error) {
      decodedAny.value = this.Error.decode(decodedAny.value)
    } else {
      console.error('为匹配到noticeType 解码失败')
    }
    decodedMsg.data = decodedAny
    console.log('解码结果:', decodedMsg)
    // console.log('解码结果:', JSON.stringify(decodedMsg.data))
    return decodedMsg
  }
}

export const initProtobuf = () => {
  return new Promise((resolve, reject) => {
    protobuf.load([
      'proto/websocket/WsDeviceAuthReq.proto',
      'proto/websocket/WsDeviceAuthResp.proto',
      'proto/common/Error.proto',
      'proto/common/MsgNewNotice.proto',
      'proto/common/MsgSendReq.proto',
      'proto/common/MsgSendResp.proto',
      'proto/Msg.proto'
    ], function (err, root) {
      if (err) {
        console.log(err)
        reject(err)
        return
      }
      resolve(new MessageBuffer(root))
    })
  })
}
