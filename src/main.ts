import { App, createApp } from 'vue'
import { router } from './router'
import store from './store'
import ElementPlus from 'element-plus'
// @ts-ignore
import VueVirtualScroller from 'vue-virtual-scroller'

import { initMessageSocket, wsDeviceAuthReq } from './websocket'
import { useUserStore } from './store/user.ts'

import AppVue from './App.vue'
import SvgIcon from './components/SvgIcon.vue'

import 'virtual:svg-icons-register'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import 'element-plus/dist/index.css'

const app = createApp(AppVue)

app.component('SvgIcon', SvgIcon)
app.use(store)
app.use(router)
app.use(VueVirtualScroller)
app.use(ElementPlus)

const mountApp = async (app: App) => {
  const userStore = useUserStore()
  if (userStore.userInfo.host) {
    await initMessageSocket(userStore.userInfo)
    wsDeviceAuthReq(userStore.loginForm, () => {
      app.mount('#app')
    })
  } else {
    app.mount('#app')
  }
}

await mountApp(app)
