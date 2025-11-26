/**
 * components/layout/Navbar.tsx - 全局导航栏
 *
 * 核心功能:
 * - 固定在页面顶部 (Sticky Top)
 * - 背景模糊效果 (Backdrop Blur)
 * - 路由高亮状态 (Active Tab)
 *
 * 架构设计:
 * - Client Component (使用 usePathname)
 * - 叶子节点边界: 通过 children prop 接收 Server Component
 *
 * 样式逻辑:
 * - Active Tab: text-foreground (白)
 * - Inactive Tab: text-foreground/60 transition-colors hover:text-foreground/80 (灰变白)
 *
 * 作者: ZHWA | 创建: 2024-11-26
 * 规范: docs/01_tds.md, docs/01_urs.md
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4">
        {/* Logo */}
        <div className="mr-8 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold tracking-tight text-text-primary">{siteConfig.name}</span>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-6 text-sm">
          {siteConfig.nav.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-text-primary/80",
                  isActive ? "text-text-primary" : "text-text-primary/60"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
