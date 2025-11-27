/**
 * types/map.ts - 地图功能类型定义
 *
 * 核心导出:
 * - MapMarker: 数据库查询返回的标记对象
 * - NewMapMarker: 创建标记时的输入数据
 * - MapCoordinate: 坐标点类型
 * - SearchResult: 高德搜索结果类型
 *
 * 架构设计:
 * - 使用 Drizzle ORM 的类型推导
 * - 避免手动维护类型与 Schema 的同步
 *
 * 作者: Alden | 创建: 2025-11-27
 * 规范: docs/02_fds.md, docs/02_tds.md
 */

import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { mapMarkers } from "@/lib/db/schema";

/**
 * 地图标记 (完整数据模型)
 *
 * 从数据库查询返回的完整对象
 */
export type MapMarker = InferSelectModel<typeof mapMarkers>;

/**
 * 新建地图标记 (输入数据模型)
 *
 * 用于 Server Action 或 API 创建标记
 */
export type NewMapMarker = InferInsertModel<typeof mapMarkers>;

/**
 * 坐标点 (GCJ-02 坐标系)
 *
 * 高德地图使用的火星坐标系
 */
export interface MapCoordinate {
  lat: number; // 纬度
  lng: number; // 经度
}

/**
 * 高德地图搜索结果 (简化版)
 *
 * 来自 AMap.PlaceSearch 插件
 */
export interface SearchResult {
  id: string; // POI ID
  name: string; // 地点名称
  address: string; // 详细地址
  location: {
    lat: number;
    lng: number;
  };
  adcode: string; // 行政区划代码
  cityname: string; // 城市名称
}

/**
 * 地图交互状态
 *
 * 用于客户端组件状态管理
 */
export interface MapState {
  selectedMarkerId: number | null; // 当前选中的标记 ID
  isSearching: boolean; // 是否正在搜索
  tempMarker: MapCoordinate | null; // 临时标记坐标 (未保存)
}

/**
 * 高德地图 API 类型定义 (简化版)
 *
 * 仅定义项目中使用到的接口，避免引入完整的 @amap/amap-jsapi-types
 */
export interface AMapMarker {
  on: (event: string, handler: () => void) => void;
  off: (event: string, handler: () => void) => void;
  setPosition: (position: [number, number]) => void;
  getPosition: () => { getLng: () => number; getLat: () => number };
}

export interface AMapClickEvent {
  lnglat: {
    getLat: () => number;
    getLng: () => number;
  };
}

export interface AMapInstance {
  add: (markers: AMapMarker | AMapMarker[]) => void;
  remove: (markers: AMapMarker | AMapMarker[]) => void;
  setCenter: (position: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setZoomAndCenter: (zoom: number, position: [number, number]) => void;
  setMapStyle: (style: string) => void;
  destroy: () => void;
  on: (event: string, handler: (e: AMapClickEvent) => void) => void;
  off: (event: string, handler: (e: AMapClickEvent) => void) => void;
}

export interface AMapConstructor {
  Map: new (containerId: string, options: Record<string, unknown>) => AMapInstance;
  Marker: new (options: Record<string, unknown>) => AMapMarker;
  Pixel: new (x: number, y: number) => unknown;
  plugin: (plugins: string[], callback: () => void) => void;
  PlaceSearch?: new (options: Record<string, unknown>) => {
    search: (keyword: string, callback: (status: string, result: unknown) => void) => void;
  };
}

declare global {
  interface Window {
    AMap?: AMapConstructor;
  }
}
