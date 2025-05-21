import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('bridge', {
  toggleDevTool: () => {
    console.log('toggleDevTool')
  },
  minimize: () => ipcRenderer.send('bridge:minimize'),
  closeWindow: () => ipcRenderer.send('bridge:closeWindow')
})
