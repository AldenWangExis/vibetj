"use client";

/**
 * hooks/use-amap.ts - 高德地图加载 Hook
 *
 * 核心功能:
 * - 封装 @amap/amap-jsapi-loader 加载逻辑
 * - 管理地图实例生命周期
 * - 注入安全密钥
 *
 * 使用方式:
 *   const { map, isLoaded, error } = useAMap('map-container', {
 *     center: [116.397428, 39.90923],
 *     zoom: 11,
 *   });
 *
 * 关键约束:
 * - 必须在 useEffect 中调用 map.destroy() 防止内存泄漏
 * - 必须在加载前注入 window._AMapSecurityConfig
 * - 使用 Ref 防止 React Strict Mode 双重初始化
 *
 * 作者: Alden | 创建: 2025-11-27
 * 规范: docs/02_tds.md
 */

import { useEffect, useRef, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import type { AMapInstance } from "@/types/map";

interface UseAMapOptions {
  center?: [number, number]; // 初始中心点 [lng, lat]
  zoom?: number; // 初始缩放级别
  mapStyle?: string; // 地图样式 ID
  viewMode?: "2D" | "3D"; // 视图模式
}

interface UseAMapReturn {
  map: AMapInstance | null;
  isLoaded: boolean;
  error: Error | null;
}

/**
 * 高德地图加载 Hook
 *
 * @param containerId - 地图容器 DOM ID
 * @param options - 地图初始化配置
 *
 * @throws 不会抛出异常，错误通过 error 状态返回
 */
export function useAMap(containerId: string, options: UseAMapOptions = {}): UseAMapReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mapRef = useRef<AMapInstance | null>(null);
  const isInitializedRef = useRef(false); // 防止 Strict Mode 双重初始化

  useEffect(() => {
    // 防止重复初始化
    if (isInitializedRef.current) return;

    let mapInstance: AMapInstance | null = null;

    async function initMap() {
      try {
        // 1. 注入安全密钥 (必须在 load 之前)
        if (!window._AMapSecurityConfig) {
          window._AMapSecurityConfig = {
            securityJsCode: process.env.NEXT_PUBLIC_AMAP_SECURITY_CODE || "",
          };
          console.log("[AMap] Security config injected");
        }

        // 2. 加载高德地图 API
        const AMap = await AMapLoader.load({
          key: process.env.NEXT_PUBLIC_AMAP_KEY || "",
          version: "2.0",
          plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.PlaceSearch"],
        });

        console.log("[AMap] API loaded successfully");

        // 3. 初始化地图实例
        mapInstance = new AMap.Map(containerId, {
          center: options.center || [116.397428, 39.90923], // 默认北京
          zoom: options.zoom || 11,
          viewMode: options.viewMode || "3D",
          mapStyle: options.mapStyle || "amap://styles/dark", // 默认暗色主题
          showLabel: true,
        });

        mapRef.current = mapInstance;
        isInitializedRef.current = true;
        setIsLoaded(true);

        console.log("[AMap] Map instance created");
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to load AMap");
        console.error("[AMap] Initialization failed:", error);
        setError(error);
      }
    }

    initMap();

    // 清理函数: 销毁地图实例
    return () => {
      if (mapInstance) {
        console.log("[AMap] Destroying map instance");
        mapInstance.destroy();
        mapRef.current = null;
      }
    };
  }, [containerId, options.center, options.zoom, options.mapStyle, options.viewMode]);

  return {
    map: mapRef.current,
    isLoaded,
    error,
  };
}

// 全局类型扩展 (供 TypeScript 识别)
declare global {
  interface Window {
    _AMapSecurityConfig?: {
      securityJsCode: string;
    };
  }
}
