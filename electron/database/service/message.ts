import Database from 'better-sqlite3';

export default class MessageManager {
  constructor(private db: Database.Database) { }

  // 插入单条消息
  insertMessage(msg: any): boolean {
    try {
      // 检查消息是否已存在
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
        msg.wechatId === msg.sender ? '1' : '0',
        Date.now(),
        Date.now(),
        msg.quoteMsgId || ''
      );

      return true;
    } catch (error) {
      console.error('插入消息失败:', error);
      return false;
    }
  }

  // 批量插入消息（事务处理）
  insertMessages(messages: any[]): number {
    const insertStmt = this.db.prepare(
      `INSERT OR IGNORE INTO T_BEE_CHAT_MSG (
        WECHAT_ID, CHAT_TYPE, SENDER, SENDER_AVATAR, SENDER_NICKNAME,
        RECEIVER, RECEIVER_AVATAR, RECEIVER_NICKNAME, MSG_ID, CONTENT_TYPE,
        CONTENT, SEND_FLAG, CREATE_TIME, UPDATE_TIME, QUOTE_MSG_ID
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const insertMany = this.db.transaction((msgs: any[]) => {
      let count = 0;
      for (const msg of msgs) {
        // 检查消息是否已存在
        if (this.messageExists(msg.wechatId, msg.chatType, msg.msgId)) {
          console.log(`消息已存在: ${msg.msgId}`);
          break
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
            msg.quoteMsgId || ''
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
  messageExists(wechatId: string, chatType: string, msgId: string): boolean {
    const stmt = this.db.prepare(
      `SELECT 1 FROM T_BEE_CHAT_MSG 
       WHERE WECHAT_ID = ? AND CHAT_TYPE = ? AND MSG_ID = ? LIMIT 1`
    );
    return !!stmt.get(wechatId, chatType, msgId);
  }

  // 删除单条消息
  deleteMessage(wechatId: string, chatType: string, msgId: string): boolean {
    try {
      const stmt = this.db.prepare(
        `DELETE FROM T_BEE_CHAT_MSG 
         WHERE WECHAT_ID = ? AND CHAT_TYPE = ? AND MSG_ID = ?`
      );

      const result = stmt.run(wechatId, chatType, msgId);
      return result.changes > 0;
    } catch (error) {
      console.error('删除消息失败:', error);
      return false;
    }
  }

  // 根据会话删除消息
  deleteMessagesBySession(wechatId: string, convoId: string, chatType: string): number {
    try {
      // 根据会话类型确定删除条件
      let condition = '';
      if (chatType === '1') {
        // 私聊：sender或receiver等于会话ID
        condition = `(SENDER = ? OR RECEIVER = ?)`;
      } else if (chatType === '2') {
        // 群聊：receiver等于群ID
        condition = `RECEIVER = ?`;
      } else {
        throw new Error(`不支持的聊天类型: ${chatType}`);
      }

      const stmt = this.db.prepare(
        `DELETE FROM T_BEE_CHAT_MSG 
         WHERE WECHAT_ID = ? AND CHAT_TYPE = ? AND ${condition}`
      );

      const params = chatType === '1'
        ? [wechatId, chatType, convoId, convoId]
        : [wechatId, chatType, convoId];

      const result = stmt.run(...params);
      return result.changes;
    } catch (error) {
      console.error('删除会话消息失败:', error);
      return 0;
    }
  }

  // 获取消息列表（按会话和时间范围）
  getMessages(
    wechatId: string,
    convoId: string,
    chatType: string,
    options: {
      limit?: number;
      offset?: number;
      beforeTime?: number;
      afterTime?: number;
    } = {}
  ): any[] {
    try {
      // 基础条件
      let conditions = [
        'WECHAT_ID = ?',
        'CHAT_TYPE = ?'
      ];

      const params: any[] = [wechatId, chatType];

      // 根据会话类型添加条件
      if (chatType === '1') {
        // 私聊：sender或receiver等于会话ID
        conditions.push('(SENDER = ? OR RECEIVER = ?)');
        params.push(convoId, convoId);
      } else if (chatType === '2') {
        // 群聊：receiver等于群ID
        conditions.push('RECEIVER = ?');
        params.push(convoId);
      } else {
        throw new Error(`不支持的聊天类型: ${chatType}`);
      }

      // 时间范围条件
      if (options.beforeTime) {
        conditions.push('CREATE_TIME < ?');
        params.push(options.beforeTime);
      }

      if (options.afterTime) {
        conditions.push('CREATE_TIME > ?');
        params.push(options.afterTime);
      }

      // 构建查询
      let query = `SELECT * FROM T_BEE_CHAT_MSG WHERE ${conditions.join(' AND ')} 
                   ORDER BY CREATE_TIME DESC`;

      // 分页处理
      if (options.limit) {
        query += ` LIMIT ${options.limit}`;
        if (options.offset) {
          query += ` OFFSET ${options.offset}`;
        }
      }

      const stmt = this.db.prepare(query);
      return stmt.all(...params);
    } catch (error) {
      console.error('获取消息列表失败:', error);
      return [];
    }
  }

  // 获取最近一条消息
  getLastMessage(wechatId: string, convoId: string, chatType: string): any | null {
    try {
      const messages = this.getMessages(wechatId, convoId, chatType, { limit: 1 });
      return messages.length > 0 ? messages[0] : null;
    } catch (error) {
      console.error('获取最后一条消息失败:', error);
      return null;
    }
  }
}