/**
 * app/global-error.tsx - 全局根错误边界
 * 
 * 核心功能:
 * - 捕获 Root Layout 级别的错误
 * - 最后的错误兜底
 * 
 * 架构设计:
 * - Client Component
 * - 必须定义自己的 <html> 和 <body> 标签
 * 
 * 触发场景:
 * - Root Layout 错误
 * - error.tsx 无法捕获的错误
 * 
 * 作者: ZHWA | 创建: 2025-11-26
 * 规范: docs/01_tds.md
 */

"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[Global Error Boundary]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-text-primary antialiased">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-2">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-500">
                <svg
                  className="h-10 w-10 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                Critical Error
              </h2>
              <p className="max-w-[500px] text-gray-400">
                A critical error occurred. Please refresh the page or contact support if the problem persists.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={reset}
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="rounded-md border border-gray-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-gray-500"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

