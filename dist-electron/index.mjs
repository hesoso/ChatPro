"use strict";
const electron = require("electron");
var DB_EVENTS = /* @__PURE__ */ ((DB_EVENTS2) => {
  DB_EVENTS2["ON_MESSAGE"] = "DB:ON_MESSAGE";
  DB_EVENTS2["GET_MESSAGES"] = "DB:GET_MESSAGES";
  DB_EVENTS2["GET_SESSIONS"] = "DB:GET_SESSIONS";
  return DB_EVENTS2;
})(DB_EVENTS || {});
electron.contextBridge.exposeInMainWorld("databaseApi", {
  /**
   * 新的聊天消息
   * @param params - 见 I_OnMessageParams 类型定义
   * @returns Promise
   */
  onMessage: (params) => electron.ipcRenderer.invoke(DB_EVENTS.ON_MESSAGE, params),
  /**
   * 根据会话ID获取消息列表
   * @param params - 见 I_GetMessagesParams 类型定义
   * @returns Promise
   */
  getMessages: (params) => electron.ipcRenderer.invoke(DB_EVENTS.GET_MESSAGES, params),
  /**
   * 查询会话列表
   * @param params - 见 I_GetSessionsParams 类型定义
   * @returns Promise
   */
  getSessions: (params) => electron.ipcRenderer.invoke(DB_EVENTS.GET_SESSIONS, params)
});
electron.contextBridge.exposeInMainWorld("bridge", {
  toggleDevTool: () => {
    console.log("toggleDevTool");
  },
  minimize: () => electron.ipcRenderer.send("bridge:minimize"),
  closeWindow: () => electron.ipcRenderer.send("bridge:closeWindow"),
  toggleMaximize: () => electron.ipcRenderer.send("bridge:toggleMaximize")
});
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
