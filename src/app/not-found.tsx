/**
 * app/not-found.tsx - 404 错误页面
 *
 * 核心功能:
 * - 处理 404 Not Found 错误
 * - 赛博终端风格
 *
 * 作者: Alden | 创建: 2025-11-26 | 修改: 2025-11-27
 * 规范: docs/03_tds.md
 */

import Link from "next/link";

export const metadata = {
  title: "404 - Signal Lost",
  description: "The requested signal could not be found.",
};

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="w-full max-w-md border border-border bg-surface p-8 md:p-12 relative overflow-hidden">
        {/* Top Decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-accent-red"></div>

        <div className="space-y-8 text-center relative z-10">
          <div className="space-y-2">
            <h1 className="font-mono text-6xl font-bold tracking-tighter text-white glitch-text">
              404
            </h1>
            <p className="font-mono text-xs text-accent-red uppercase tracking-widest">
              Signal Lost / Route Unknown
            </p>
          </div>

          <div className="font-mono text-xs text-text-secondary text-left border border-border/50 p-4 bg-black/50">
            <p>{`> initiating_recovery_protocol...`}</p>
            <p>{`> scanning_sector...`}</p>
            <p className="text-accent-red">{`> ERROR: target_coordinates_invalid`}</p>
            <p>{`> suggesting_alternative_path...`}</p>
            <span className="inline-block w-2 h-4 bg-accent-red animate-pulse align-middle ml-1"></span>
          </div>

          <Link
            href="/"
            className="inline-flex h-10 w-full items-center justify-center border border-text-primary bg-text-primary px-6 text-sm font-bold text-background transition-all hover:bg-transparent hover:text-text-primary"
          >
            Return to Base
          </Link>
        </div>

        {/* Background Scanline */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20"></div>
      </div>
    </div>
  );
}
