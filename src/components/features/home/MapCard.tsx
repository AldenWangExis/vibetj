import { SpotlightCard } from "@/components/ui/SpotlightCard";

export function MapCard() {
  return (
    <SpotlightCard className="h-full relative p-0 overflow-hidden group cursor-pointer min-h-[240px]">
      {/* Background: Abstract Dark Map Texture */}
      <div className="absolute inset-0 bg-[#050505]">
        {/* Grid Lines representing streets */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#444_1px,transparent_1px),linear-gradient(to_bottom,#444_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      {/* Radar Effect - Centered */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Spinning Sweep */}
          <div className="absolute inset-0 rounded-full animate-radar-spin border-r border-t border-transparent from-accent-green/20 to-transparent bg-gradient-to-tr opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

          {/* Ping Rings */}
          <div className="absolute w-full h-full rounded-full border border-accent-green/10 animate-pulse-slow"></div>
          <div className="absolute w-2/3 h-2/3 rounded-full border border-accent-green/10 animate-pulse-slow delay-75"></div>

          {/* Center Point */}
          <div className="relative h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-green shadow-[0_0_15px_#00FF94]"></span>
          </div>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 pointer-events-none">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted font-mono uppercase tracking-wider">
            Vibe Map
          </span>
          <span className="text-xs text-accent-green font-mono border border-accent-green/20 px-2 py-1 rounded bg-accent-green/5 backdrop-blur-sm">
            Online
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-lg text-text-primary font-mono tracking-tight">Tianjin</span>
          <span className="text-xs text-text-code font-mono mt-1">39°08′N 117°12′E</span>
        </div>
      </div>
    </SpotlightCard>
  );
}
