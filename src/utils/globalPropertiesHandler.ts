let rootApp: any = null

export default {
  install(app: any) {
    rootApp = app
  }
}

export const installGlobalProperties = (key: string, value: any) => {
  rootApp.config.globalProperties[key] = value
}
