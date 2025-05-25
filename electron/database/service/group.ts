import { getDB } from "../db";

export interface Group {
    id: number; // 群ID
    name: string; // 群名称
    avatar_url?: string | null; // 群头像
    owner_id_ref: string; // 群主wxid
    member_count: number; // 群成员数量
    announcement: string; // 群公告
    created_at?: number;
}

/**
 * 获取所有群
 * @returns 群列表
 */
export function getGroups(): Group[] {
    try {
        const sql = `SELECT * FROM groups`;
        return getDB().prepare(sql).all() as Group[];
    } catch (error) {
        console.error('获取群列表失败:', error);
        throw new Error('无法获取群列表');
    }
}

/**
 * 创建用户
 * @param groupData 群数据
 * @returns 群ID
 */
export function createUser(groupData: Group): number {
    const { id, name, avatar_url, owner_id_ref, member_count, announcement } = groupData;

    try {
        const sql = `
            INSERT INTO groups (id, name, avatar_url, owner_id_ref, member_count, announcement)
            VALUES (@id, @name, @avatar_url, @owner_id_ref, @member_count, @announcement)
        `;
        const params = { id, name, avatar_url, owner_id_ref, member_count, announcement }
        const result = getDB().prepare(sql).run(params);
        return Number(result.lastInsertRowid);
    } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            throw new Error(`群 [ ${name} ] 已存在`);
        }
        console.error('创建群失败:', error);
        throw new Error('创建群失败，请检查数据');
    }
}