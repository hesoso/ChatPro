import { ipcMain } from 'electron'
import { DB_EVENTS } from '../../enums/events'
import {
    addMessage,
    getMessagesBySessionId,
    NewMessage,
} from '../database/index'

export const regsiterDatabaseHandler = () => {
    ipcMain.handle(DB_EVENTS.AddMessage, async (_event, messageData: NewMessage) => {
        try {
            const result = addMessage(messageData)
            return { success: true, data: result }
        } catch (error) {
            console.error('IPC Error - db:add-message:', error)
            return { success: false, error: (error as Error).message || 'Failed to add message' }
        }
    })

    ipcMain.handle(DB_EVENTS.GetMessages, async (_event, params: { sessionId: string; limit?: number; offset?: number; orderByTimestamp?: 'ASC' | 'DESC' }) => {
        try {
            const { sessionId, limit, offset, orderByTimestamp } = params
            const messages = getMessagesBySessionId(sessionId, limit, offset, orderByTimestamp)
            return { success: true, data: messages }
        } catch (error) {
            console.error('IPC Error - db:get-messages:', error)
            return { success: false, error: (error as Error).message || 'Failed to get messages' }
        }
    })
    ipcMain.handle(DB_EVENTS.GetChatData, async (_event, params: { wxid: string; limit?: number; offset?: number; orderByTimestamp?: 'ASC' | 'DESC' }) => {
        try {
            // 假设 wxid 就是 sessionId，如果不是，你需要调整这里的逻辑
            const sessionId = params.wxid
            const { limit, offset, orderByTimestamp } = params
            const messages = getMessagesBySessionId(sessionId, limit, offset, orderByTimestamp)
            return { success: true, data: messages }
        } catch (error) {
            console.error('IPC Error - db:query-chat-data:', error)
            return { success: false, error: (error as Error).message || 'Failed to query chat data' }
        }
    })
}
