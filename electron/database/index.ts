const path = require('path');
const fs = require('fs');
const { app } = require('electron'); // 用于获取 userData 路径
const Database = require('better-sqlite3');

const dbPath = path.join(app.getPath('userData'), 'chat_app.db'); // 将数据库文件存储在用户数据目录
let db;

function initializeDatabase() {
    // 如果目录不存在，则创建它 (虽然 better-sqlite3 会自动创建文件，但有时目录也需确保)
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    db = new Database(dbPath, { verbose: console.log }); // verbose 会在控制台打印执行的 SQL 语句，方便调试

    // 如果你使用外键，建议开启
    db.exec('PRAGMA foreign_keys = ON;');

    // 创建表 (如果表不存在的话)
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            wxid TEXT UNIQUE NOT NULL, -- 微信号，唯一且不为空
            nickname TEXT,
            avatar_url TEXT,
            remark TEXT, -- 备注
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `;
    db.exec(createUsersTable);

    const createMessagesTable = `
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL, -- 会话ID，可以是 user_wxid 或 group_id
            sender_id_ref TEXT, -- 发送者ID (可能是用户的wxid，或机器人的标识)
            receiver_id_ref TEXT, -- 接收者ID (用户wxid或群id)
            message_type TEXT DEFAULT 'text', -- 'text', 'image', 'file', 'video', 'system'
            content TEXT, -- 文本内容，或文件/图片的路径/URL
            timestamp DATETIME DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW', 'localtime')), -- 存储毫秒级时间
            status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'read', 'failed'
            is_from_me BOOLEAN DEFAULT 0, -- 1 表示是当前登录账号发出的
            quote_message_id INTEGER, -- 引用的消息ID
            raw_data TEXT -- 可以存储原始消息对象JSON字符串，以备将来扩展
            -- FOREIGN KEY (sender_id_ref) REFERENCES users(wxid) ON DELETE SET NULL -- 如果sender_id_ref总是users表的wxid
        );
    `;
    // 为常用查询字段创建索引
    db.exec('CREATE INDEX IF NOT EXISTS idx_messages_session_id_timestamp ON messages (session_id, timestamp);');
    db.exec(createMessagesTable);


    const createSessionsTable = `
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY, -- 会话的唯一标识，例如 user_wxid 或 group_id
            type TEXT NOT NULL, -- 'user' (单聊) or 'group' (群聊)
            name TEXT, -- 会话名称 (好友昵称或群名称)
            avatar_url TEXT, -- 会话头像
            last_message_preview TEXT, -- 最后一条消息预览
            last_message_timestamp DATETIME, -- 最后一条消息的时间戳
            unread_count INTEGER DEFAULT 0, -- 未读消息数量
            is_pinned BOOLEAN DEFAULT 0, -- 是否置顶
            is_muted BOOLEAN DEFAULT 0, -- 是否免打扰
            draft TEXT, -- 草稿
            updated_at DATETIME DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW', 'localtime'))
        );
    `;
    db.exec('CREATE INDEX IF NOT EXISTS idx_sessions_updated_at ON sessions (updated_at);');
    db.exec(createSessionsTable);

    // ... 创建其他表: groups, robots, settings, quick_replies 等
    // 例如群组表 (groups)
    const createGroupsTable = `
        CREATE TABLE IF NOT EXISTS groups (
            id TEXT PRIMARY KEY, -- 群ID，例如群wxid
            name TEXT,
            avatar_url TEXT,
            owner_id_ref TEXT, -- 群主wxid
            member_count INTEGER,
            announcement TEXT, -- 群公告
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            -- 还可以有 group_members 表来存储群成员关系
        );
    `;
    db.exec(createGroupsTable);

    console.log('数据库已初始化，并确保表已创建。');
}

// 在你的应用准备好后调用此函数
app.whenReady().then(() => {
    initializeDatabase();
    // ... 创建你的 BrowserWindow 等
});

// 确保在应用退出时关闭数据库连接
app.on('will-quit', () => {
    if (db) {
        db.close((err) => {
            if (err) {
                console.error('关闭数据库失败:', err.message);
            } else {
                console.log('数据库连接已关闭。');
            }
        });
    }
});