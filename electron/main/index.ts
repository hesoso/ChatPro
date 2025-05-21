import { app, BrowserWindow } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'



import { initializeDatabase, getDB } from '../database/index'
import { regsiterDatabaseHandler } from './register.database'
import { registerBridgeHandler } from './register.bridge.handler'


const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

// 使用 ['ENV_NAME'] 的方式访问环境变量，避免 vite:define 插件对 process.env.ENV_NAME 的静态替换问题
// export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const VITE_DEV_SERVER_URL = 'http://localhost:5173'
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

const isDevelopment = process.env.NODE_ENV !== 'production'

let win: BrowserWindow | null

function createWindow() {
  if (win) {
    win.destroy()
    win = null
  }
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'logo.ico'),
    width: 1200,
    height: 760,
    frame: false, // 设置为 false 时用于创建无边框窗口
    resizable: false, // 窗口是否可以改变尺寸
    // transparent: true, // 用于设置窗口是否透明
    // maximizable: false, // 禁止最大化
    // autoHideMenuBar:true,// 是否隐藏菜单栏
    // titleBarStyle:'hidden',// 窗口标题栏的样式
    // backgroundColor: '#b2b2b2', // 窗口的背景颜色为十六进制值
    webPreferences: {
      preload: path.join(__dirname, 'index.mjs'),
      // nodeIntegration: true, // 控制是否在渲染进程中启用Node.js集成，为true时，渲染进程可使用Node.js的API
      backgroundThrottling: false, // 控制当应用在后台运行时是否限制 JavaScript 定时器
      devTools: isDevelopment, // 开发环境可以打开控制台
    },
  })

  // 在窗口创建后可以在这里添加自定义逻辑，比如设置窗口菜单、注册全局快捷键等
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })
  win.on('close', () => {
    win?.webContents.closeDevTools()
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}


// 除了 macOS 外，当所有窗口都关闭时退出应用。对于 macOS，通常应用和菜单栏会保持激活状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // 在 macOS 系统中，当用户点击 Dock 图标且没有其他窗口打开时，通常会重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 应用退出时 关闭数据库连接
app.on('will-quit', () => getDB()?.close);

app.whenReady().then(() => {
  // 初始化数据库
  initializeDatabase()
  // 创建窗口
  createWindow()
  // 注册数据库处理事件
  regsiterDatabaseHandler()
  // 注册桥方法
  registerBridgeHandler()
  // 安装vuedevtool
  const devToolsPath = path.join(
      __dirname,
      '../devtools/vue-devtool'
  )
  win?.webContents.session.loadExtension(devToolsPath).then((ex) => {
    console.log(ex)
    // win?.webContents.openDevTools()
  })
})
