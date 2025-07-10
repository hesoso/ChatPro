import { ipcMain } from 'electron'
import { DB_EVENTS } from '../types/events'
import { getDB, sessionManager, messageManager } from '../database/index'

export const regsiterDatabaseHandler = () => {
    ipcMain.handle(DB_EVENTS.ON_MESSAGE, async (_event, msg: any) => {
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
            console.error('IPC Error - DB:ON_MESSAGE:', error);

            // 发送错误信息回渲染进程
            _event.sender.send('message-process-error', {
                msgId: msg.msgId,
                error: error.message
            });
        }
    })

    ipcMain.handle(DB_EVENTS.GET_MESSAGES, async (_event, params: I_GetMessagesParams) => {
        try {
            const messages = messageManager.getMessages(
                params.wechatId,
                params.convoId,
                params.chatType,
                params.options
            )
            console.log('===========================messages===========================', messages)
            return { success: true, data: messages }
        } catch (error) {
            console.error('IPC Error - DB:GET_MESSAGES:', error)
            return { success: false, error: (error as Error).message || 'Failed to get messages' }
        }
    })
    ipcMain.handle(DB_EVENTS.GET_SESSIONS, async (_event, params: I_GetSessionsParams) => {
        try {
            const sessions = sessionManager.getSessions(
                params.wechatId,
                params.options
            )
            console.log('===========================messages===========================', sessions)
            return { success: true, data: sessions }
        } catch (error) {
            console.error('IPC Error - DB:GET_SESSIONS:', error)
            return { success: false, error: (error as Error).message || 'Failed to query chat data' }
        }
    })
}
