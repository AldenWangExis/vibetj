/**
 * app/lab/page.tsx - 实验室页面 (Lab Page)
 *
 * 核心功能:
 * - 展示系统状态仪表盘
 * - 预留的扩展区域
 *
 * 风格:
 * - 赛博终端 Dashboard
 *
 * 作者: Alden | 创建: 2025-11-26 | 修改: 2025-11-27
 * 规范: docs/03_tds.md
 */

import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { SimpleMarkdown } from "@/components/ui/SimpleMarkdown";
import { siteConfig } from "@/config/site";

export default function LabPage() {
  return (
    <div className="container mx-auto max-w-screen-xl px-6 py-12 sm:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Header Section */}
        <div className="lg:col-span-3 mb-8 border-b border-border/50 pb-6">
          <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">System Lab</h1>
          <p className="text-text-secondary font-mono text-sm">Experimental Runtime Environment</p>
        </div>

        {/* Card 1: System Status */}
        <SpotlightCard className="bg-surface p-6 min-h-[200px] flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <span className="font-mono text-xs text-text-muted uppercase">Core Status</span>
            <span className="font-mono text-xs text-accent-green">ONLINE</span>
          </div>
          <div className="space-y-4 font-mono text-xs text-text-secondary">
            <div className="flex justify-between">
              <span>UPTIME</span>
              <span className="text-white">99.9%</span>
            </div>
            <div className="flex justify-between">
              <span>LATENCY</span>
              <span className="text-white">14ms</span>
            </div>
            <div className="flex justify-between">
              <span>MEMORY</span>
              <span className="text-white">64MB / 256MB</span>
            </div>
            <div className="w-full bg-border h-1 mt-2 rounded-full overflow-hidden">
              <div className="bg-accent-green h-full w-[25%]"></div>
            </div>
          </div>
        </SpotlightCard>

        {/* Card 2: Event Log */}
        <SpotlightCard className="bg-surface p-6 min-h-[200px] lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <span className="font-mono text-xs text-text-muted uppercase">System Logs</span>
            <span className="w-2 h-2 rounded-full bg-accent-amber animate-pulse"></span>
          </div>
          <div className="font-mono text-xs space-y-2 text-text-secondary h-full overflow-hidden">
            <div className="flex gap-4">
              <span className="text-text-muted">[10:42:01]</span>
              <span className="text-accent-blue">INFO</span>
              <span>Initializing VibeTJ core modules...</span>
            </div>
            <div className="flex gap-4">
              <span className="text-text-muted">[10:42:02]</span>
              <span className="text-accent-green">SUCCESS</span>
              <span>Database connection established (Neon).</span>
            </div>
            <div className="flex gap-4">
              <span className="text-text-muted">[10:42:05]</span>
              <span className="text-accent-blue">INFO</span>
              <span>Loading map assets from CDN...</span>
            </div>
            <div className="flex gap-4">
              <span className="text-text-muted">[10:42:08]</span>
              <span className="text-accent-amber">WARN</span>
              <span>High latency detected in region: cn-north-1</span>
            </div>
          </div>
        </SpotlightCard>

        {/* Card 3: Placeholder */}
        <SpotlightCard className="bg-surface p-0 min-h-[300px] lg:col-span-3 relative overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-2 border-border-dashed rounded-full flex items-center justify-center mx-auto animate-spin-slow">
                <div className="w-2 h-2 bg-text-muted rounded-full"></div>
              </div>
              <div className="text-center max-w-md">
                <SimpleMarkdown
                  content={siteConfig.systemStatus.awaitingInput}
                  className="text-xs text-text-muted uppercase tracking-widest"
                />
              </div>
            </div>
          </div>
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>
        </SpotlightCard>
      </div>
    </div>
  );
}
