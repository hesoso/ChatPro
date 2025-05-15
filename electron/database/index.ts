import path from 'path';
import fs from 'fs';
import { app } from 'electron'; // 获取存储应用程序特定用户数据的标准位置。
import Database, { type Database as DB } from 'better-sqlite3';
import {
    PRAGMA_FOREIGN_KEYS_ON,
    CREATE_USERS_TABLE_SQL,
    CREATE_MESSAGES_TABLE_SQL,
    CREATE_MESSAGES_SESSION_TIMESTAMP_INDEX_SQL,
    CREATE_SESSIONS_TABLE_SQL,
    CREATE_SESSIONS_UPDATED_AT_INDEX_SQL,
    CREATE_GROUPS_TABLE_SQL
} from './ddl'

const dbPath: string = path.join(app.getPath('userData'), 'chat_app.db'); // 将数据库文件存储在用户数据目录
let db: DB;

/**
 * 初始化数据库。
 * 如果数据库目录或文件不存在，则会创建它们。
 * 同时会创建应用程序所需的表（如果它们尚不存在）。
 */
function initializeDatabase(): void {
    // 如果目录不存在，则创建它 (虽然 better-sqlite3 会自动创建文件，但有时目录也需确保)
    const dbDir: string = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    db = new Database(dbPath, { verbose: console.log }); // verbose 会在控制台打印执行的 SQL 语句，方便调试

    // 如果你使用外键，建议开启
    db.exec(PRAGMA_FOREIGN_KEYS_ON);


    // 创建表 (如果表不存在的话)
    db.exec(CREATE_USERS_TABLE_SQL);
    db.exec(CREATE_MESSAGES_TABLE_SQL);
    db.exec(CREATE_MESSAGES_SESSION_TIMESTAMP_INDEX_SQL);
    db.exec(CREATE_SESSIONS_TABLE_SQL);
    db.exec(CREATE_SESSIONS_UPDATED_AT_INDEX_SQL);
    db.exec(CREATE_GROUPS_TABLE_SQL);


    console.log('数据库已初始化，并确保表已创建。');
}

// 在你的应用准备好后调用此函数
app.whenReady().then(() => {
    initializeDatabase();
    // ... 创建你的 BrowserWindow 等
});

// 确保在应用退出时关闭数据库连接
app.on('will-quit', () => {
    if (db) db.close();
});

// 导出一个获取数据库实例的函数，以便在其他模块中使用
export function getDB(): DB {
    if (!db) {
        // 理论上，在 app.whenReady 之后 db 就应该被初始化了
        // 但作为健壮性考虑，可以再次尝试初始化或抛出错误
        console.warn('数据库尚未初始化，正在尝试再次初始化...');
        initializeDatabase();
        if (!db) { // 如果再次初始化失败
            throw new Error('数据库实例尚未初始化，无法获取。请确保 initializeDatabase() 已成功调用。');
        }
    }
    return db;
}

// ---- 类型定义 ----
export interface User {
    id?: number;
    wxid: string;
    nickname?: string | null;
    avatar_url?: string | null;
    remark?: string | null;
    created_at?: number; // Unix 毫秒时间戳
}

export interface NewMessage {
    session_id: string;
    sender_id_ref?: string | null; // 可以是机器人等非用户ID
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

// ---- 数据库操作函数 ----

/**
 * 添加一条新的聊天消息。
 * @param messageData - 消息数据，不包含 id 和 timestamp (timestamp 会自动生成)。
 * @returns 插入消息的 id 和 timestamp。
 * @throws 如果插入失败，则抛出错误。
 */
export function addMessage(messageData: NewMessage): { id: number; timestamp: number } {
    const dbInstance = getDB();
    const timestamp = Date.now(); // 生成当前时间的 Unix 毫秒时间戳
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
        const stmt = dbInstance.prepare(sql);
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


