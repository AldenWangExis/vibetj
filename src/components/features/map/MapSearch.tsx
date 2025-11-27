"use client";

import { useState, useEffect } from "react";
import type { KeyboardEvent } from "react";
import type { SearchResult, MapCoordinate } from "@/types/map";

interface MapSearchProps {
  onSelect: (coord: MapCoordinate) => void;
}

export function MapSearch({ onSelect }: MapSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null);

  // 简单的防抖逻辑
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 1) {
        handleSearch(query, "debounce");
      } else {
        setResults([]);
        setEmptyMessage(null);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSearch = (keyword: string, mode: "enter" | "debounce") => {
    if (typeof window === "undefined" || !window.AMap) return;

    setIsSearching(true);
    setEmptyMessage(null);
    const AMap = window.AMap;

    AMap.plugin(["AMap.PlaceSearch"], () => {
      if (!AMap.PlaceSearch) return;

      const placeSearch = new AMap.PlaceSearch({
        city: "天津", // 默认搜索天津
        citylimit: false, // 支持跨城市搜索
      });

      placeSearch.search(keyword, (status: string, result: unknown) => {
        setIsSearching(false);
        const pois = extractPois(result);

        if (status === "complete" && pois.length > 0) {
          if (mode === "enter") {
            const first = pois[0];
            onSelect(first.location);
            setQuery(first.name);
          }
          setEmptyMessage(null);
          setResults(pois);
        } else {
          setEmptyMessage("未找到匹配地点，请尝试其它关键词。");
          setResults([]);
        }
      });
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const value = query.trim();
      if (value.length > 1) {
        handleSearch(value, "enter");
      }
    }
  };

  function extractPois(result: unknown): SearchResult[] {
    if (typeof result !== "object" || result === null) {
      return [];
    }
    const typedResult = result as {
      info?: string;
      poiList?: {
        pois?: Array<{
          id: string;
          name: string;
          address: string;
          location: { lat: number; lng: number };
          adcode: string;
          cityname: string;
        }>;
      };
    };

    if (typedResult.info !== "OK" || !typedResult.poiList?.pois) {
      return [];
    }

    return typedResult.poiList.pois.map((poi) => ({
      id: poi.id,
      name: poi.name,
      address: poi.address,
      location: {
        lat: poi.location.lat,
        lng: poi.location.lng,
      },
      adcode: poi.adcode,
      cityname: poi.cityname,
    }));
  }

  return (
    <div className="p-4 border-b border-border bg-surface z-10">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search location..."
          className="w-full bg-background border border-border rounded pl-9 pr-4 py-2 text-text-primary focus:border-white focus:outline-none transition-colors"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* 搜索结果下拉 */}
      {results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 mx-4 bg-surface border border-border rounded shadow-xl max-h-60 overflow-y-auto z-50">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => {
                onSelect(result.location);
                setResults([]);
                setQuery("");
              }}
              className="w-full text-left px-4 py-3 hover:bg-border/20 transition-colors border-b border-border last:border-0"
            >
              <div className="text-sm font-medium text-text-primary">{result.name}</div>
              <div className="text-xs text-text-secondary truncate">{result.address}</div>
            </button>
          ))}
        </div>
      )}

      {/* 空态提示 */}
      {emptyMessage && <p className="mt-2 text-xs text-text-muted px-4">{emptyMessage}</p>}
    </div>
  );
}
