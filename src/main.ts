import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { router } from './router'

import App from './App.vue'
// import SvgIcon from './components/SvgIcon/index.vue'

import 'element-plus/dist/index.css'
import './styles/global.scss'
import './styles/dialog.scss'

// import './icons/index.js'

const app = createApp(App)

// app.component('SvgIcon', SvgIcon)
app.use(ElementPlus)
app.use(router)

app.mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })

  window.addEventListener('keydown', (evt) => {
    if (evt.keyCode === 123) {
      // 打开控制台
    }
  })
})
