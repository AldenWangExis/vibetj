/**
 * components/layout/Footer.tsx - 全局页脚
 *
 * 核心功能:
 * - 展示版权信息
 * - 提供 GitHub 和 个人站链接
 *
 * 样式风格:
 * - Vercel 极简风格
 * - 顶部细边框分隔
 * - 灰色文字，Hover 变亮
 *
 * 作者: ZHWA | 创建: 2025-11-27
 * 规范: docs/01_tds.md
 */

import { Github, Globe } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background py-6 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:h-16 md:flex-row max-w-screen-2xl">
        <p className="text-xs text-text-secondary md:text-sm">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          <a
            href={siteConfig.links.personal}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary md:text-sm"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Alden&apos;s Site</span>
          </a>

          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary md:text-sm"
          >
            <Github className="h-3.5 w-3.5" />
            <span>Source</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
