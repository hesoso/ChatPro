import { getDB } from "../db";

export interface User {
    id?: number;
    wxid: string;
    nickname?: string | null;
    avatar_url?: string | null;
    remark?: string | null;
    type: 0 | 1; // 0 表示其他用户 1 表示当前登录账号
    created_at?: number;
}

/**
 * 根据类型获取用户列表
 * @param userData 用户数据（不包含 id 和 created_at）
 * @returns 用户列表
 */
export function getUsers(type: User['type']): User[] {
    try {
        const sql = `SELECT * FROM users WHERE type = ?`;
        return getDB().prepare(sql).all(type) as User[];
    } catch (error) {
        console.error('获取用户列表失败:', error);
        throw new Error('无法获取用户列表');
    }
}

/**
 * 创建用户
 * @param userData 用户数据（不包含 id 和 created_at）
 * @returns 用户ID
 */
export function createUser(userData: User): number {
    const { wxid, nickname = null, avatar_url = null, remark = null, type = 0 } = userData;

    if (!wxid?.trim()) {
        throw new Error('wxid 必须为非空字符串');
    }

    try {
        const sql = `
            INSERT INTO users (wxid, nickname, avatar_url, remark, type)
            VALUES (@wxid, @nickname, @avatar_url, @remark, @type)
        `;
        const result = getDB().prepare(sql).run({ wxid, nickname, avatar_url, remark, type });
        return Number(result.lastInsertRowid);
    } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            throw new Error(`用户 ${wxid} 已存在`);
        }
        console.error('创建用户失败:', error);
        throw new Error('创建用户失败，请检查数据');
    }
}