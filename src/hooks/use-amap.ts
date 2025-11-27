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
import type { AMapInstance } from "@/types/map";

type AMapLoaderAPI = typeof import("@amap/amap-jsapi-loader");
let amapLoaderPromise: Promise<AMapLoaderAPI> | null = null;

async function loadAMapLoader(): Promise<AMapLoaderAPI> {
  if (!amapLoaderPromise) {
    amapLoaderPromise = import("@amap/amap-jsapi-loader").then((module) =>
      module.default ? module.default : module
    );
  }
  return amapLoaderPromise;
}

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

  useEffect(() => {
    let isUnmounted = false;

    async function initMap() {
      if (typeof window === "undefined") {
        return;
      }

      try {
        // 1. 注入安全密钥 (必须在 load 之前)
        if (!window._AMapSecurityConfig) {
          window._AMapSecurityConfig = {
            securityJsCode: process.env.NEXT_PUBLIC_AMAP_SECURITY_CODE || "",
          };
          console.log("[AMap] Security config injected");
        }

        // 2. 加载高德地图 API
        const AMapLoader = await loadAMapLoader();
        const AMap = await AMapLoader.load({
          key: process.env.NEXT_PUBLIC_AMAP_KEY || "",
          version: "2.0",
          plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.PlaceSearch"],
        });

        console.log("[AMap] API loaded successfully");

        // 3. 初始化地图实例
        const mapInstance = new AMap.Map(containerId, {
          center: options.center || [117.200983, 39.084158], // 默认天津市和平区
          zoom: options.zoom || 13,
          viewMode: options.viewMode || "3D",
          mapStyle: options.mapStyle || "amap://styles/dark", // 默认暗色主题
          showLabel: true,
        });

        if (isUnmounted) {
          mapInstance.destroy();
          return;
        }

        window.AMap = window.AMap || AMap;
        mapRef.current = mapInstance;
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
      isUnmounted = true;
      if (mapRef.current) {
        console.log("[AMap] Destroying map instance");
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (options.center) {
      mapRef.current.setCenter(options.center);
    }
    if (options.zoom) {
      mapRef.current.setZoom(options.zoom);
    }
  }, [options.center, options.zoom, options.mapStyle, options.viewMode]);

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
