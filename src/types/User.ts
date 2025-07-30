export interface UserInfo {
  host: string,
  userId: string,
  nickName: string,
  avatar: string,
  remark: string,
  userType: string,
  status:string,
  cssOnlineStatus: string,
  certStatus: string,
  certNo: string,
  certName: string,
  companyName: string,
  logo: string,
  slogan: string,
}
export interface IDeviceAuthReqForm {
  username: string,
  password: string
}
export interface ILoginForm {
  username: string,
  password: string
}

