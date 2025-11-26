/**
 * app/not-found.tsx - 404 错误页面
 *
 * 核心功能:
 * - 处理 404 Not Found 错误
 * - 提供友好的错误提示和导航
 *
 * 架构设计:
 * - Server Component (静态内容)
 * - 遵循 Vercel 工业极简主义风格
 *
 * 触发场景:
 * - 访问不存在的路由
 * - 调用 notFound() 函数
 *
 * 作者: ZHWA | 创建: 2025-11-26
 * 规范: docs/01_tds.md, docs/01_urs.md
 */

import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl items-center justify-center px-4">
      <div className="flex flex-col items-center space-y-8 text-center">
        {/* 错误代码 */}
        <div className="space-y-2">
          <h1 className="font-mono text-6xl font-bold tracking-tight text-text-primary sm:text-7xl md:text-8xl">
            404
          </h1>
          <div className="h-px w-24 bg-border mx-auto" />
        </div>

        {/* 错误信息 */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
            Page Not Found
          </h2>
          <p className="max-w-[500px] text-text-secondary">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        {/* 导航选项 */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="rounded-md bg-text-primary px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-text-primary/90"
          >
            Back to Home
          </Link>
          <Link
            href="/members"
            className="rounded-md border border-border px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-border-hover"
          >
            View Members
          </Link>
        </div>

        {/* 快速导航 */}
        <div className="pt-8">
          <p className="mb-4 text-sm text-text-secondary">Quick Links</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-text-secondary transition-colors hover:text-text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
