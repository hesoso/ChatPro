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
            // 注意：实际项目中，messageData 可能需要进行更严格的验证和清理
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
    ipcMain.handle(DB_EVENTS.GetChatData, async (_event, params: { wxid: string; limit?: number; offset?: number; orderByTimestamp?: 'ASC' | 'DESC' }) => {
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
}
