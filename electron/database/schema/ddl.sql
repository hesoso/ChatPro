-- 联系人表 (T_BEE_CHAT_CONTACT)
CREATE TABLE IF NOT EXISTS T_BEE_CHAT_CONTACT (
    ID                INTEGER PRIMARY KEY AUTOINCREMENT, -- '主键'
    WECHAT_ID         TEXT NOT NULL, -- '微信ID'
    CONTACT_WECHAT_ID TEXT NOT NULL, -- '联系人微信ID'
    CONTACT_NO        TEXT NOT NULL, -- '联系人微信号'
    CONTACT_NICKNAME  TEXT NOT NULL, -- '联系人微信昵称'
    CONTACT_AVATAR    TEXT, -- '联系人微信头像'
    REMARK            TEXT, -- '备注'
    CONTACT_TYPE      TEXT, -- '联系人类型(1:个微联系人,2:企业联系人,3:内部联系人,4:外部联系人)'
    MOBILE            TEXT, -- '电话'
    LABEL             TEXT, -- '标签($标签1$,$标签2$)'
    DESCRIPTION       TEXT, -- '描述'
    GENDER            TEXT, -- '性别(0:未知,1:男,2:女)'
    PROVINCE          TEXT, -- '省份'
    CITY              TEXT, -- '城市'
    COMPANY_ID        TEXT, -- '公司ID'
    COMPANY_NAME      TEXT, -- '公司名称'
    RELATION          TEXT, -- '联系人关系(1:正常,0:已被删)'
    ADD_CONTACT_TIME  INTEGER, -- '添加为联系人时间'
    CREATE_BY         TEXT, -- '创建人'
    CREATE_TIME       INTEGER, -- '创建时间'
    UPDATE_BY         TEXT, -- '修改人'
    UPDATE_TIME       INTEGER -- '修改时间'
);

-- 唯一索引: 微信ID + 联系人微信ID
CREATE UNIQUE INDEX IF NOT EXISTS IX_T_BEE_CHAT_CONTACT_WC 
    ON T_BEE_CHAT_CONTACT (WECHAT_ID, CONTACT_WECHAT_ID);

-- 单字段索引
CREATE INDEX IF NOT EXISTS IX_T_BEE_CHAT_CONTACT_CWI 
    ON T_BEE_CHAT_CONTACT (CONTACT_WECHAT_ID);
CREATE INDEX IF NOT EXISTS IX_T_BEE_CHAT_CONTACT_ACT 
    ON T_BEE_CHAT_CONTACT (ADD_CONTACT_TIME);

-- 群表 (T_BEE_CHAT_ROOM)
CREATE TABLE IF NOT EXISTS T_BEE_CHAT_ROOM (
    ID                INTEGER PRIMARY KEY AUTOINCREMENT, -- '主键'
    WECHAT_ID         TEXT NOT NULL, -- '微信ID'
    ROOM_ID           TEXT NOT NULL, -- '群ID'
    ROOM_NICKNAME     TEXT NOT NULL, -- '群昵称'
    ROOM_AVATAR       TEXT, -- '群头像'
    ROOM_TYPE         TEXT, -- '群类型(1:个微群,2:企微群)'
    OWNER_WECHAT_ID   TEXT, -- '群主微信ID'
    ADMIN_FLAG        TEXT, -- '群管理标识(1:是,0:否)'
    ME_REMARK         TEXT, -- '我给本群的备注'
    ROOM_NUM          INTEGER DEFAULT 0, -- '群人数'
    ANNCMNT           TEXT, -- '群公告'
    PUBLISH_WECHAT_ID TEXT, -- '发布人微信ID'
    PUBLISH_NICKNAME  TEXT, -- '发布人微信昵称'
    PUBLISH_AVATAR    TEXT, -- '发布人微信头像'
    PUBLISH_TIME      INTEGER, -- '发布时间'
    CREATE_BY         TEXT, -- '创建人'
    CREATE_TIME       INTEGER, -- '创建时间'
    UPDATE_BY         TEXT, -- '修改人'
    UPDATE_TIME       INTEGER  -- '修改时间'
);

-- 唯一索引: 微信ID + 群ID
CREATE UNIQUE INDEX IF NOT EXISTS IX_T_BEE_CHAT_ROOM_WR 
    ON T_BEE_CHAT_ROOM (WECHAT_ID, ROOM_ID);

-- 单字段索引
CREATE INDEX IF NOT EXISTS IX_T_BEE_CHAT_ROOM_RI 
    ON T_BEE_CHAT_ROOM (ROOM_ID);

-- 群成员表 (T_BEE_CHAT_ROOM_MEMBER)
CREATE TABLE IF NOT EXISTS T_BEE_CHAT_ROOM_MEMBER (
    ID                INTEGER PRIMARY KEY AUTOINCREMENT, -- '主键'
    WECHAT_ID         TEXT NOT NULL, -- '微信ID'
    ROOM_ID           TEXT NOT NULL, -- '群ID'
    MEMBER_WECHAT_ID  TEXT NOT NULL, -- '群成员微信ID'
    MEMBER_NICKNAME   TEXT NOT NULL, -- '群成员微信昵称'
    MEMBER_AVATAR     TEXT, -- '群成员微信头像'
    REMARK            TEXT, -- '备注'
    OWNER_FLAG        TEXT, -- '群主标识(1:是,0:否)'
    ADMIN_FLAG        TEXT, -- '群管理标识(1:是,0:否)'
    GENDER            TEXT, -- '性别(0:未知,1:男,2:女)'
    COMPANY_ID        TEXT, -- '公司ID'
    COMPANY_NAME      TEXT, -- '公司名称'
    INVITER_WECHAT_ID TEXT, -- '邀请人微信ID'
    JOIN_ROOM_TIME    INTEGER  -- '进群时间'
);

-- 唯一索引: 微信ID + 群ID + 成员微信ID
CREATE UNIQUE INDEX IF NOT EXISTS IX_T_BEE_CHAT_ROOM_MEMBER_WRM 
    ON T_BEE_CHAT_ROOM_MEMBER (WECHAT_ID, ROOM_ID, MEMBER_WECHAT_ID);

-- 组合索引
CREATE INDEX IF NOT EXISTS IX_T_BEE_CHAT_ROOM_MEMBER_RM 
    ON T_BEE_CHAT_ROOM_MEMBER (ROOM_ID, MEMBER_WECHAT_ID);

-- 单字段索引
CREATE INDEX IF NOT EXISTS IX_T_BEE_CHAT_ROOM_MEMBER_MWI 
    ON T_BEE_CHAT_ROOM_MEMBER (MEMBER_WECHAT_ID);
CREATE INDEX IF NOT EXISTS IX_T_BEE_CHAT_ROOM_MEMBER_IWI 
    ON T_BEE_CHAT_ROOM_MEMBER (INVITER_WECHAT_ID);
CREATE INDEX IF NOT EXISTS IX_T_BEE_CHAT_ROOM_MEMBER_JRT 
    ON T_BEE_CHAT_ROOM_MEMBER (JOIN_ROOM_TIME);


-- 消息表 (T_BEE_CHAT_MSG)
CREATE TABLE IF NOT EXISTS T_BEE_CHAT_MSG (
    ID                  INTEGER PRIMARY KEY AUTOINCREMENT, -- '主键'
    WECHAT_ID           TEXT NOT NULL, -- '微信ID'
    CHAT_TYPE           TEXT, -- '聊天类型(1:私聊,2:群聊,3:模拟)'
    SENDER              TEXT NOT NULL, -- '发送人(微信ID|群成员微信ID|模拟群成员微信ID)'
    SENDER_AVATAR       TEXT, -- '发送人头像'
    SENDER_NICKNAME     TEXT, -- '发送人昵称'
    RECEIVER            TEXT NOT NULL, -- '接收人(微信ID|群ID|模拟群成员微信ID)'
    RECEIVER_AVATAR     TEXT, -- '接收人头像'
    RECEIVER_NICKNAME   TEXT, -- '接收人昵称'
    SOURCE_ROOM_AVATAR  TEXT, -- '来源群头像'
    SOURCE_ROOM_NAME    TEXT, -- '来源群名称'
    MSG_ID              TEXT NOT NULL, -- '消息ID'
    CONTENT_TYPE        TEXT, -- '消息类型(@枚举)'
    CONTENT             TEXT, -- '消息内容'
    REVOKE_FLAG         TEXT, -- '撤回标识(1:是,0:否)'
    CLIENT_FLAG         TEXT, -- '客户端消息标识(1:是,0:否)' 默认传1
    SEND_USER_ID        TEXT, -- '发送用户ID'
    SEND_USER_NICKNAME  TEXT, -- '发送用户昵称'
    CREATE_BY           TEXT, -- '创建人'
    CREATE_TIME         INTEGER, -- '创建时间'
    UPDATE_BY           TEXT, -- '修改人'
    UPDATE_TIME         INTEGER  -- '修改时间'
    QUOTE_MSG_ID        TEXT, -- '引用消息ID'
    SEND_FLAG           TEXT -- '消息方向(0:接收,1:发送)'
);

-- 唯一索引: 微信ID + 消息ID
CREATE UNIQUE INDEX IF NOT EXISTS IX_T_BEE_CHAT_MSG_WCM 
    ON T_BEE_CHAT_MSG (WECHAT_ID, 'CHAT_TYPE', MSG_ID);

-- 单字段索引
CREATE INDEX IF NOT EXISTS IX_T_BEE_CHAT_MSG_S 
    ON T_BEE_CHAT_MSG (SENDER);
CREATE INDEX IF NOT EXISTS IX_T_BEE_CHAT_MSG_R 
    ON T_BEE_CHAT_MSG (RECEIVER);
CREATE INDEX IF NOT EXISTS IX_T_BEE_CHAT_MSG_MI 
    ON T_BEE_CHAT_MSG (MSG_ID);
CREATE INDEX IF NOT EXISTS IX_T_BEE_CHAT_MSG_CT 
    ON T_BEE_CHAT_MSG (CONTENT_TYPE);

-- 会话表 (T_BEE_CHAT_CONVO)
CREATE TABLE IF NOT EXISTS T_BEE_CHAT_CONVO (
    ID                   INTEGER PRIMARY KEY AUTOINCREMENT, -- '主键'
    WECHAT_ID            TEXT, -- '微信ID'
    CONVO_ID             TEXT, -- '会话ID(微信ID|群ID|模拟群成员微信ID)'
    CONVO_NICKNAME       TEXT, -- '会话昵称'
    CONVO_AVATAR         TEXT, -- '会话头像'
    SEND_WECHAT_ID       TEXT, -- '发送人微信ID'
    SEND_WECHAT_NICKNAME TEXT, -- '发送人微信昵称'
    SOURCE_ROOM_ID       TEXT, -- '来源群ID'
    SOURCE_ROOM_NICK     TEXT, -- '来源群昵称'
    CONVO_TYPE           TEXT, -- '会话类型(1:私聊,2:群聊,3:模拟)'
    TOP_FLAG             TEXT, -- '置顶标识(1:已置顶,0:未置顶)'
    DISTURB_FLAG         TEXT, -- '免打扰标识(1:已免打扰,0:未免打扰)'
    LAST_MSG_ID          TEXT, -- '最后一条消息ID'
    CONTENT              TEXT, -- '消息内容'
    MSG_TIME             INTEGER, -- '消息时间'
    CREATE_BY            TEXT, -- '创建人'
    CREATE_TIME          INTEGER, -- '创建时间'
    UPDATE_BY            TEXT, -- '修改人'
    UPDATE_TIME          INTEGER  -- '修改时间'
    DRAFT                TEXT, -- '草稿内容'
    UNREAD_COUNT         INTEGER DEFAULT 0 -- '未读消息数'
);

-- 唯一索引: 微信ID + 会话ID
CREATE UNIQUE INDEX IF NOT EXISTS IX_T_BEE_CHAT_CONVO_WC 
    ON T_BEE_CHAT_CONVO (WECHAT_ID, CONVO_ID);

-- 组合索引
CREATE INDEX IF NOT EXISTS IX_T_BEE_CHAT_CONVO_SRI 
    ON T_BEE_CHAT_CONVO (SOURCE_ROOM_ID);
CREATE INDEX IF NOT EXISTS IX_T_BEE_CHAT_CONVO_MT 
    ON T_BEE_CHAT_CONVO (MSG_TIME);
