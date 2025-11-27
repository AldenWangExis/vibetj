"use client";

import type { MapMarker, MapCoordinate } from "@/types/map";
import { MapSearch } from "./MapSearch";
import { LocationList } from "./LocationList";
import { SaveLocationForm } from "./SaveLocationForm";

interface MapSidebarProps {
  markers: MapMarker[];
  selectedMarkerId: number | null;
  onMarkerSelect: (id: number) => void;
  isSearching: boolean;
  setIsSearching: (v: boolean) => void;
  tempMarker: MapCoordinate | null;
  setTempMarker: (coord: MapCoordinate | null) => void;
}

export function MapSidebar({
  markers,
  selectedMarkerId,
  onMarkerSelect,
  // isSearching, // 目前在组件内部处理
  // setIsSearching,
  tempMarker,
  setTempMarker,
}: MapSidebarProps) {
  const handleSearchSelect = (coord: MapCoordinate) => {
    // 搜索选中后，设置为临时标记，进入保存模式
    setTempMarker(coord);
  };

  return (
    <aside className="w-80 h-full bg-background border-r border-border flex flex-col z-10">
      {/* 标题栏 */}
      <div className="h-14 px-4 flex items-center border-b border-border shrink-0">
        <h1 className="font-medium text-text-primary">Map Lab</h1>
        <span className="ml-auto text-xs text-text-muted bg-surface border border-border px-2 py-0.5 rounded">
          {markers.length} LOCATIONS
        </span>
      </div>

      {tempMarker ? (
        // 保存模式
        <div className="p-4">
          <SaveLocationForm
            location={tempMarker}
            onCancel={() => setTempMarker(null)}
            onSuccess={() => setTempMarker(null)}
          />
        </div>
      ) : (
        // 列表模式
        <>
          <MapSearch onSelect={handleSearchSelect} />
          <LocationList
            markers={markers}
            selectedMarkerId={selectedMarkerId}
            onMarkerSelect={onMarkerSelect}
          />
        </>
      )}
    </aside>
  );
}
