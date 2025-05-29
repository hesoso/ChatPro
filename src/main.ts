import { createApp } from 'vue'
import { router } from './router'

import ContextMenu from '@imengyu/vue3-context-menu'
import VueVirtualScroller from 'vue-virtual-scroller'

import App from './App.vue'
import SvgIcon from './components/SvgIcon.vue'

import 'virtual:svg-icons-register'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'

const app = createApp(App)

app.component('SvgIcon', SvgIcon)
app.use(router)
app.use(VueVirtualScroller)
app.use(ContextMenu)

app.mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
