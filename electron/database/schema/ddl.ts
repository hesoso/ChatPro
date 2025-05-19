// 用于管理 DDL(Data Definition Language) 数据定义语言
// 常见的 DDL 语句包括：
// CREATE TABLE: 创建新表
// ALTER TABLE: 修改现有表的结构（例如添加/删除列，修改列类型）
// DROP TABLE: 删除表
// CREATE INDEX: 创建索引
// DROP INDEX: 删除索引
// TRUNCATE TABLE: 删除表中的所有数据（但保留表结构，比 DELETE 更快，且通常不可回滚或触发器较少）
// CREATE VIEW, DROP VIEW: 创建/删除视图
// CREATE DATABASE, ALTER DATABASE, DROP DATABASE: 创建/修改/删除数据库（具体语法可能因数据库系统而异）


// 启用外键约束，确保引用完整性
export const PRAGMA_FOREIGN_KEYS_ON = 'PRAGMA foreign_keys = ON;';


// 创建用户表
export const CREATE_USERS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wxid TEXT UNIQUE NOT NULL, -- 微信号，唯一且不为空
        nickname TEXT,
        avatar_url TEXT,
        remark TEXT, -- 备注
        created_at INTEGER NOT NULL DEFAULT (STRFTIME('%s', 'now') * 1000) -- 存储为 Unix 毫秒时间戳
    );
`;




// 创建消息表 和 索引
export const CREATE_MESSAGES_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL, -- 会话ID，可以是 user_wxid 或 group_id
        sender_id_ref TEXT, -- 发送者ID (可能是用户的wxid，或机器人的标识)
        receiver_id_ref TEXT, -- 接收者ID (用户wxid或群id)
        message_type TEXT DEFAULT 'text', -- 'text', 'image', 'file', 'video', 'system'
        content TEXT, -- 文本内容，或文件/图片的路径/URL
        timestamp INTEGER NOT NULL, -- 存储为 Unix 毫秒时间戳, 由应用层写入
        status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'read', 'failed'
        is_from_me BOOLEAN DEFAULT 0, -- 1 表示是当前登录账号发出的
        quote_message_id INTEGER, -- 引用的消息ID
        raw_data TEXT, -- 可以存储原始消息对象JSON字符串，以备将来扩展
        FOREIGN KEY (sender_id_ref) REFERENCES users(wxid) ON DELETE SET NULL
    );
`;
export const CREATE_MESSAGES_SESSION_TIMESTAMP_INDEX_SQL = 'CREATE INDEX IF NOT EXISTS idx_messages_session_id_timestamp ON messages (session_id, timestamp);';




// 创建会话表 和 索引
export const CREATE_SESSIONS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY, -- 会话的唯一标识，例如 user_wxid 或 group_id
        type TEXT NOT NULL, -- 'user' (单聊) or 'group' (群聊)
        name TEXT, -- 会话名称 (好友昵称或群名称)
        avatar_url TEXT, -- 会话头像
        last_message_preview TEXT, -- 最后一条消息预览
        last_message_timestamp INTEGER, -- 最后一条消息的时间戳 (Unix 毫秒)
        unread_count INTEGER DEFAULT 0, -- 未读消息数量
        is_pinned BOOLEAN DEFAULT 0, -- 是否置顶
        is_muted BOOLEAN DEFAULT 0, -- 是否免打扰
        draft TEXT, -- 草稿
        updated_at INTEGER NOT NULL -- 会话更新时间戳 (Unix 毫秒), 由应用层写入
    );
`;
export const CREATE_SESSIONS_UPDATED_AT_INDEX_SQL = 'CREATE INDEX IF NOT EXISTS idx_sessions_updated_at ON sessions (updated_at);';




// 创建群组表
export const CREATE_GROUPS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY, -- 群ID，例如群wxid
        name TEXT,
        avatar_url TEXT,
        owner_id_ref TEXT, -- 群主wxid
        member_count INTEGER,
        announcement TEXT, -- 群公告
        created_at INTEGER NOT NULL DEFAULT (STRFTIME('%s', 'now') * 1000) -- 存储为 Unix 毫秒时间戳
        -- 还可以有 group_members 表来存储群成员关系
    );
`;