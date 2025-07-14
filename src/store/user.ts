import { IDeviceAuthReqForm, ILoginForm, UserInfo } from '@/types/User';
import { defineStore } from 'pinia'

interface IState {
  userInfo: UserInfo;
  loginForm: ILoginForm;
  token: string;
}
interface IActions {
  SET_USERINFO: (userInfo: UserInfo) => void;
  SET_LOGINFORM: (loginForm: IDeviceAuthReqForm) => void;
  SET_TOKEN: (token: string) => void;
}

export interface IGetter<T> {
  GET_TOKEN: (state: T) => string;
  tokens: (state: T) => string;
  [key: string]: (state: T) => any;
}

export const useUserStore = defineStore<string, IState, IGetter<IState>, IActions>('user', {
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
    SET_LOGINFORM(loginForm: IDeviceAuthReqForm) {
      this.loginForm = loginForm
    },
  },
  getters: {
    GET_TOKEN: (state) => state.token,
    tokens(): string {
      return this.GET_TOKEN
    }
  },
  persist: {
    key: 'userStore', // 自定义存储键名
    storage: localStorage, // 使用 sessionStorage 而非 localStorage
    pick: ['userInfo', 'token', 'loginForm'], // 指定需要持久化的字段
  },
})
