"use client";

import { useEffect, useState } from "react";

export function GridBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 生成确定的随机点位置（为了避免每次渲染位置跳动，这里在组件外定义或者使用 useMemo，但在 SSR 场景下最简单的是只在 mounted 后渲染）
  // 这里简化处理，每次刷新页面随机一次即可

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none select-none">
      {/* 1. Base Grid (Breathing) */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-[0.1] animate-grid-breath"
        style={{
          maskImage:
            "linear-gradient(to_bottom, transparent 5%, black 40%, black 70%, transparent 95%)",
          WebkitMaskImage:
            "linear-gradient(to_bottom, transparent 5%, black 40%, black 70%, transparent 95%)",
        }}
      />

      {/* 2. Highlight Grid (Mouse Follow) */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-30 transition-opacity duration-500"
        style={{
          maskImage: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
        }}
      />

      {/* 3. Random Breathing Dots (Circuit Simulation) */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => {
            // 简单的随机位置生成
            const left = Math.floor(Math.random() * 100);
            const top = Math.floor(Math.random() * 100);
            const delay = Math.random() * 5;
            const duration = Math.random() * 3 + 3;

            return (
              <div
                key={i}
                className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.8)] animate-pulse"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  opacity: 0.4,
                }}
              />
            );
          })}
        </div>
      )}

      {/* 4. Film Grain Overlay - 放在最上层 */}
      <div className="fixed inset-0 z-50 opacity-[0.04] bg-noise-pattern mix-blend-overlay pointer-events-none"></div>
    </div>
  );
}
