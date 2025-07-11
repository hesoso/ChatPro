import { initProtobuf } from '../protobuf'
import { ProtoBufferType } from '../enums/protobuf.ts'
import { deviceAuthReqForm } from '../types/User'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../store/user.ts'

let megSocket: MessageSocket

class MessageSocket {
  socket: WebSocket | null = null
  MessageBuffer: MessageBuffer
  connectFlag: boolean = false
  deviceAuthCallback: Array<Function> = []

  constructor(MessageBuffer: MessageBuffer) {
    this.MessageBuffer = MessageBuffer
  }

  initSocket(userInfo: UserInfo) {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.getSocketUrl(userInfo.host))

      this.socket.binaryType = 'arraybuffer'
      // 当 WebSocket 连接成功时发送消息
      this.socket.onopen = () =>  {
        console.log('WebSocket 连接已建立！')
        this.connectFlag = true
        resolve(null)
      }

      // 当接收到消息
      this.socket.onmessage = (event) => {
        console.log('接收到消息：', event)
        this.decodeWsResp(event.data)
      }

      // 当 WebSocket 连接关闭时
      this.socket.onclose = function () {
        console.log('WebSocket 连接已关闭')
      }

      // 当发生错误时
      this.socket.onerror = function (error) {
        console.error('WebSocket 错误:', error)
        reject()
      }
    })
  }

  getSocketUrl(host:string) {
    return 'ws://' + host + ':13003/ws'
  }

  decodeWsResp(data: any) {
    const res = this.MessageBuffer.decodeBuffer(data)
    // 收到鉴权成功的请求
    if (res.data.type_url === ProtoBufferType.WsDeviceAuthResp) {
      console.log('鉴权成功', res)
      const userStore = useUserStore()
      userStore.SET_TOKEN(res.data.value.token)
      this.deviceAuthCallback.forEach((fn) => {
        fn(res)
      })
      this.deviceAuthCallback.length = 0
    } else if (res.data.type_url === ProtoBufferType.Error) {
      ElMessage.error(res.data.value.memo)
    }
  }

  sendMessage(playload: any) {
    const msgBuffer = this.MessageBuffer.getWsDeviceAuthBuffer(playload)
    this.socket?.send(msgBuffer);
  }

  // 发送鉴权请求
  wsDeviceAuthReq(formData: deviceAuthReqForm) {
    const msgBuffer = this.MessageBuffer.getWsDeviceAuthBuffer(formData)
    this.socket?.send(msgBuffer);
  }
}


export const initMessageSocket = async (userInfo: UserInfo) => {
  const MessageBuffer: any = await initProtobuf()
  megSocket = new MessageSocket(MessageBuffer)
  await megSocket.initSocket(userInfo)
  return megSocket
}

export const wsDeviceAuthReq = (data: deviceAuthReqForm, cb?: Function) => {
  megSocket.wsDeviceAuthReq(data)
  cb && megSocket.deviceAuthCallback.push(cb)
}
