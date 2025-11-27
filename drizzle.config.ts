/**
 * drizzle.config.ts - Drizzle Kit 配置文件
 *
 * 核心功能:
 * - 定义数据库连接 (Neon Serverless Postgres)
 * - 指定 Schema 文件路径
 * - 配置 Migration 输出目录
 *
 * 使用方式:
 * - 生成迁移: npx drizzle-kit generate
 * - 推送 Schema: npx drizzle-kit push
 * - 查看 Studio: npx drizzle-kit studio
 *
 * 作者: Alden | 创建: 2025-11-27
 * 规范: docs/02_tds.md
 */

import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  // Schema 定义文件路径
  schema: "./src/lib/db/schema.ts",

  // Migration 文件输出目录
  out: "./drizzle",

  // 数据库驱动
  dialect: "postgresql",

  // Neon 数据库连接配置
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  // 开发配置
  verbose: true, // 输出详细日志
  strict: true, // 严格模式，防止危险操作
});

