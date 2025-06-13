import { app, ipcMain, BrowserWindow, screen } from "electron";
import { fileURLToPath } from "node:url";
import path$1 from "node:path";
import path from "path";
import fs from "fs";
import Database from "better-sqlite3";
const PRAGMA_FOREIGN_KEYS_ON = "PRAGMA foreign_keys = ON;";
const CREATE_USERS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wxid TEXT UNIQUE NOT NULL, -- 微信号，唯一且不为空
        nickname TEXT,
        avatar_url TEXT,
        remark TEXT, -- 备注
        type BOOLEAN DEFAULT 0, -- 0 表示其他用户 1 表示当前登录账号
        created_at INTEGER NOT NULL DEFAULT (STRFTIME('%s', 'now') * 1000) -- 存储为 Unix 毫秒时间戳
    );
`;
const CREATE_MESSAGES_TABLE_SQL = `
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
const CREATE_MESSAGES_SESSION_TIMESTAMP_INDEX_SQL = "CREATE INDEX IF NOT EXISTS idx_messages_session_id_timestamp ON messages (session_id, timestamp);";
const CREATE_SESSIONS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY, -- 会话的唯一标识，例如 user_wxid 或 group_id
        type INTEGER NOT NULL, -- 0 (单聊) or 1 (群聊)
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
const CREATE_SESSIONS_UPDATED_AT_INDEX_SQL = "CREATE INDEX IF NOT EXISTS idx_sessions_updated_at ON sessions (updated_at);";
const CREATE_GROUPS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY, -- 群ID
        name TEXT,
        avatar_url TEXT,
        owner_id_ref TEXT, -- 群主wxid
        member_count INTEGER,
        announcement TEXT, -- 群公告
        created_at INTEGER NOT NULL DEFAULT (STRFTIME('%s', 'now') * 1000) -- 存储为 Unix 毫秒时间戳
    );
`;
const dbPath = path.join(app.getPath("userData"), "chat_app.db");
let db;
function initializeDatabase() {
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  console.log("数据库已成功创建============>", dbDir);
  db = new Database(dbPath, { verbose: console.log });
  db.exec(PRAGMA_FOREIGN_KEYS_ON);
  db.exec(CREATE_USERS_TABLE_SQL);
  db.exec(CREATE_MESSAGES_TABLE_SQL);
  db.exec(CREATE_MESSAGES_SESSION_TIMESTAMP_INDEX_SQL);
  db.exec(CREATE_SESSIONS_TABLE_SQL);
  db.exec(CREATE_SESSIONS_UPDATED_AT_INDEX_SQL);
  db.exec(CREATE_GROUPS_TABLE_SQL);
  console.log("数据库已初始化，并确保表已创建。");
}
function getDB() {
  if (!db) {
    console.warn("数据库尚未初始化，正在尝试再次初始化...");
    initializeDatabase();
    if (!db) {
      throw new Error("数据库实例尚未初始化，无法获取。请确保 initializeDatabase() 已成功调用。");
    }
  }
  return db;
}
function checkRecordExists(table, key, value) {
  const db2 = getDB();
  const sql = `SELECT 1 FROM ${table} WHERE ${key} = ?`;
  const checkStmt = db2.prepare(sql);
  return !!checkStmt.get(value);
}
function addMessage(messageData, db2 = getDB()) {
  if (checkRecordExists("users", "wxid", messageData.sender_id_ref)) ;
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
    const stmt = db2.prepare(sql);
    const result = stmt.run({
      ...messageData,
      message_type: messageData.message_type || "text",
      // 默认消息类型
      is_from_me: messageData.is_from_me === void 0 ? 0 : messageData.is_from_me ? 1 : 0,
      timestamp
      // 使用我们生成的 Unix 毫秒时间戳
    });
    return { id: Number(result.lastInsertRowid), timestamp };
  } catch (error) {
    console.error("Failed to add message:", error);
    throw error;
  }
}
function getMessagesBySessionId(sessionId, limit = 50, offset = 0, orderByTimestamp = "DESC") {
  const dbInstance = getDB();
  const sql = `
        SELECT id, session_id, sender_id_ref, receiver_id_ref, message_type, 
               content, timestamp, status, is_from_me, quote_message_id, raw_data
        FROM messages
        WHERE session_id = @sessionId
        ORDER BY timestamp ${orderByTimestamp === "ASC" ? "ASC" : "DESC"} -- 防止SQL注入，显式检查值
        LIMIT @limit OFFSET @offset;
    `;
  try {
    const stmt = dbInstance.prepare(sql);
    const messages = stmt.all({ sessionId, limit, offset });
    return messages.map((msg) => ({
      ...msg,
      is_from_me: Boolean(msg.is_from_me)
      // 将 0/1 转换为 boolean
    }));
  } catch (error) {
    console.error(`Failed to get messages for session ${sessionId}:`, error);
    return [];
  }
}
var DB_EVENTS = /* @__PURE__ */ ((DB_EVENTS2) => {
  DB_EVENTS2["AddMessage"] = "db:add-message";
  DB_EVENTS2["GetMessages"] = "db:get-messages";
  DB_EVENTS2["GetChatData"] = "db:query-chat-data";
  return DB_EVENTS2;
})(DB_EVENTS || {});
const regsiterDatabaseHandler = () => {
  ipcMain.handle(DB_EVENTS.AddMessage, async (_event, messageData) => {
    try {
      const result = addMessage(messageData);
      return { success: true, data: result };
    } catch (error) {
      console.error("IPC Error - db:add-message:", error);
      return { success: false, error: error.message || "Failed to add message" };
    }
  });
  ipcMain.handle(DB_EVENTS.GetMessages, async (_event, params) => {
    try {
      const { sessionId, limit, offset, orderByTimestamp } = params;
      const messages = getMessagesBySessionId(sessionId, limit, offset, orderByTimestamp);
      return { success: true, data: messages };
    } catch (error) {
      console.error("IPC Error - db:get-messages:", error);
      return { success: false, error: error.message || "Failed to get messages" };
    }
  });
  ipcMain.handle(DB_EVENTS.GetChatData, async (_event, params) => {
    try {
      const sessionId = params.wxid;
      const { limit, offset, orderByTimestamp } = params;
      const messages = getMessagesBySessionId(sessionId, limit, offset, orderByTimestamp);
      return { success: true, data: messages };
    } catch (error) {
      console.error("IPC Error - db:query-chat-data:", error);
      return { success: false, error: error.message || "Failed to query chat data" };
    }
  });
};
function registerBridgeHandler() {
  ipcMain.on("bridge:minimize", () => {
    console.log("Bridge minimize");
    const focusedWindow = BrowserWindow.getFocusedWindow();
    focusedWindow == null ? void 0 : focusedWindow.minimize();
  });
  let isMax = false;
  ipcMain.on("bridge:toggleMaximize", () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    const width = isMax ? 1200 : screen.getPrimaryDisplay().workAreaSize.width;
    const height = isMax ? 700 : screen.getPrimaryDisplay().workAreaSize.height;
    focusedWindow == null ? void 0 : focusedWindow.setBounds({ x: 0, y: 0, width, height });
    focusedWindow == null ? void 0 : focusedWindow.center();
    isMax = !isMax;
  });
  ipcMain.on("bridge:closeWindow", () => {
    console.log("Bridge closed");
    const focusedWindow = BrowserWindow.getFocusedWindow();
    focusedWindow == null ? void 0 : focusedWindow.close();
  });
}
const __dirname = path$1.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path$1.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path$1.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$1.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$1.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
const isDevelopment = process.env.NODE_ENV !== "production";
let win;
function createWindow() {
  if (win) {
    win.destroy();
    win = null;
  }
  win = new BrowserWindow({
    icon: path$1.join(process.env.VITE_PUBLIC, "logo.ico"),
    width: 1200,
    height: 760,
    frame: false,
    // 设置为 false 时用于创建无边框窗口
    resizable: false,
    // 窗口是否可以改变尺寸
    transparent: false,
    // 用于设置窗口是否透明
    // maximizable: false, // 禁止最大化
    // autoHideMenuBar:true,// 是否隐藏菜单栏
    // titleBarStyle:'hidden',// 窗口标题栏的样式
    // backgroundColor: '#EFF0F4', // 窗口的背景颜色为十六进制值
    webPreferences: {
      preload: path$1.join(__dirname, "index.mjs"),
      // nodeIntegration: true, // 控制是否在渲染进程中启用Node.js集成，为true时，渲染进程可使用Node.js的API
      backgroundThrottling: false,
      // 控制当应用在后台运行时是否限制 JavaScript 定时器
      devTools: isDevelopment
      // 开发环境可以打开控制台
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.on("close", () => {
    win == null ? void 0 : win.webContents.closeDevTools();
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path$1.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.on("will-quit", () => {
  var _a;
  return (_a = getDB()) == null ? void 0 : _a.close;
});
app.whenReady().then(() => {
  initializeDatabase();
  createWindow();
  regsiterDatabaseHandler();
  registerBridgeHandler();
  win == null ? void 0 : win.webContents.openDevTools();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
