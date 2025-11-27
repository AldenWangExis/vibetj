/**
 * lib/db/index.ts - Drizzle ORM 数据库连接实例
 *
 * 核心导出:
 * - db: Drizzle 数据库实例 (单例模式)
 *
 * 架构设计:
 * - 使用 Neon Serverless Driver (支持 Edge Runtime)
 * - 开发环境防止 HMR 导致连接数耗尽
 * - 生产环境使用连接池
 *
 * 使用方式:
 *   import { db } from '@/lib/db';
 *   const markers = await db.select().from(mapMarkers);
 *
 * 作者: Alden | 创建: 2025-11-27
 * 规范: docs/02_tds.md
 */

import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// 全局类型声明 (防止 TypeScript 报错)
declare global {
  var _neonPool: Pool | undefined;
}

/**
 * 获取 Neon 连接池 (单例模式)
 *
 * 开发环境: 使用 global 对象缓存，防止 HMR 重复创建
 * 生产环境: 直接创建新实例
 */
function getPool(): Pool {
  if (process.env.NODE_ENV === "development") {
    if (!global._neonPool) {
      global._neonPool = new Pool({ connectionString: process.env.DATABASE_URL });
      console.log("[DB] Created new Neon pool (development mode)");
    }
    return global._neonPool;
  }

  // 生产环境每次创建新实例
  return new Pool({ connectionString: process.env.DATABASE_URL });
}

// 导出 Drizzle 实例
export const db = drizzle(getPool(), { schema });

console.log("[DB] Drizzle instance initialized");
