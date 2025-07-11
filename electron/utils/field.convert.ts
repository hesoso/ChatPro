export type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${Lowercase<T>}${Capitalize<SnakeToCamelCase<U>>}`
  : Lowercase<S>;


export type ConvertKeysToCamelCase<T> = T extends object
  ? {
      [K in keyof T as SnakeToCamelCase<string & K>]: ConvertKeysToCamelCase<T[K]>;
    }
  : T;

export type DatabaseRow = Record<string, any>;

// 字段转换工具类
export class FieldConverter {
  private static fieldMapCache = new Map<string, Record<string, string>>();
  private static rowCache = new WeakMap<object, any>();

  /**
   * 蛇形命名转换为驼峰命名
   * @param str 蛇形命名字符串
   * @returns 驼峰命名字符串
   */
  public static snakeToCamel(str: string): string {
    if (str === str.toUpperCase()) {
      return str
        .toLowerCase()
        .replace(/(_\w)/g, m => m[1].toUpperCase());
    }
    
    // 处理混合大小写的情况
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toLowerCase() // 转为小写
      .replace(/(?:_)(\w)/g, (_, c) => c.toUpperCase()) // 转换下划线后的字母
      .replace(/^_/, ''); // 移除开头的下划线（如果有）
  }

  /**
   * 获取字段映射关系
   * @param keys 原始字段名数组
   * @returns 字段映射对象 {原字段名: 驼峰字段名}
   */
  public static getFieldMap(keys: string[]): Record<string, string> {
    const cacheKey = keys.sort().join(',');
    
    if (!FieldConverter.fieldMapCache.has(cacheKey)) {
      const map: Record<string, string> = {};
      keys.forEach(key => {
        map[key] = FieldConverter.snakeToCamel(key);
      });
      FieldConverter.fieldMapCache.set(cacheKey, map);
    }
    
    return FieldConverter.fieldMapCache.get(cacheKey)!;
  }

  /**
   * 转换单行数据
   * @param row 原始数据行
   * @param fieldMap 字段映射对象
   * @returns 转换后的数据行
   */
  public static convertRow<T extends DatabaseRow>(
    row: T,
    fieldMap?: Record<string, string>
  ): ConvertKeysToCamelCase<T> {
    // 检查缓存
    if (FieldConverter.rowCache.has(row)) {
      return FieldConverter.rowCache.get(row);
    }
    
    const map = fieldMap || FieldConverter.getFieldMap(Object.keys(row));
    const newRow: any = {};
    
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        const newKey = map[key] || key;
        newRow[newKey] = row[key];
      }
    }
    
    // 缓存结果
    FieldConverter.rowCache.set(row, newRow);
    return newRow;
  }

  /**
   * 转换整个结果集
   * @param rows 原始数据数组
   * @returns 转换后的数据数组
   */
  public static convertResultSet<T extends DatabaseRow>(
    rows: T[]
  ): ConvertKeysToCamelCase<T>[] {
    if (rows.length === 0) return [];
    
    // 获取字段映射（使用第一行确定字段结构）
    const fieldMap = FieldConverter.getFieldMap(Object.keys(rows[0]));
    
    return rows.map(row => FieldConverter.convertRow(row, fieldMap));
  }
}