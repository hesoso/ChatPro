import { ipcMain } from 'electron'
import { DB_EVENTS } from '../../enums/events'
import { getDB, sessionManager, messageManager } from '../database/index'

export const regsiterDatabaseHandler = () => {
    ipcMain.handle(DB_EVENTS.OnMessage, async (_event, msg: any) => {
        console.log('regsiterDatabaseHandler收到', msg)
        const db = getDB();
        try {
            db.transaction(() => {
                // 确定会话ID和类型
                const convoInfo = sessionManager.getSessionInfo(msg);
                
                // 检查/创建会话
                const convoExists = sessionManager.checkSessionExists(
                    convoInfo.wechatId, 
                    convoInfo.convoId
                );
                
                if (!convoExists) {
                    sessionManager.createSession(
                        msg, 
                        convoInfo.convoId, 
                        convoInfo.convoType
                    );
                }

                // 写入消息表
                messageManager.insertMessage(msg);

                // 更新会话最后消息
                sessionManager.updateSessionLastMsg(msg, convoInfo.convoId);
            })();

        } catch (error: any) {
            console.error('消息处理失败:', error);

            // 更好的错误处理：发送错误信息回渲染进程
            _event.sender.send('message-process-error', {
                msgId: msg.msgId,
                error: error.message
            });
        }
    })

    // ipcMain.handle(DB_EVENTS.GetMessages, async (_event, params: { sessionId: string; limit?: number; offset?: number; orderByTimestamp?: 'ASC' | 'DESC' }) => {
    //     try {
    //         const { sessionId, limit, offset, orderByTimestamp } = params
    //         const messages = getMessagesBySessionId(sessionId, limit, offset, orderByTimestamp)
    //         return { success: true, data: messages }
    //     } catch (error) {
    //         console.error('IPC Error - db:get-messages:', error)
    //         return { success: false, error: (error as Error).message || 'Failed to get messages' }
    //     }
    // })
    // ipcMain.handle(DB_EVENTS.GetChatData, async (_event, params: { wxid: string; limit?: number; offset?: number; orderByTimestamp?: 'ASC' | 'DESC' }) => {
    //     try {
    //         // 假设 wxid 就是 sessionId，如果不是，你需要调整这里的逻辑
    //         const sessionId = params.wxid
    //         const { limit, offset, orderByTimestamp } = params
    //         const messages = getMessagesBySessionId(sessionId, limit, offset, orderByTimestamp)
    //         return { success: true, data: messages }
    //     } catch (error) {
    //         console.error('IPC Error - db:query-chat-data:', error)
    //         return { success: false, error: (error as Error).message || 'Failed to query chat data' }
    //     }
    // })
}
