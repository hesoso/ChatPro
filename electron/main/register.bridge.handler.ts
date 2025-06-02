import { BrowserWindow, ipcMain, screen } from 'electron'

export function registerBridgeHandler() {
  /**
   *  最小化当前窗口
   */
  ipcMain.on('bridge:minimize', () => {
    console.log('Bridge minimize')
    const focusedWindow = BrowserWindow.getFocusedWindow()
    focusedWindow?.minimize()
  })
  /**
   * 最大化当前窗口
   */
  let isMax = false
  ipcMain.on('bridge:toggleMaximize', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    const width = isMax ? 1200 : screen.getPrimaryDisplay().workAreaSize.width
    const height = isMax ? 700 : screen.getPrimaryDisplay().workAreaSize.height
    focusedWindow?.setBounds({ x: 0, y: 0, width, height })
    focusedWindow?.center()
    isMax = !isMax
  })
  /**
   *  关闭当前窗口
   */
  ipcMain.on('bridge:closeWindow', () => {
    console.log('Bridge closed')
    const focusedWindow = BrowserWindow.getFocusedWindow()
    focusedWindow?.close()
  })
}
