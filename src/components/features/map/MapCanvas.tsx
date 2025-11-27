"use client";

import { useEffect, useRef } from "react";
import { useAMap } from "@/hooks/use-amap";
import type { MapMarker, MapCoordinate, AMapMarker, AMapClickEvent } from "@/types/map";

const TIANJIN_CENTER: [number, number] = [117.200983, 39.084158];

interface MapCanvasProps {
  markers: MapMarker[];
  selectedMarkerId: number | null;
  onMarkerSelect: (id: number) => void;
  tempMarker: MapCoordinate | null;
  onMapClick: (coord: MapCoordinate) => void;
}

export function MapCanvas({
  markers,
  selectedMarkerId,
  onMarkerSelect,
  tempMarker,
  onMapClick,
}: MapCanvasProps) {
  const containerId = "map-container";
  const { map, isLoaded } = useAMap(containerId, {
    center: TIANJIN_CENTER,
    zoom: 13,
    viewMode: "3D",
  });

  // 存储 marker 实例以便清理
  const markersRef = useRef<AMapMarker[]>([]);
  const tempMarkerRef = useRef<AMapMarker | null>(null);

  // 渲染标记点
  useEffect(() => {
    if (
      !map ||
      !isLoaded ||
      typeof map.add !== "function" ||
      typeof window === "undefined" ||
      !window.AMap
    ) {
      return;
    }

    const AMap = window.AMap;

    // 清除现有标记
    map.remove(markersRef.current);
    markersRef.current = [];

    // 批量添加标记
    const newMarkers = markers.map((marker) => {
      // 自定义标记样式 (Vercel 风格: 极简黑白)
      const content = document.createElement("div");
      const isSelected = marker.id === selectedMarkerId;

      content.className = `
        w-3 h-3 rounded-full border-2 transition-all duration-300
        ${
          isSelected
            ? "bg-white border-black scale-150 shadow-[0_0_0_4px_rgba(255,255,255,0.2)]"
            : "bg-black border-white shadow-[0_0_0_1px_rgba(0,0,0,0.2)] hover:scale-125"
        }
      `;

      const markerInstance = new AMap.Marker({
        position: [marker.lng, marker.lat],
        content: content,
        offset: new AMap.Pixel(-6, -6), // 中心对齐
        extData: { id: marker.id },
        cursor: "pointer",
      });

      // 点击事件
      markerInstance.on("click", () => {
        onMarkerSelect(marker.id);
      });

      return markerInstance;
    });

    map.add(newMarkers);
    markersRef.current = newMarkers;

    // 如果有选中的标记，平滑移动到该位置
    if (selectedMarkerId) {
      const selected = markers.find((m) => m.id === selectedMarkerId);
      if (selected) {
        map.setZoomAndCenter(16, [selected.lng, selected.lat]);
      }
    }
  }, [map, isLoaded, markers, selectedMarkerId, onMarkerSelect]);

  // 渲染临时标记 (用户点击地图生成)
  useEffect(() => {
    if (!map || !isLoaded || !window.AMap) return;
    const AMap = window.AMap;

    // 清理旧的临时标记
    if (tempMarkerRef.current) {
      map.remove(tempMarkerRef.current);
      tempMarkerRef.current = null;
    }

    if (tempMarker) {
      const content = document.createElement("div");
      content.className =
        "w-3 h-3 bg-blue-500 border-2 border-white rounded-full animate-pulse shadow-[0_0_0_4px_rgba(59,130,246,0.3)]";

      const marker = new AMap.Marker({
        position: [tempMarker.lng, tempMarker.lat],
        content: content,
        offset: new AMap.Pixel(-6, -6),
        zIndex: 100, // 确保在最上层
      });

      map.add(marker);
      tempMarkerRef.current = marker;
      map.setCenter([tempMarker.lng, tempMarker.lat]);
    }
  }, [map, isLoaded, tempMarker]);

  // 绑定地图点击事件
  useEffect(() => {
    if (!map || !isLoaded) return;

    const handleClick = (e: AMapClickEvent) => {
      onMapClick({
        lat: e.lnglat.getLat(),
        lng: e.lnglat.getLng(),
      });
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [map, isLoaded, onMapClick]);

  return <div id={containerId} className="h-full w-full" />;
}
