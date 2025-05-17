import { ipcRenderer, contextBridge } from 'electron'
import './expose.database'

// 尝试从主进程的 database 模块导入类型，路径可能需要根据实际结构调整
// 如果 preload.ts 和 main.ts 在同一目录，而 database 是 main.ts 的同级或子级目录，路径可能类似 './database/index'
// 鉴于 preload.ts 通常与 main.ts 在同一输出目录 (dist-electron)，且 database 也在那里被 main.ts 引用，
// 我们可能需要更通用的类型定义，或者在构建时确保类型可访问。
// 为简单起见，这里暂时不导入具体类型，但在渲染进程中调用时，你应该清楚参数结构。
// 或者，更好的做法是在共享的 .d.ts 文件中定义这些类型。、

// contextBridge 是目前推荐的在预加载脚本中安全地向渲染进程暴露 API 的方式。避免直接将 ipcRenderer 暴露给渲染进程。
// IPC 通道命名规范： 为 IPC 消息通道定义清晰、一致的命名约定（例如，'db:query-chat-data'，'db:add-message'）。
// 异步处理： 大部分 IPC 通信应该是异步的，以避免阻塞主进程或渲染进程。使用 ipcRenderer.invoke (双向通信，返回 Promise) 和 
// ipcMain.handle 是现代 Electron 中处理异步请求/响应模式的最佳实践。对于单向事件，可以使用 ipcRenderer.send 和 ipcMain.on。


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
})
