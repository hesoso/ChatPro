import { ipcRenderer, contextBridge } from 'electron'
import { DB_EVENTS } from '../../enums/events'

interface AddMessageParams {
    session_id: string;
    sender_id_ref?: string | null;
    receiver_id_ref?: string | null;
    message_type?: string;
    content: string;
    is_from_me?: boolean;
    quote_message_id?: number | null;
    raw_data?: string | null;
}

interface GetMessagesParams {
    sessionId: string;
    limit?: number;
    offset?: number;
    orderByTimestamp?: 'ASC' | 'DESC';
}

interface QueryChatDataParams {
    wxid: string;
    limit?: number;
    offset?: number;
    orderByTimestamp?: 'ASC' | 'DESC';
}


contextBridge.exposeInMainWorld('databaseApi', {
    /**
     * 根据 wxid (作为 sessionId) 查询聊天数据。
     * @param params - 包含 wxid 和可选分页参数的对象。
     * @returns Promise，解析为包含 success 和 data/error 的对象。
     */
    fetchChatData: (params: QueryChatDataParams) => ipcRenderer.invoke(DB_EVENTS.GetChatData, params),

    /**
     * 添加一条新的聊天消息。
     * @param messageData - 消息数据。
     * @returns Promise，解析为包含 success 和 data (包含 id 和 timestamp) / error 的对象。
     */
    addMessage: (messageData: AddMessageParams) => ipcRenderer.invoke(DB_EVENTS.AddMessage, messageData),

    /**
     * 根据会话ID获取消息列表。
     * @param params - 包含 sessionId 和可选分页参数的对象。
     * @returns Promise，解析为包含 success 和 data (消息数组) / error 的对象。
     */
    getMessages: (params: GetMessagesParams) => ipcRenderer.invoke(DB_EVENTS.GetMessages, params),
})
