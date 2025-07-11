import { ipcRenderer, contextBridge } from 'electron'
import { DB_EVENTS } from '../types/enums'





contextBridge.exposeInMainWorld('databaseApi', {
    /**
     * 新的聊天消息
     * @param params - 见 I_OnMessageParams 类型定义
     * @returns Promise
     */
    onMessage: (params: I_OnMessageParams) => ipcRenderer.invoke(DB_EVENTS.ON_MESSAGE, params),

    /**
     * 根据会话ID获取消息列表
     * @param params - 见 I_GetMessagesParams 类型定义
     * @returns Promise
     */
    getMessages: (params: I_GetMessagesParams) => ipcRenderer.invoke(DB_EVENTS.GET_MESSAGES, params),

    /**
     * 查询会话列表
     * @param params - 见 I_GetSessionsParams 类型定义
     * @returns Promise
     */
    getSessions: (params: I_GetSessionsParams) => ipcRenderer.invoke(DB_EVENTS.GET_SESSIONS, params),

})
