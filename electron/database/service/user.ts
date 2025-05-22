import { Database } from 'better-sqlite3';
import { getDB } from "../db";

export interface User {
    id?: number;
    wxid: string;
    nickname?: string | null;
    avatar_url?: string | null;
    remark?: string | null;
    created_at?: number;
}

/**
 * 获取所有用户
 * @returns 用户列表
 * @throws 若查询失败抛出错误
 */
export function getUsers(db: Database = getDB()): User[] {
    try {
        const sql = `SELECT id, wxid, nickname, avatar_url, remark, created_at FROM users`;
        return db.prepare(sql).all() as User[];
    } catch (error) {
        console.error('获取用户列表失败:', error);
        throw new Error('无法获取用户列表');
    }
}

/**
 * 创建用户
 * @param user 用户数据（不包含 id 和 created_at）
 * @param db 可选数据库实例（支持事务）
 * @returns 新用户ID
 * @throws 若创建失败或wxid冲突抛出错误
 */
export function createUser(user: User, db: Database = getDB()): number {
    const { wxid, nickname = null, avatar_url = null, remark = null } = user;

    if (!wxid?.trim()) {
        throw new Error('wxid 必须为非空字符串');
    }

    try {
        const sql = `
            INSERT INTO users (wxid, nickname, avatar_url, remark)
            VALUES (@wxid, @nickname, @avatar_url, @remark)
        `;
        const result = db.prepare(sql).run({ wxid, nickname, avatar_url, remark });
        return Number(result.lastInsertRowid);
    } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            throw new Error(`用户 ${wxid} 已存在`);
        }
        console.error('创建用户失败:', error);
        throw new Error('创建用户失败，请检查数据');
    }
}