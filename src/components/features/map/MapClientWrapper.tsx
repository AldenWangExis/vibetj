"use client";

import { useState } from "react";
import type { MapMarker, MapCoordinate } from "@/types/map";
import { MapCanvas } from "./MapCanvas";
import { MapSidebar } from "./MapSidebar";

interface MapClientWrapperProps {
  initialMarkers: MapMarker[];
}

export function MapClientWrapper({ initialMarkers }: MapClientWrapperProps) {
  // 状态管理
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  const [tempMarker, setTempMarker] = useState<MapCoordinate | null>(null);
  const [shouldFocusTemp, setShouldFocusTemp] = useState(false);

  // 处理标记点击
  const handleMarkerSelect = (id: number) => {
    setSelectedMarkerId(id);
  };

  // 搜索结果命中
  const handleSearchSelect = (coord: MapCoordinate) => {
    setTempMarker(coord);
    setSelectedMarkerId(null);
    setShouldFocusTemp(true);
  };

  const clearTempMarker = () => {
    setTempMarker(null);
    setShouldFocusTemp(false);
  };

  // 处理地图点击 (用于添加新点)
  const handleMapClick = (coord: MapCoordinate) => {
    setTempMarker(coord);
    setSelectedMarkerId(null); // 取消选中现有标记
    setShouldFocusTemp(false);
  };

  return (
    <main className="flex h-full w-full relative">
      {/* 左侧侧边栏 */}
      <MapSidebar
        markers={initialMarkers}
        selectedMarkerId={selectedMarkerId}
        onMarkerSelect={handleMarkerSelect}
        tempMarker={tempMarker}
        onSearchSelect={handleSearchSelect}
        onTempClear={clearTempMarker}
      />

      {/* 地图画布 */}
      <div className="flex-1 relative bg-[#050505]">
        <MapCanvas
          markers={initialMarkers}
          selectedMarkerId={selectedMarkerId}
          onMarkerSelect={handleMarkerSelect}
          tempMarker={tempMarker}
          shouldFocusTemp={shouldFocusTemp}
          onTempFocusHandled={() => setShouldFocusTemp(false)}
          onMapClick={handleMapClick}
        />
      </div>
    </main>
  );
}
