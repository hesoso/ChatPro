interface Msg<T = any> {
  id: string
  refId: string
  token: string
  noticeType: string
  data: AnyData<T>
}

interface AnyData<T> {
  type_url: string,
  value: T
}

interface WsDeviceAuthResp {
  token: string
}

interface MessageBuffer {
  getWsDeviceAuthBuffer(playLoad: deviceAuthReqForm): Buffer
  decodeBuffer(data: Msg): Msg
}
