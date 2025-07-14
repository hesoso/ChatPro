interface Msg<T = any> {
  id: string
  refId: string
  token: string
  noticeType: number
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
  getWsDeviceAuthBuffer(playLoad: IDeviceAuthReqForm): Buffer
  decodeBuffer(data: Msg): Msg
}
