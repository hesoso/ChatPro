import { Database } from 'better-sqlite3';
import { getDB } from "../db";

export interface Session {
    id: string;
    type: 0 | 1; //  0 - 单聊, 1 - 群聊
    name: string; // 会话名称
    avatar_url: string; // 会话头像
    message: string; // 消息内容
    last_message_timestamp: number; // 最后一条消息的时间戳
    unread_count: number; // 未读消息数量
    is_pinned: boolean; // 是否置顶
    is_muted: boolean; // 是否免打扰
    draft: string; // 草稿
}

/**
 * 获取所有会话
 * @returns 会话列表
 */
export function getSessions(db: Database = getDB()): Session[] {
    try {
        const sql = `SELECT * FROM sessions`;
        return db.prepare(sql).all() as Session[];
    } catch (error) {
        console.error('获取会话列表失败:', error);
        throw new Error('无法获取会话列表');
    }
}

/**
 * 创建会话
 * @param sessionData 会话数据（不包含 id 和 created_at）
 * @returns 会话ID
 */
export function createSession(sessionData: Session): number {
    const { id, type, name, avatar_url, message } = sessionData;

    if (!id.trim()) {
        throw new Error('id 必须为非空字符串');
    }

    const last_message_timestamp = Date.now()

    try {
        const sql = `
            INSERT INTO sessions (id, type, name, avatar_url, last_message_preview, last_message_timestamp)
            VALUES (@id, @type, @name, @avatar_url, @message, @last_message_timestamp)
        `;
        const params = { id, type, name, avatar_url, message, last_message_timestamp }
        const result = getDB().prepare(sql).run(params);
        return Number(result.lastInsertRowid);
    } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            throw new Error(`会话 ${id} 已存在`);
        }
        console.error('创建会话失败:', error);
        throw new Error('创建会话失败，请检查数据');
    }
}