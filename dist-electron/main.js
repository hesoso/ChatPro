var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { app, ipcMain, BrowserWindow, screen } from "electron";
import { fileURLToPath } from "node:url";
import path$1 from "node:path";
import path from "path";
import fs from "fs";
import Database from "better-sqlite3";
function getResourcePath(...paths) {
  if (!app.isPackaged) {
    return path.join(process.cwd(), "electron", ...paths);
  }
  return path.join(process.resourcesPath, ...paths);
}
class MessageManager {
  constructor(db2) {
    this.db = db2;
  }
  // 插入单条消息
  insertMessage(msg) {
    try {
      if (this.messageExists(msg.wechatId, msg.chatType, msg.msgId)) {
        console.log(`消息已存在: ${msg.msgId}`);
        return false;
      }
      const stmt = this.db.prepare(
        `INSERT INTO T_BEE_CHAT_MSG (
          WECHAT_ID, CHAT_TYPE, SENDER, SENDER_AVATAR, SENDER_NICKNAME,
          RECEIVER, RECEIVER_AVATAR, RECEIVER_NICKNAME, MSG_ID, CONTENT_TYPE,
          CONTENT, SEND_FLAG, CREATE_TIME, UPDATE_TIME, QUOTE_MSG_ID
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );
      stmt.run(
        msg.wechatId,
        msg.chatType,
        msg.sender,
        msg.senderAvatar,
        msg.senderNickname,
        msg.receiver,
        msg.receiverAvatar,
        msg.receiverNickname,
        msg.msgId,
        msg.contentType,
        msg.content,
        msg.wechatId === msg.sender ? "1" : "0",
        Date.now(),
        Date.now(),
        msg.quoteMsgId || ""
      );
      return true;
    } catch (error) {
      console.error("插入消息失败:", error);
      return false;
    }
  }
  // 批量插入消息（事务处理）
  insertMessages(messages) {
    const insertStmt = this.db.prepare(
      `INSERT OR IGNORE INTO T_BEE_CHAT_MSG (
        WECHAT_ID, CHAT_TYPE, SENDER, SENDER_AVATAR, SENDER_NICKNAME,
        RECEIVER, RECEIVER_AVATAR, RECEIVER_NICKNAME, MSG_ID, CONTENT_TYPE,
        CONTENT, SEND_FLAG, CREATE_TIME, UPDATE_TIME, QUOTE_MSG_ID
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const insertMany = this.db.transaction((msgs) => {
      let count = 0;
      for (const msg of msgs) {
        if (this.messageExists(msg.wechatId, msg.chatType, msg.msgId)) {
          console.log(`消息已存在: ${msg.msgId}`);
          break;
        }
        try {
          insertStmt.run(
            msg.wechatId,
            msg.chatType,
            msg.sender,
            msg.senderAvatar,
            msg.senderNickname,
            msg.receiver,
            msg.receiverAvatar,
            msg.receiverNickname,
            msg.msgId,
            msg.contentType,
            msg.content,
            msg.sendFlag,
            Date.now(),
            Date.now(),
            msg.quoteMsgId || ""
          );
          count++;
        } catch (error) {
          console.error(`插入消息 ${msg.msgId} 失败:`, error);
        }
      }
      return count;
    });
    return insertMany(messages);
  }
  // 检查消息是否存在
  messageExists(wechatId, chatType, msgId) {
    const stmt = this.db.prepare(
      `SELECT 1 FROM T_BEE_CHAT_MSG 
       WHERE WECHAT_ID = ? AND CHAT_TYPE = ? AND MSG_ID = ? LIMIT 1`
    );
    return !!stmt.get(wechatId, chatType, msgId);
  }
  // 删除单条消息
  deleteMessage(wechatId, chatType, msgId) {
    try {
      const stmt = this.db.prepare(
        `DELETE FROM T_BEE_CHAT_MSG 
         WHERE WECHAT_ID = ? AND CHAT_TYPE = ? AND MSG_ID = ?`
      );
      const result = stmt.run(wechatId, chatType, msgId);
      return result.changes > 0;
    } catch (error) {
      console.error("删除消息失败:", error);
      return false;
    }
  }
  // 根据会话删除消息
  deleteMessagesBySession(wechatId, convoId, chatType) {
    try {
      let condition = "";
      if (chatType === "1") {
        condition = `(SENDER = ? OR RECEIVER = ?)`;
      } else if (chatType === "2") {
        condition = `RECEIVER = ?`;
      } else {
        throw new Error(`不支持的聊天类型: ${chatType}`);
      }
      const stmt = this.db.prepare(
        `DELETE FROM T_BEE_CHAT_MSG 
         WHERE WECHAT_ID = ? AND CHAT_TYPE = ? AND ${condition}`
      );
      const params = chatType === "1" ? [wechatId, chatType, convoId, convoId] : [wechatId, chatType, convoId];
      const result = stmt.run(...params);
      return result.changes;
    } catch (error) {
      console.error("删除会话消息失败:", error);
      return 0;
    }
  }
  // 获取消息列表（按会话和时间范围）
  getMessages(wechatId, convoId, chatType, options = {}) {
    try {
      let conditions = [
        "WECHAT_ID = ?",
        "CHAT_TYPE = ?"
      ];
      const params = [wechatId, chatType];
      if (chatType === "1") {
        conditions.push("(SENDER = ? OR RECEIVER = ?)");
        params.push(convoId, convoId);
      } else if (chatType === "2") {
        conditions.push("RECEIVER = ?");
        params.push(convoId);
      } else {
        throw new Error(`不支持的聊天类型: ${chatType}`);
      }
      if (options.beforeTime) {
        conditions.push("CREATE_TIME < ?");
        params.push(options.beforeTime);
      }
      if (options.afterTime) {
        conditions.push("CREATE_TIME > ?");
        params.push(options.afterTime);
      }
      let query = `SELECT * FROM T_BEE_CHAT_MSG WHERE ${conditions.join(" AND ")} 
                   ORDER BY CREATE_TIME DESC`;
      if (options.limit) {
        query += ` LIMIT ${options.limit}`;
        if (options.offset) {
          query += ` OFFSET ${options.offset}`;
        }
      }
      const stmt = this.db.prepare(query);
      return stmt.all(...params);
    } catch (error) {
      console.error("获取消息列表失败:", error);
      return [];
    }
  }
  // 获取最近一条消息
  getLastMessage(wechatId, convoId, chatType) {
    try {
      const messages = this.getMessages(wechatId, convoId, chatType, { limit: 1 });
      return messages.length > 0 ? messages[0] : null;
    } catch (error) {
      console.error("获取最后一条消息失败:", error);
      return null;
    }
  }
}
class SessionManager {
  constructor(db2) {
    this.db = db2;
  }
  getSessionInfo(msg) {
    return {
      wechatId: msg.wechatId,
      convoId: msg.wechatId === msg.receiver ? msg.sender : msg.receiver,
      convoType: msg.chatType
    };
  }
  // 检查会话是否存在
  checkSessionExists(wechatId, convoId) {
    const stmt = this.db.prepare(
      `SELECT 1 FROM T_BEE_CHAT_CONVO 
       WHERE WECHAT_ID = ? AND CONVO_ID = ? LIMIT 1`
    );
    return !!stmt.get(wechatId, convoId);
  }
  // 创建会话
  createSession(msg, convoId, convoType) {
    const { avatar, nickname } = this.getSessionProfile(msg, convoId);
    const stmt = this.db.prepare(
      `INSERT INTO T_BEE_CHAT_CONVO (
        WECHAT_ID, CONVO_ID, CONVO_NICKNAME, CONVO_AVATAR, CONVO_TYPE,
        TOP_FLAG, DISTURB_FLAG, LAST_MSG_ID, CONTENT, MSG_TIME,
        CREATE_TIME, UPDATE_TIME, UNREAD_COUNT
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    stmt.run(
      msg.wechatId,
      convoId,
      nickname,
      avatar || "",
      convoType,
      "0",
      // 未置顶
      "0",
      // 未免打扰
      msg.msgId,
      // 初始无消息ID
      msg.content,
      // 初始无内容
      msg.msgTime,
      // 初始消息时间
      Date.now(),
      Date.now(),
      msg.sendFlag === "0" ? 1 : 0
      // 接收消息时未读数为1
    );
  }
  // 更新会话的最后一条消息
  updateSessionLastMsg(msg, convoId) {
    const updateFields = [
      "LAST_MSG_ID = ?",
      "CONTENT = ?",
      "MSG_TIME = ?",
      "UPDATE_TIME = ?"
    ];
    const params = [
      msg.msgId,
      msg.content,
      Date.now(),
      Date.now()
    ];
    if (msg.sendFlag === "0") {
      updateFields.push("UNREAD_COUNT = UNREAD_COUNT + 1");
    } else {
      updateFields.push("DRAFT = ?");
      params.push("");
    }
    const stmt = this.db.prepare(
      `UPDATE T_BEE_CHAT_CONVO 
       SET ${updateFields.join(", ")} 
       WHERE WECHAT_ID = ? AND CONVO_ID = ?`
    );
    stmt.run(...params, msg.wechatId, convoId);
  }
  // 获取会话列表（分页+排序）
  getSessions(wechatId, options = {}) {
    try {
      const conditions = ["WECHAT_ID = ?"];
      const params = [wechatId];
      if (options.search) {
        conditions.push("(CONVO_NICKNAME LIKE ? OR CONTENT LIKE ?)");
        params.push(`%${options.search}%`, `%${options.search}%`);
      }
      if (options.onlyUnread) {
        conditions.push("UNREAD_COUNT > 0");
      }
      let query = `SELECT * FROM T_BEE_CHAT_CONVO 
                   WHERE ${conditions.join(" AND ")} 
                   ORDER BY MSG_TIME DESC`;
      if (options.limit) {
        query += ` LIMIT ${options.limit}`;
        if (options.offset) {
          query += ` OFFSET ${options.offset}`;
        }
      }
      const stmt = this.db.prepare(query);
      return stmt.all(...params);
    } catch (error) {
      console.error("获取会话列表失败:", error);
      return [];
    }
  }
  // 删除会话（及相关消息）
  deleteSession(wechatId, convoId) {
    try {
      this.db.exec("BEGIN TRANSACTION");
      try {
        const session = this.getSession(wechatId, convoId);
        if (!session) {
          return false;
        }
        const messageManager2 = new MessageManager(this.db);
        messageManager2.deleteMessagesBySession(
          wechatId,
          convoId,
          session.CONVO_TYPE
        );
        const deleteStmt = this.db.prepare(
          `DELETE FROM T_BEE_CHAT_CONVO 
           WHERE WECHAT_ID = ? AND CONVO_ID = ?`
        );
        deleteStmt.run(wechatId, convoId);
        this.db.exec("COMMIT");
        return true;
      } catch (innerError) {
        this.db.exec("ROLLBACK");
        throw innerError;
      }
    } catch (error) {
      console.error("删除会话失败:", error);
      return false;
    }
  }
  // 更新会话草稿
  updateSessionDraft(wechatId, convoId, draft) {
    try {
      const stmt = this.db.prepare(
        `UPDATE T_BEE_CHAT_CONVO 
         SET DRAFT = ?, UPDATE_TIME = ? 
         WHERE WECHAT_ID = ? AND CONVO_ID = ?`
      );
      stmt.run(draft, Date.now(), wechatId, convoId);
      return true;
    } catch (error) {
      console.error("更新会话草稿失败:", error);
      return false;
    }
  }
  // 重置会话未读数
  resetUnreadCount(wechatId, convoId) {
    try {
      const stmt = this.db.prepare(
        `UPDATE T_BEE_CHAT_CONVO 
         SET UNREAD_COUNT = 0, UPDATE_TIME = ? 
         WHERE WECHAT_ID = ? AND CONVO_ID = ?`
      );
      stmt.run(Date.now(), wechatId, convoId);
      return true;
    } catch (error) {
      console.error("重置未读数失败:", error);
      return false;
    }
  }
  // 获取单个会话详情
  getSession(wechatId, convoId) {
    try {
      const stmt = this.db.prepare(
        `SELECT * FROM T_BEE_CHAT_CONVO 
         WHERE WECHAT_ID = ? AND CONVO_ID = ? LIMIT 1`
      );
      return stmt.get(wechatId, convoId) || null;
    } catch (error) {
      console.error("获取会话详情失败:", error);
      return null;
    }
  }
  getSessionProfile(msg, convoId) {
    if (msg.chatType === "2") {
      const room = this.getGroupInfo(convoId);
      return {
        avatar: (room == null ? void 0 : room.ROOM_AVATAR) || msg.receiverAvatar || "",
        nickname: (room == null ? void 0 : room.ROOM_NICKNAME) || msg.receiverNicknam
      };
    } else {
      const contact = this.getContactInfo(convoId);
      return {
        avatar: (contact == null ? void 0 : contact.CONTACT_AVATAR) || msg.senderAvatar || "",
        nickname: (contact == null ? void 0 : contact.CONTACT_NICKNAME) || msg.senderNickname
      };
    }
  }
  getGroupInfo(roomId) {
    const stmt = this.db.prepare(
      `SELECT ROOM_AVATAR, ROOM_NICKNAME FROM T_BEE_CHAT_ROOM 
       WHERE ROOM_ID = ? LIMIT 1`
    );
    return stmt.get(roomId);
  }
  getContactInfo(contactWechatId) {
    const stmt = this.db.prepare(
      `SELECT CONTACT_AVATAR, CONTACT_NICKNAME FROM T_BEE_CHAT_CONTACT 
       WHERE CONTACT_WECHAT_ID = ? LIMIT 1`
    );
    return stmt.get(contactWechatId);
  }
}
const dbPath = path.join(app.getPath("userData"), "chat_app.db");
let db;
let messageManager;
let sessionManager;
function initializeDatabase() {
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  console.log("数据库已成功创建============>", dbDir);
  db = new Database(dbPath, { verbose: console.log });
  messageManager = new MessageManager(db);
  sessionManager = new SessionManager(db);
  try {
    const sqlScript = fs.readFileSync(getResourcePath("database/schema/ddl.sql"), "utf8");
    db.exec(sqlScript);
    console.log("数据库初始化成功！");
  } catch (err) {
    console.error("数据库初始化失败:", err);
  }
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
var DB_EVENTS = /* @__PURE__ */ ((DB_EVENTS2) => {
  DB_EVENTS2["ON_MESSAGE"] = "DB:ON_MESSAGE";
  DB_EVENTS2["GET_MESSAGES"] = "DB:GET_MESSAGES";
  DB_EVENTS2["GET_SESSIONS"] = "DB:GET_SESSIONS";
  return DB_EVENTS2;
})(DB_EVENTS || {});
const _FieldConverter = class _FieldConverter {
  /**
   * 蛇形命名转换为驼峰命名
   * @param str 蛇形命名字符串
   * @returns 驼峰命名字符串
   */
  static snakeToCamel(str) {
    if (str === str.toUpperCase()) {
      return str.toLowerCase().replace(/(_\w)/g, (m) => m[1].toUpperCase());
    }
    return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase().replace(/(?:_)(\w)/g, (_, c) => c.toUpperCase()).replace(/^_/, "");
  }
  /**
   * 获取字段映射关系
   * @param keys 原始字段名数组
   * @returns 字段映射对象 {原字段名: 驼峰字段名}
   */
  static getFieldMap(keys) {
    const cacheKey = keys.sort().join(",");
    if (!_FieldConverter.fieldMapCache.has(cacheKey)) {
      const map = {};
      keys.forEach((key) => {
        map[key] = _FieldConverter.snakeToCamel(key);
      });
      _FieldConverter.fieldMapCache.set(cacheKey, map);
    }
    return _FieldConverter.fieldMapCache.get(cacheKey);
  }
  /**
   * 转换单行数据
   * @param row 原始数据行
   * @param fieldMap 字段映射对象
   * @returns 转换后的数据行
   */
  static convertRow(row, fieldMap) {
    if (_FieldConverter.rowCache.has(row)) {
      return _FieldConverter.rowCache.get(row);
    }
    const map = fieldMap || _FieldConverter.getFieldMap(Object.keys(row));
    const newRow = {};
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        const newKey = map[key] || key;
        newRow[newKey] = row[key];
      }
    }
    _FieldConverter.rowCache.set(row, newRow);
    return newRow;
  }
  /**
   * 转换整个结果集
   * @param rows 原始数据数组
   * @returns 转换后的数据数组
   */
  static convertResultSet(rows) {
    if (rows.length === 0) return [];
    const fieldMap = _FieldConverter.getFieldMap(Object.keys(rows[0]));
    return rows.map((row) => _FieldConverter.convertRow(row, fieldMap));
  }
};
__publicField(_FieldConverter, "fieldMapCache", /* @__PURE__ */ new Map());
__publicField(_FieldConverter, "rowCache", /* @__PURE__ */ new WeakMap());
let FieldConverter = _FieldConverter;
const regsiterDatabaseHandler = () => {
  ipcMain.handle(DB_EVENTS.ON_MESSAGE, async (_event, msg) => {
    const db2 = getDB();
    try {
      db2.transaction(() => {
        const convoInfo = sessionManager.getSessionInfo(msg);
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
        messageManager.insertMessage(msg);
        sessionManager.updateSessionLastMsg(msg, convoInfo.convoId);
      })();
    } catch (error) {
      console.error("IPC Error - DB:ON_MESSAGE:", error);
      _event.sender.send("message-process-error", {
        msgId: msg.msgId,
        error: error.message
      });
    }
  });
  ipcMain.handle(DB_EVENTS.GET_MESSAGES, async (_event, params) => {
    try {
      const messages = messageManager.getMessages(
        params.wechatId,
        params.convoId,
        params.chatType,
        params.options
      );
      console.log("===========================messages===========================", messages);
      return { success: true, data: FieldConverter.convertResultSet(messages) };
    } catch (error) {
      console.error("IPC Error - DB:GET_MESSAGES:", error);
      return { success: false, error: error.message || "Failed to get messages" };
    }
  });
  ipcMain.handle(DB_EVENTS.GET_SESSIONS, async (_event, params) => {
    try {
      const sessions = sessionManager.getSessions(
        params.wechatId,
        params.options
      );
      console.log("===========================messages===========================", sessions);
      return { success: true, data: sessions };
    } catch (error) {
      console.error("IPC Error - DB:GET_SESSIONS:", error);
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
