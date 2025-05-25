import { Database } from 'better-sqlite3';
import { getDB } from "../db";
import { createUser } from "./user";
import { createSession } from "./session";
import { checkRecordExists } from '../helper/check'

export interface NewMessage {
    session_id: string;
    sender_id_ref: string; // 可以是机器人等非用户ID
    receiver_id_ref?: string | null; // 可以是群ID
    message_type?: string;
    content: string;
    is_from_me?: boolean;
    quote_message_id?: number | null;
    raw_data?: string | null;
    // timestamp 将在 addMessage 内部生成
    // status 默认为 'sent'
}

export interface Message extends NewMessage {
    id: number;
    timestamp: number; // Unix 毫秒时间戳
    status: string;
}


/**
 * 添加一条新的聊天消息。
 * @param messageData - 消息数据，不包含 id 和 timestamp (timestamp 会自动生成)。
 * @returns 插入消息的 id 和 timestamp。
 * @throws 如果插入失败，则抛出错误。
 */
export function addMessage(messageData: NewMessage, db: Database = getDB()): { id: number; timestamp: number } {

    // 用户表是否存在该消息的用户记录，如果不存在，则创建该用户
    if (checkRecordExists('users', 'wxid', messageData.sender_id_ref)) {
        // createUser({
        //     wxid: message.sender_id_ref,
        //     nickname?: string | null;
        //     avatar_url?: string | null;
        //     remark?: string | null;
        //     created_at?: number;
        // })
    }

    const timestamp = Date.now();
    const sql = `
        INSERT INTO messages (
            session_id, sender_id_ref, receiver_id_ref, message_type, 
            content, timestamp, is_from_me, quote_message_id, raw_data
        )
        VALUES (
            @session_id, @sender_id_ref, @receiver_id_ref, @message_type, 
            @content, @timestamp, @is_from_me, @quote_message_id, @raw_data
        );
    `;

    try {
        const stmt = db.prepare(sql);
        const result = stmt.run({
            ...messageData,
            message_type: messageData.message_type || 'text', // 默认消息类型
            is_from_me: messageData.is_from_me === undefined ? 0 : (messageData.is_from_me ? 1 : 0),
            timestamp, // 使用我们生成的 Unix 毫秒时间戳
        });
        return { id: Number(result.lastInsertRowid), timestamp };
    } catch (error) {
        console.error('Failed to add message:', error);
        throw error; // 或者返回一个更友好的错误对象
    }
}

/**
 * 根据会话ID获取消息列表，支持分页。
 * @param sessionId - 会话ID。
 * @param limit - 获取的消息数量，默认为 50。
 * @param offset - 偏移量，用于分页，默认为 0。
 * @param orderByTimestamp - 排序方式，'ASC' (升序，旧消息在前) 或 'DESC' (降序，新消息在前)，默认为 'DESC'。
 * @returns 消息数组。
 */
export function getMessagesBySessionId(
    sessionId: string,
    limit: number = 50,
    offset: number = 0,
    orderByTimestamp: 'ASC' | 'DESC' = 'DESC'
): Message[] {
    const dbInstance = getDB();
    const sql = `
        SELECT id, session_id, sender_id_ref, receiver_id_ref, message_type, 
               content, timestamp, status, is_from_me, quote_message_id, raw_data
        FROM messages
        WHERE session_id = @sessionId
        ORDER BY timestamp ${orderByTimestamp === 'ASC' ? 'ASC' : 'DESC'} -- 防止SQL注入，显式检查值
        LIMIT @limit OFFSET @offset;
    `;

    try {
        const stmt = dbInstance.prepare(sql);
        const messages = stmt.all({ sessionId, limit, offset }) as Message[];
        return messages.map(msg => ({
            ...msg,
            is_from_me: Boolean(msg.is_from_me) // 将 0/1 转换为 boolean
        }));
    } catch (error) {
        console.error(`Failed to get messages for session ${sessionId}:`, error);
        return []; // 或者抛出错误
    }
}
