/**
 * app/error.tsx - 全局错误边界
 *
 * 核心功能:
 * - 捕获运行时错误
 * - 提供错误恢复机制
 *
 * 架构设计:
 * - Client Component (需要使用 useEffect)
 * - 自动包裹所有子路由
 *
 * 触发场景:
 * - 组件渲染错误
 * - 数据获取失败
 * - 未捕获的异常
 *
 * 作者: ZHWA | 创建: 2025-11-26
 * 规范: docs/01_tds.md
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
    // 记录错误到控制台（生产环境应发送到错误监控服务）
    console.error("[Error Boundary]", error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl items-center justify-center px-4">
      <div className="flex flex-col items-center space-y-8 text-center">
        {/* 错误图标 */}
        <div className="space-y-2">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent-red">
            <svg
              className="h-10 w-10 text-accent-red"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="h-px w-24 bg-border mx-auto" />
        </div>

        {/* 错误信息 */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
            Something went wrong
          </h2>
          <p className="max-w-[500px] text-text-secondary">
            An unexpected error occurred. Please try again or return to the home page.
          </p>

          {/* 开发环境显示错误详情 */}
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4 max-w-[600px] rounded-lg border border-border bg-surface p-4 text-left">
              <summary className="cursor-pointer text-sm font-semibold text-text-primary">
                Error Details (Dev Only)
              </summary>
              <pre className="mt-2 overflow-auto text-xs text-text-secondary">{error.message}</pre>
              {error.digest && (
                <p className="mt-2 text-xs text-text-muted">Error ID: {error.digest}</p>
              )}
            </details>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="rounded-md bg-text-primary px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-text-primary/90"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-md border border-border px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-border-hover"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
