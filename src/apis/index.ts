import http from '../utils/http.ts'
import { UUID } from 'uuidjs'
import moment from 'moment'
import { ChatModePanel } from '../views/workbench/Chat/types/chat'
import { UserInfo } from '@/types/User.ts'

interface loginUser {
  mobile: string
}
interface UserDeviceForm {
  keyword?: string
}

const commonParams = () => {
  return {
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    sign: UUID.generate(),
  }
}

export const getUser = ({ mobile }: loginUser): Promise<HttpResponse<UserInfo>> => {
  return http.post('/bee/user/getUser', {
    method: 'getUser',
    mobile: mobile,
    ...commonParams()
  })
}

export const getUserDevice = <T = unknown>(data: UserDeviceForm): Promise<HttpResponse<T>> => {
  return http.post('/bee/device/getUserDevice', {
    method: 'getUserDevice',
    keyword: data?.keyword,
    ...commonParams()
  })
}



export const getPanel = (): Promise<HttpResponse<ChatModePanel>> => {
  return http.post('/bee/panel/getPanel', {
    method: 'getPanel',
    ...commonParams()
  });
};


export const changePanel = (params: ChatModePanel) => {
  return http.post('/bee/panel/changePanel', {
    method: 'changePanel',
    ...params,
    ...commonParams()
  })
}
