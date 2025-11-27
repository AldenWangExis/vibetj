"use server";

import { mapService } from "@/services/mapService";
import { revalidatePath } from "next/cache";
import type { NewMapMarker } from "@/types/map";

/**
 * 创建地图标记
 *
 * @param {unknown} prevState - useActionState 的上一次状态 (未使用)
 * @param {FormData} formData - 表单数据
 * @returns {Promise<{success: boolean, data?: any, error?: string}>} 操作结果
 *
 * @throws 不会抛出异常，错误通过返回值传递
 */
export async function createMapMarker(prevState: unknown, formData: FormData) {
  try {
    // 从 FormData 解析数据
    const name = formData.get("name") as string;
    const lat = parseFloat(formData.get("lat") as string);
    const lng = parseFloat(formData.get("lng") as string);
    const address = formData.get("address") as string | null;
    const description = formData.get("description") as string | null;

    // 简单的服务端校验 (虽然 Zod 更佳，但此处保持轻量)
    if (!lat || !lng || !name) {
      return {
        success: false as const,
        error: "Missing required fields: name, lat, lng",
      };
    }

    const data: NewMapMarker = {
      name,
      lat,
      lng,
      address: address || null,
      description: description || null,
    };

    const marker = await mapService.createMarker(data);
    revalidatePath("/map"); // 刷新缓存
    return { success: true as const, data: marker };
  } catch (error) {
    console.error("[Action] Failed to create marker:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
