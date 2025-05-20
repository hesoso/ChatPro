import { app, BrowserWindow, Tray, ipcMain } from 'electron'
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

const isDevelopment = process.env.NODE_ENV !== 'production'
let win = null
let size = null
let timer = null
let count = -1
let appTray = null

const iconUrl = isDevelopment ? 'public/app.ico' : `${__dirname}/app.ico`
const emptyUrl = isDevelopment ? 'public/empty.ico' : `${__dirname}/empty.ico`

function createWindow() {
  win = new BrowserWindow({
    // icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    // width: 1440, // 宽
    // height: 900, // 高
    width: 1200,
    height: 760,
    icon: iconUrl,
    frame: false, // 设置为 false 时可以创建一个无边框窗口
    transparent: true,
    resizable: false, // 窗口是否可以改变尺寸
    maximizable: false, // 禁止最大化
    // autoHideMenuBar:true,// 是否隐藏菜单栏
    // titleBarStyle:'hidden',// 窗口标题栏的样式
    // backgroundColor: '#fff', // 窗口的背景颜色为十六进制值
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: true,
      backgroundThrottling: false,
      // 开发环境可以打开控制台
      // devTools: isDevelopment,
      devTools: true
    },
  })

  // 在窗口创建后可以在这里添加自定义逻辑，比如设置窗口菜单、注册全局快捷键等
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  ipcMain.on('operations', function (event, arg) {
    // 登录后的窗口大小
    const width = size.width * 0.7 > 1150 ? size.width * 0.7 : 1150
    const height = size.height * 0.7 > 735 ? size.height * 0.7 : 735
    // 屏幕的大小
    const bw = size.width
    const bh = size.height
    switch (arg) {
      case 'newMsg':
        // 菜单栏闪烁
        win?.flashFrame(true)
        // 任务栏 闪烁
        if (!win?.isVisible() && !timer) {
          timer = setInterval(function () {
            count++
            if (count % 2 === 0) {
              appTray.setImage(emptyUrl)
            } else {
              appTray.setImage(iconUrl)
            }
          }, 500)
        }
        break
      case 'exit':
        app.quit()
        break
      case 'login':
        // win.setSize(width, height)
        win?.center()
        break
      case 'logout':
        {
          const x = parseInt((bw - 700) / 2, 10)
          const y = parseInt((bh - 415) / 2, 10)
          win?.setBounds({ x: x, y: y, width: 700, height: 415 })
          // app.relaunch()
          // app.quit()
        }
        // app.exit()
        break
      case 'min':
        // 最小化
        if (win?.isVisible()) {
          win?.minimize()
        }
        break
      case 'max':
        {
          // 最大化或者还原
          // 当前窗口的大小
          const currentWindow = win?.getContentBounds()
          const cw = currentWindow?.width
          // let ch = currentWindow.height
          // 中心坐标
          const x = parseInt((bw - width) / 2, 10)
          const y = parseInt((bh - height) / 2, 10)
          if (cw >= bw) {
            // 还原
            win?.setBounds({ x: x, y: y, width: Math.round(width), height: Math.round(height) })
          } else {
            // 最大化
            win?.setSize(bw, bh)
            win?.center()
          }
        }
        break
      case 'hidden':
        // 隐藏窗口
        if (win?.isVisible()) {
          win?.hide()
        }
        break
      case 'screencap':
        {
          const cmdPath =
            process.env.NODE_ENV === 'development' ? 'public/screen/PrintScr.exe' : `${__dirname}/screen/PrintScr.exe`
          // 和渲染进程通讯
          // win.webContents.send('screencap', cmdPath)
          // 截屏
          const screen_window = execFile(cmdPath)
          screen_window.on('exit', function (code) {
            // 执行成功返回 1，返回 0 没有截图
            if (code) {
              win?.webContents.paste()
            }
          })
        }
        break
      default:
        break
    }
  })

  ipcMain.on('resize-win', (event, width, height) => {
    win?.setSize(width, height)
    win?.center()
  })

  win.webContents.openDevTools({
    mode: 'detach'
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

  size = screen.getPrimaryDisplay().workAreaSize

  if (process.platform === 'win32') {
    // 系统托盘图标
    appTray = new Tray(iconUrl)
    // 设置此托盘图标的悬停提示内容
    appTray.setToolTip('客服系统')

    // 设置托盘图标和菜单
    const trayMenuTemplate = [
      // {
      //     label: '打开',
      //     click: () => {
      //         win.show();
      //     }
      // },
      {
        label: '退出',
        click: () => {
          app.quit()
          app.quit() // 因为程序设定关闭为最小化，所以调用两次关闭，防止最大化时一次不能关闭的情况
          // win.webContents.send('operations', 'exit')
        }
      },
      {
        label: '打开/关闭机器人',
        click: () => {
          win.webContents.send('quitMenu', false)
        }
      }
    ]
    // 图标的上下文菜单
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
    // 设置此图标的上下文菜单
    appTray.setContextMenu(contextMenu)

    // 单击右下角小图标显示应用左键
    appTray.on('click', () => {
      if (global.sharedObject.currentWin === 'client') {
        win.isVisible() ? win.hide() : win.show()
      }
      // 不闪烁
      if (timer) {
        clearInterval(timer)
        timer = null
        count = 0
        appTray.setImage(iconUrl)
      }
    })

    // 右键
    appTray.on('right-click', () => {
      appTray.popUpContextMenu(trayMenuTemplate)
    })
  }
})
