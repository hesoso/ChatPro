import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})


// contextBridge 是目前推荐的在预加载脚本中安全地向渲染进程暴露 API 的方式。避免直接将 ipcRenderer 暴露给渲染进程。
// IPC 通道命名规范： 为 IPC 消息通道定义清晰、一致的命名约定（例如，'db:query-chat-data'，'db:add-message'）。
// 异步处理： 大部分 IPC 通信应该是异步的，以避免阻塞主进程或渲染进程。使用 ipcRenderer.invoke (双向通信，返回 Promise) 和 
// ipcMain.handle 是现代 Electron 中处理异步请求/响应模式的最佳实践。对于单向事件，可以使用 ipcRenderer.send 和 ipcMain.on。
contextBridge.exposeInMainWorld('db', {
  fetchChatData: (params: { wxid: string }) => ipcRenderer.invoke('db:query-chat-data', params)
})


