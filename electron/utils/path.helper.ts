import path from 'path';
import { app } from 'electron'; // 获取存储应用程序特定用户数据的标准位置。

// 获取资源路径（支持开发和生产环境）
export function getResourcePath(...paths: any[]) {
    // 开发环境使用项目根目录
    if (!app.isPackaged) {
        return path.join(process.cwd(), 'electron', ...paths);
    }
    // 生产环境使用应用资源目录
    return path.join(process.resourcesPath, ...paths);
}