import { BrowserWindow, ipcMain } from 'electron'

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
  ipcMain.on('bridge:toggleMaximize', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    const isMax = focusedWindow?.isMaximized()
    isMax ? focusedWindow?.unmaximize() : focusedWindow?.maximize()
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
