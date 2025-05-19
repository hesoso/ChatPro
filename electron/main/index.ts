import { app, BrowserWindow } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { initializeDatabase, getDB } from '../database/index'
import { regsiterDatabaseHandler } from './register.database'

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

// 使用 ['ENV_NAME'] 的方式访问环境变量，以避免 Vite@2.x 的 vite:define 插件对 process.env.ENV_NAME 的静态替换问题
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'logo.ico'),
    minWidth: 1200,
    minHeight: 760,
    center: true,
    webPreferences: {
      preload: path.join(__dirname, 'index.mjs'),
    },
  })

  // 在窗口创建后可以在这里添加自定义逻辑，比如设置窗口菜单、注册全局快捷键等
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
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
})
