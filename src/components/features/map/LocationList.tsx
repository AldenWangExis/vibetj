"use client";

import type { MapMarker } from "@/types/map";
import { format } from "date-fns";

interface LocationListProps {
  markers: MapMarker[];
  selectedMarkerId: number | null;
  onMarkerSelect: (id: number) => void;
}

export function LocationList({ markers, selectedMarkerId, onMarkerSelect }: LocationListProps) {
  if (markers.length === 0) {
    return (
      <div className="p-8 text-center text-text-muted">
        <p>No locations added yet.</p>
        <p className="text-sm mt-2">Click on the map to add one.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="divide-y divide-border">
        {markers.map((marker) => {
          const isSelected = marker.id === selectedMarkerId;

          return (
            <button
              key={marker.id}
              onClick={() => onMarkerSelect(marker.id)}
              className={`
                w-full text-left p-4 hover:bg-surface transition-colors group
                ${isSelected ? "bg-surface border-l-2 border-white" : "border-l-2 border-transparent"}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <h3
                  className={`font-medium truncate pr-4 ${isSelected ? "text-white" : "text-text-primary"}`}
                >
                  {marker.name}
                </h3>
                {marker.createdAt && (
                  <span className="text-xs text-text-muted shrink-0">
                    {format(new Date(marker.createdAt), "MMM d")}
                  </span>
                )}
              </div>

              {marker.address && (
                <p className="text-sm text-text-secondary truncate mb-1">{marker.address}</p>
              )}

              {marker.description && (
                <p className="text-xs text-text-muted line-clamp-2 group-hover:text-text-secondary transition-colors">
                  {marker.description}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
