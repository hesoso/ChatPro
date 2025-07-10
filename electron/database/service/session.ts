import Database from 'better-sqlite3';
import MessageManager from './message'

interface SessionInfo {
  wechatId: string;
  convoId: string;
  convoType: string;
}

export default class SessionManager {
  constructor(private db: Database.Database) {}

  getSessionInfo(msg: any): SessionInfo {
    const isGroupChat = msg.chatType === '2';
    return {
      wechatId: msg.wechatId,
      convoId: isGroupChat ? msg.receiver : 
               msg.sendFlag === '1' ? msg.receiver : msg.sender,
      convoType: msg.chatType
    };
  }

  // 检查会话是否存在
  checkSessionExists(wechatId: string, convoId: string): boolean {
    const stmt = this.db.prepare(
      `SELECT 1 FROM T_BEE_CHAT_CONVO 
       WHERE WECHAT_ID = ? AND CONVO_ID = ? LIMIT 1`
    );
    return !!stmt.get(wechatId, convoId);
  }

  // 创建会话
  createSession(msg: any, convoId: string, convoType: string): void {
    const isGroup = convoType === '2';
    const { avatar, nickname } = this.getSessionProfile(msg, convoId, isGroup);

    const stmt = this.db.prepare(
      `INSERT INTO T_BEE_CHAT_CONVO (
        WECHAT_ID, CONVO_ID, CONVO_NICKNAME, CONVO_AVATAR, CONVO_TYPE,
        TOP_FLAG, DISTURB_FLAG, LAST_MSG_ID, CONTENT, MSG_TIME,
        CREATE_TIME, UPDATE_TIME, UNREAD_COUNT, DRAFT
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    stmt.run(
      msg.wechatId,
      convoId,
      nickname || (isGroup ? '群聊' : '私聊'),
      avatar || '',
      convoType,
      '0', // 未置顶
      '0', // 未免打扰
      '',  // 初始无消息ID
      '',  // 初始无内容
      0,   // 初始消息时间
      Date.now(),
      Date.now(),
      msg.sendFlag === '0' ? 1 : 0, // 接收消息时未读数为1
      ''   // 空草稿
    );
  }

  // 更新会话的最后一条消息
  updateSessionLastMsg(msg: any, convoId: string): void {
    const updateFields = [
      'LAST_MSG_ID = ?',
      'CONTENT = ?',
      'MSG_TIME = ?',
      'UPDATE_TIME = ?'
    ];

    const params = [
      msg.msgId,
      msg.content,
      Date.now(),
      Date.now()
    ];

    // 接收消息时增加未读数
    if (msg.sendFlag === '0') {
      updateFields.push('UNREAD_COUNT = UNREAD_COUNT + 1');
    } else {
      // 发送消息时重置草稿
      updateFields.push('DRAFT = ?');
      params.push('');
    }

    const stmt = this.db.prepare(
      `UPDATE T_BEE_CHAT_CONVO 
       SET ${updateFields.join(', ')} 
       WHERE WECHAT_ID = ? AND CONVO_ID = ?`
    );

    stmt.run(...params, msg.wechatId, convoId);
  }

  // 获取会话列表（分页+排序）
  getSessions(
    wechatId: string,
    options: {
      limit?: number;
      offset?: number;
      search?: string;
      onlyUnread?: boolean;
    } = {}
  ): any[] {
    try {
      const conditions = ['WECHAT_ID = ?'];
      const params: any[] = [wechatId];
      
      if (options.search) {
        conditions.push('(CONVO_NICKNAME LIKE ? OR CONTENT LIKE ?)');
        params.push(`%${options.search}%`, `%${options.search}%`);
      }
      
      if (options.onlyUnread) {
        conditions.push('UNREAD_COUNT > 0');
      }
      
      let query = `SELECT * FROM T_BEE_CHAT_CONVO 
                   WHERE ${conditions.join(' AND ')} 
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
      console.error('获取会话列表失败:', error);
      return [];
    }
  }

  // 删除会话（及相关消息）
  deleteSession(wechatId: string, convoId: string): boolean {
    try {
      // 启动事务
      this.db.exec('BEGIN TRANSACTION');
      
      try {
        // 1. 获取会话类型
        const session = this.getSession(wechatId, convoId);
        if (!session) {
          return false;
        }
        
        // 2. 删除相关消息
        const messageManager = new MessageManager(this.db);
        messageManager.deleteMessagesBySession(
          wechatId, 
          convoId, 
          session.CONVO_TYPE
        );
        
        // 3. 删除会话
        const deleteStmt = this.db.prepare(
          `DELETE FROM T_BEE_CHAT_CONVO 
           WHERE WECHAT_ID = ? AND CONVO_ID = ?`
        );
        
        deleteStmt.run(wechatId, convoId);
        
        // 提交事务
        this.db.exec('COMMIT');
        return true;
      } catch (innerError) {
        this.db.exec('ROLLBACK');
        throw innerError;
      }
    } catch (error) {
      console.error('删除会话失败:', error);
      return false;
    }
  }

  // 更新会话草稿
  updateSessionDraft(wechatId: string, convoId: string, draft: string): boolean {
    try {
      const stmt = this.db.prepare(
        `UPDATE T_BEE_CHAT_CONVO 
         SET DRAFT = ?, UPDATE_TIME = ? 
         WHERE WECHAT_ID = ? AND CONVO_ID = ?`
      );
      
      stmt.run(draft, Date.now(), wechatId, convoId);
      return true;
    } catch (error) {
      console.error('更新会话草稿失败:', error);
      return false;
    }
  }

  // 重置会话未读数
  resetUnreadCount(wechatId: string, convoId: string): boolean {
    try {
      const stmt = this.db.prepare(
        `UPDATE T_BEE_CHAT_CONVO 
         SET UNREAD_COUNT = 0, UPDATE_TIME = ? 
         WHERE WECHAT_ID = ? AND CONVO_ID = ?`
      );
      
      stmt.run(Date.now(), wechatId, convoId);
      return true;
    } catch (error) {
      console.error('重置未读数失败:', error);
      return false;
    }
  }

  // 获取单个会话详情
  getSession(wechatId: string, convoId: string): any | null {
    try {
      const stmt = this.db.prepare(
        `SELECT * FROM T_BEE_CHAT_CONVO 
         WHERE WECHAT_ID = ? AND CONVO_ID = ? LIMIT 1`
      );
      
      return stmt.get(wechatId, convoId) || null;
    } catch (error) {
      console.error('获取会话详情失败:', error);
      return null;
    }
  }

  private getSessionProfile(msg: any, convoId: string, isGroup: boolean) {
    if (isGroup) {
      const room = this.getGroupInfo(convoId);
      return {
        avatar: room?.ROOM_AVATAR || msg.receiverAvatar || '',
        nickname: room?.ROOM_NICKNAME || msg.receiverNickname || '群聊'
      };
    } else {
      const contact = this.getContactInfo(convoId);
      return {
        avatar: contact?.CONTACT_AVATAR || msg.senderAvatar || '',
        nickname: contact?.CONTACT_NICKNAME || msg.senderNickname || '私聊'
      };
    }
  }

  private getGroupInfo(roomId: string) {
    const stmt = this.db.prepare<string, {
        ROOM_AVATAR: string;
        ROOM_NICKNAME: string;
    }>(
      `SELECT ROOM_AVATAR, ROOM_NICKNAME FROM T_BEE_CHAT_ROOM 
       WHERE ROOM_ID = ? LIMIT 1`
    );
    return stmt.get(roomId);
  }

  private getContactInfo(contactWechatId: string) {
    const stmt = this.db.prepare<string, {
        CONTACT_AVATAR: string;
        CONTACT_NICKNAME: string;
    }>(
      `SELECT CONTACT_AVATAR, CONTACT_NICKNAME FROM T_BEE_CHAT_CONTACT 
       WHERE CONTACT_WECHAT_ID = ? LIMIT 1`
    );
    return stmt.get(contactWechatId);
  }
}