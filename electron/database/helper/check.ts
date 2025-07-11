import { getDB } from "../db";

/**
 * 检查某个表中是否存在某个 ID
 * @param table 表名
 * @param key 外键对应的唯一标识key，通常为id
 * @param value 外键对应的唯一标识的值
 * @returns boolean
 */
export function checkRecordExists(table: string, key: string, value: string): boolean {
    const db = getDB()
    const sql = `SELECT 1 FROM ${table} WHERE ${key} = ?`
    const checkStmt = db.prepare(sql);
    return !!checkStmt.get(value);
}
