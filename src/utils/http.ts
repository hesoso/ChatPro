import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../store/user.ts'

const http = axios.create({})

const getBaseHost = () => {
  const userStore = useUserStore()
  return userStore.userInfo.host ? `http://${userStore.userInfo.host}:13001` : 'http://124.220.48.101:13001'
}

const getToken = () => {
  const userStore = useUserStore()
  return userStore.token
}

http.interceptors.request.use(
  (config) => {
    config.url = getBaseHost() + config.url
    config.headers.token = getToken()
    return config
  },
  () => {}
)

http.interceptors.response.use(
  (res) => {
    const resData = res.data
    if (resData.code !== '1000') {
      ElMessage.error(resData.memo)
      return Promise.reject(resData.memo)
    }
    return res.data
  },
  () => {}
)

export default http
