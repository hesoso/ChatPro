import path from 'path';
import fs from 'fs';
import { app } from 'electron'; // 获取存储应用程序特定用户数据的标准位置。
import Database, { type Database as DB } from 'better-sqlite3';
import {
    PRAGMA_FOREIGN_KEYS_ON,
    CREATE_USERS_TABLE_SQL,
    CREATE_MESSAGES_TABLE_SQL,
    CREATE_MESSAGES_SESSION_TIMESTAMP_INDEX_SQL,
    CREATE_SESSIONS_TABLE_SQL,
    CREATE_SESSIONS_UPDATED_AT_INDEX_SQL,
    CREATE_GROUPS_TABLE_SQL
} from './schema/ddl'

// 将数据库文件存储在用户数据目录
const dbPath: string = path.join(app.getPath('userData'), 'chat_app.db');
let db: DB;

/**
 * 初始化数据库。
 * 如果数据库目录或文件不存在，则会创建它们。
 * 同时会创建应用程序所需的表（如果它们尚不存在）。
 */
export function initializeDatabase(): void {
    // 如果目录不存在，则创建它 (虽然 better-sqlite3 会自动创建文件，但有时目录也需确保)
    const dbDir: string = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    console.log('数据库已成功创建============>', dbDir)
    // verbose 会在控制台打印执行的 SQL 语句，方便调试
    db = new Database(dbPath, { verbose: console.log });

    // 如果你使用外键，建议开启
    db.exec(PRAGMA_FOREIGN_KEYS_ON);


    // 创建表 (如果表不存在的话)
    db.exec(CREATE_USERS_TABLE_SQL);
    db.exec(CREATE_MESSAGES_TABLE_SQL);
    db.exec(CREATE_MESSAGES_SESSION_TIMESTAMP_INDEX_SQL);
    db.exec(CREATE_SESSIONS_TABLE_SQL);
    db.exec(CREATE_SESSIONS_UPDATED_AT_INDEX_SQL);
    db.exec(CREATE_GROUPS_TABLE_SQL);


    console.log('数据库已初始化，并确保表已创建。');
}

// 导出获取数据库实例的函数，以便在其他模块中使用
export function getDB(): DB {
    if (!db) {
        // 理论上，在 app.whenReady 之后 db 就应该被初始化了
        // 但为健壮性考虑，可以再次尝试初始化或抛出错误
        console.warn('数据库尚未初始化，正在尝试再次初始化...');
        initializeDatabase();
        if (!db) { // 如果再次初始化失败
            throw new Error('数据库实例尚未初始化，无法获取。请确保 initializeDatabase() 已成功调用。');
        }
    }
    return db;
}

