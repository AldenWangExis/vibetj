/**
 * mapService.ts - 地图业务逻辑层
 *
 * 核心导出:
 * - mapService: 封装所有地图相关的数据库操作
 *
 * 职责:
 * - 数据读写 (CRUD)
 * - 错误处理与日志记录
 * - 业务校验 (虽然 Drizzle 有类型，但业务层仍需把关)
 *
 * 架构约束:
 * - 纯 TypeScript，不依赖 Next.js 特定 API (如 headers, cookies)
 * - 不包含 UI 逻辑
 *
 * 作者: Alden | 创建: 2025-11-27
 * 规范: docs/02_tds.md
 */

import { db } from "@/lib/db";
import { mapMarkers } from "@/lib/db/schema";
import type { NewMapMarker } from "@/types/map";
import { desc } from "drizzle-orm";

export const mapService = {
  /**
   * 获取所有标记
   *
   * @returns {Promise<MapMarker[]>} 标记列表，按活动日期排序
   * @throws {Error} 数据库查询失败
   */
  async getAllMarkers() {
    try {
      const result = await db.select().from(mapMarkers).orderBy(desc(mapMarkers.eventDate));

      console.log(`[MapService] Fetched ${result.length} markers`);
      return result;
    } catch (error) {
      console.error("[MapService] Failed to fetch markers:", error);
      throw new Error("Failed to load map markers");
    }
  },

  /**
   * 创建新标记
   *
   * @param {NewMapMarker} data - 新标记数据
   * @returns {Promise<MapMarker>} 创建成功的标记
   * @throws {Error} 数据库写入失败
   */
  async createMarker(data: NewMapMarker) {
    try {
      const result = await db.insert(mapMarkers).values(data).returning();

      if (!result || result.length === 0) {
        throw new Error("Insert failed, no data returned");
      }

      console.log("[MapService] Marker created:", result[0].id);
      return result[0];
    } catch (error) {
      console.error("[MapService] Failed to create marker:", error);
      throw new Error("Failed to save location");
    }
  },
};
