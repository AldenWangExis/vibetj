/**
 * app/error.tsx - 全局错误边界
 *
 * 核心功能:
 * - 捕获运行时错误
 * - BSOD / Kernel Panic 风格
 *
 * 作者: Alden | 创建: 2025-11-26 | 修改: 2025-11-27
 * 规范: docs/03_tds.md
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[System Failure]", error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-64px)] items-center justify-center px-4 font-mono">
      <div className="w-full max-w-2xl bg-accent-red/10 border border-accent-red p-8 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.svg')] opacity-5 pointer-events-none"></div>

        <div className="space-y-6 text-left">
          <div className="border-b border-accent-red/30 pb-4">
            <h2 className="text-accent-red font-bold text-xl uppercase tracking-widest animate-pulse">
              Critical System Failure
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Code: 0x
              {Math.floor(Math.random() * 1000000)
                .toString(16)
                .toUpperCase()}
            </p>
          </div>

          <div className="space-y-4 text-sm text-text-secondary">
            <p>
              A fatal exception has occurred at {new Date().toISOString()}. The current process has
              been terminated to prevent system corruption.
            </p>

            <div className="bg-black/50 p-4 border border-accent-red/20 text-xs text-accent-red/80 font-mono overflow-auto max-h-[200px]">
              {`> ${error.name}: ${error.message}`}
              {error.digest && `\n> Digest: ${error.digest}`}
              {process.env.NODE_ENV === "development" && error.stack && `\n\n${error.stack}`}
            </div>

            <p>Press any key to continue or choose an action below:</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={reset}
              className="h-10 px-6 border border-accent-red text-accent-red hover:bg-accent-red hover:text-white transition-colors text-xs uppercase tracking-wider font-bold"
            >
              Retry Process
            </button>
            <Link
              href="/"
              className="h-10 px-6 border border-text-secondary text-text-secondary hover:border-white hover:text-white transition-colors text-xs uppercase tracking-wider font-bold flex items-center justify-center"
            >
              System Reboot
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
