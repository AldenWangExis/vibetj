/**
 * lib/db/schema.ts - 数据库表结构定义
 *
 * 核心导出:
 * - mapMarkers: 地图标记表
 *
 * 表设计说明:
 * - 使用 doublePrecision 存储经纬度，保证坐标精度
 * - eventDate 可选，支持未来活动规划
 * - createdAt 自动记录创建时间
 *
 * 作者: Alden | 创建: 2025-11-27
 * 规范: docs/02_fds.md, docs/02_tds.md
 */

import { pgTable, serial, text, doublePrecision, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * 地图标记表 (Map Markers)
 *
 * 用途: 存储用户标记的活动地点
 */
export const mapMarkers = pgTable("map_markers", {
  // 主键
  id: serial("id").primaryKey(),

  // 地点信息
  name: varchar("name", { length: 255 }).notNull(), // 地点名称
  address: text("address"), // 详细地址

  // 坐标信息 (高德地图使用 GCJ-02 坐标系)
  lat: doublePrecision("lat").notNull(), // 纬度
  lng: doublePrecision("lng").notNull(), // 经度

  // 活动信息
  description: text("description"), // 活动描述/备注
  eventDate: timestamp("event_date"), // 活动举办时间

  // 元数据
  createdAt: timestamp("created_at").defaultNow().notNull(), // 创建时间
});
