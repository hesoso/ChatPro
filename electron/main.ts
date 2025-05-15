import { app, BrowserWindow, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
// 导入数据库操作函数
import { addMessage, getMessagesBySessionId, User, NewMessage, Message } from './database/index' // 假设类型也从这里导出，如果不是，需要调整

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

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
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
  createWindow()

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
