"use client";

import type { MapMarker, MapCoordinate } from "@/types/map";
import { MapSearch } from "./MapSearch";
import { LocationList } from "./LocationList";
import { SaveLocationForm } from "./SaveLocationForm";

interface MapSidebarProps {
  markers: MapMarker[];
  selectedMarkerId: number | null;
  onMarkerSelect: (id: number) => void;
  tempMarker: MapCoordinate | null;
  onSearchSelect: (coord: MapCoordinate) => void;
  onTempClear: () => void;
}

export function MapSidebar({
  markers,
  selectedMarkerId,
  onMarkerSelect,
  tempMarker,
  onSearchSelect,
  onTempClear,
}: MapSidebarProps) {
  return (
    <aside className="w-80 h-full bg-surface/95 backdrop-blur border-r border-border flex flex-col z-10 font-mono">
      {/* 标题栏 */}
      <div className="h-14 px-4 flex items-center border-b border-border shrink-0 bg-background/50">
        <h1 className="text-sm font-bold tracking-wider text-text-primary uppercase">Map Lab</h1>
        <span className="ml-auto text-[10px] text-accent-green border border-accent-green/30 bg-accent-green/10 px-1.5 py-0.5 rounded-sm">
          {markers.length} LOCS
        </span>
      </div>

      {tempMarker ? (
        // 保存模式
        <div className="p-4">
          <SaveLocationForm location={tempMarker} onCancel={onTempClear} onSuccess={onTempClear} />
        </div>
      ) : (
        // 列表模式
        <>
          <div className="p-4 border-b border-border">
            <MapSearch onSelect={onSearchSelect} />
          </div>
          <div className="flex-1 overflow-y-auto">
            <LocationList
              markers={markers}
              selectedMarkerId={selectedMarkerId}
              onMarkerSelect={onMarkerSelect}
            />
          </div>
        </>
      )}
    </aside>
  );
}
