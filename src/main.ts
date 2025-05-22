import { createApp } from 'vue'
import { router } from './router'

import App from './App.vue'
import SvgIcon from './components/SvgIcon.vue'

import 'virtual:svg-icons-register'

const app = createApp(App)

app.component('SvgIcon', SvgIcon)
app.use(router)

app.mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
