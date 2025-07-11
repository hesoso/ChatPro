import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      host: '',
      userId: '',
      nickName: '',
      avatar: '',
      remark: '',
      userType: '',
      status: '',
      cssOnlineStatus: '',
      certStatus: '',
      certNo: '',
      certName: '',
      companyName: '',
      logo: '',
      slogan: ''
    },
    loginForm: {
      username: '',
      password: ''
    },
    token: ''
  }),
  actions: {
    SET_USERINFO(userInfo: UserInfo) {
      this.userInfo = userInfo
    },
    SET_TOKEN(token: string) {
      this.token = token
    },
    SET_LOGINFORM(loginForm: deviceAuthReqForm) {
      this.loginForm = loginForm
    },
  },
  getters: {
    GET_TOKEN: (state) => state.token
  },
  persist: {
    key: 'userStore', // 自定义存储键名
    storage: localStorage, // 使用 sessionStorage 而非 localStorage
    paths: ['userInfo', 'token'], // 指定需要持久化的字段
  },
})
