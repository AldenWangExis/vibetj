/**
 * app/members/error.tsx - 成员列表页错误边界
 *
 * 核心功能:
 * - 捕获成员列表页的错误
 * - 处理 GitHub API 调用失败
 *
 * 架构设计:
 * - Client Component
 * - 页面级错误边界
 *
 * 触发场景:
 * - GitHub API 限流
 * - 网络错误
 * - 数据解析失败
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

export default function MembersError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[Members Page Error]", error);
  }, [error]);

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        {/* 错误图标 */}
        <div className="space-y-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent-red">
            <svg
              className="h-8 w-8 text-accent-red"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* 错误信息 */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
            Failed to Load Members
          </h2>
          <p className="max-w-[500px] text-text-secondary">
            Unable to fetch member data. This might be due to GitHub API rate limiting or network
            issues.
          </p>
        </div>

        {/* 可能的原因 */}
        <div className="max-w-[600px] rounded-lg border border-border bg-surface p-6 text-left">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">Possible Causes:</h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-text-muted">•</span>
              <span>GitHub API rate limit exceeded (60 requests/hour without token)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-text-muted">•</span>
              <span>Network connection issues</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-text-muted">•</span>
              <span>GITHUB_TOKEN environment variable not configured</span>
            </li>
          </ul>
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

        {/* 开发环境错误详情 */}
        {process.env.NODE_ENV === "development" && (
          <details className="max-w-[600px] rounded-lg border border-border bg-surface p-4 text-left">
            <summary className="cursor-pointer text-sm font-semibold text-text-primary">
              Error Details (Dev Only)
            </summary>
            <pre className="mt-2 overflow-auto text-xs text-text-secondary">{error.message}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
