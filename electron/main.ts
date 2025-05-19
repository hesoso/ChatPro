import {app, BrowserWindow, ipcMain, Menu, remote, screen, Tray} from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
// 导入数据库操作函数
import { addMessage, getMessagesBySessionId, User, NewMessage, Message } from './database/index'
import {execFile} from "child_process"; // 假设类型也从这里导出，如果不是，需要调整

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

const isDevelopment = process.env.NODE_ENV !== 'production'

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
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
    width:1000,
    height: 711,
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

  // Test active push message to Renderer-process.
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
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  size = screen.getPrimaryDisplay().workAreaSize
  createWindow()

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

  // ---- IPC Handlers for Database Operations ----
  ipcMain.handle('db:add-message', async (_event, messageData: NewMessage) => {
    try {
      // 注意：实际项目中，messageData 可能需要进行更严格的验证和清理
      const result = addMessage(messageData)
      return { success: true, data: result }
    } catch (error) {
      console.error('IPC Error - db:add-message:', error)
      return { success: false, error: (error as Error).message || 'Failed to add message' }
    }
  })

  ipcMain.handle('db:get-messages', async (_event, params: { sessionId: string; limit?: number; offset?: number; orderByTimestamp?: 'ASC' | 'DESC' }) => {
    try {
      const { sessionId, limit, offset, orderByTimestamp } = params
      // 参数验证和默认值处理可以在这里做得更细致
      const messages = getMessagesBySessionId(sessionId, limit, offset, orderByTimestamp)
      return { success: true, data: messages }
    } catch (error) {
      console.error('IPC Error - db:get-messages:', error)
      return { success: false, error: (error as Error).message || 'Failed to get messages' }
    }
  })
  // 你preload.ts中的 db:query-chat-data 好像是用于获取特定用户聊天数据的，我们可以复用 getMessagesBySessionId
  // 或者如果你有更具体的针对 wxid 的查询逻辑，可以单独实现
  ipcMain.handle('db:query-chat-data', async (_event, params: { wxid: string; limit?: number; offset?: number; orderByTimestamp?: 'ASC' | 'DESC' }) => {
    try {
      // 假设 wxid 就是 sessionId，如果不是，你需要调整这里的逻辑
      // 例如，你可能需要一个函数来从 wxid 找到对应的 session_id
      const sessionId = params.wxid
      const { limit, offset, orderByTimestamp } = params
      const messages = getMessagesBySessionId(sessionId, limit, offset, orderByTimestamp)
      return { success: true, data: messages }
    } catch (error) {
      console.error('IPC Error - db:query-chat-data:', error)
      return { success: false, error: (error as Error).message || 'Failed to query chat data' }
    }
  })

})
