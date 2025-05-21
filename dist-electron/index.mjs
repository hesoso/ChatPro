"use strict";
const electron = require("electron");
var DB_EVENTS = /* @__PURE__ */ ((DB_EVENTS2) => {
  DB_EVENTS2["AddMessage"] = "db:add-message";
  DB_EVENTS2["GetMessages"] = "db:get-messages";
  DB_EVENTS2["GetChatData"] = "db:query-chat-data";
  return DB_EVENTS2;
})(DB_EVENTS || {});
electron.contextBridge.exposeInMainWorld("db", {
  /**
   * 根据 wxid (作为 sessionId) 查询聊天数据。
   * @param params - 包含 wxid 和可选分页参数的对象。
   * @returns Promise，解析为包含 success 和 data/error 的对象。
   */
  fetchChatData: (params) => electron.ipcRenderer.invoke(DB_EVENTS.GetChatData, params),
  /**
   * 添加一条新的聊天消息。
   * @param messageData - 消息数据。
   * @returns Promise，解析为包含 success 和 data (包含 id 和 timestamp) / error 的对象。
   */
  addMessage: (messageData) => electron.ipcRenderer.invoke(DB_EVENTS.AddMessage, messageData),
  /**
   * 根据会话ID获取消息列表。
   * @param params - 包含 sessionId 和可选分页参数的对象。
   * @returns Promise，解析为包含 success 和 data (消息数组) / error 的对象。
   */
  getMessages: (params) => electron.ipcRenderer.invoke(DB_EVENTS.GetMessages, params)
});
electron.contextBridge.exposeInMainWorld("bridge", {
  toggleDevTool: () => {
    console.log("toggleDevTool");
  },
  minimize: () => electron.ipcRenderer.send("bridge:minimize"),
  closeWindow: () => electron.ipcRenderer.send("bridge:closeWindow")
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
