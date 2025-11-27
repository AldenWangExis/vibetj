/**
 * app/page.tsx - 主页 (Home Page)
 *
 * 核心功能:
 * - 展示 VibeTJ 的品牌介绍和核心理念
 *
 * 架构设计:
 * - Server Component (静态内容)
 * - 采用 Vercel/Geist 风格：Grid 背景、渐变文字、独立卡片布局
 *
 * 作者: Alden | 创建: 2025-11-26 | 修改: 2025-11-27
 * 规范: docs/01_tds.md, docs/01_urs.md
 */

import { Github, Users, Terminal, Cpu, GitGraph } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* 
        背景层级设计:
        1. 纯黑底色 (由 globals.css body 提供)
        2. 全局 Grid (由 layout.tsx 提供)
        3. 径向渐变遮罩 (让网格只在中间显现，营造聚光灯效果)
      */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Grid 已移至 layout.tsx */}
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-white opacity-5 blur-[100px]"></div>
      </div>

      <main className="container relative z-10 mx-auto max-w-screen-xl px-4 py-20 sm:py-32">
        <div className="flex flex-col items-center space-y-12 text-center">
          {/* Hero Section */}
          <div className="space-y-6">
            {/* 胶囊标签 - 可选，增加层级感 */}
            <div className="inline-flex items-center rounded-full border border-border-subtle bg-surface/50 px-3 py-1 text-xs font-medium text-text-secondary backdrop-blur-sm transition-colors hover:border-text-secondary/50">
              <span className="mr-2 flex h-2 w-2">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-blue"></span>
              </span>
              v1.0.0 Now Available
            </div>

            <h1 className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 sm:text-6xl md:text-7xl lg:text-8xl">
              VibeTJ
            </h1>

            <p className="mx-auto max-w-[600px] text-lg text-text-secondary md:text-xl font-light leading-relaxed">
              Industrial Minimalism Showcase
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href="/members"
              className="group flex items-center justify-center gap-2 h-10 rounded-md bg-white px-8 text-sm font-medium text-black transition-all hover:bg-gray-200"
            >
              <Users className="h-4 w-4" />
              <span>查看成员</span>
            </a>
            <a
              href="https://github.com/AldenWangExis/vibetj"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 h-10 rounded-md border border-border bg-black px-8 text-sm font-medium text-text-secondary transition-all hover:text-white hover:border-gray-500"
            >
              <Github className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              <span>GitHub 仓库</span>
            </a>
          </div>

          {/* 核心理念 - Grid Cards Layout */}
          <div className="grid w-full grid-cols-1 gap-6 pt-12 md:grid-cols-3 text-left">
            {/* Card 1: GitOps */}
            <div className="group relative overflow-hidden rounded-lg border border-border bg-surface/50 p-6 transition-all duration-300 hover:border-border-hover hover:bg-surface">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-black text-text-secondary group-hover:text-white group-hover:border-gray-700">
                <GitGraph className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-text-primary">GitOps 驱动</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                通过代码仓库管理成员列表，移除对传统数据库的依赖。一切皆为版本控制。
              </p>
            </div>

            {/* Card 2: Design */}
            <div className="group relative overflow-hidden rounded-lg border border-border bg-surface/50 p-6 transition-all duration-300 hover:border-border-hover hover:bg-surface">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-black text-text-secondary group-hover:text-white group-hover:border-gray-700">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-text-primary">工业极简主义</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                严格遵循 Vercel / Geist Design System。追求精密、数学化的设计与极致的留白。
              </p>
            </div>

            {/* Card 3: Performance */}
            <div className="group relative overflow-hidden rounded-lg border border-border bg-surface/50 p-6 transition-all duration-300 hover:border-border-hover hover:bg-surface">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-black text-text-secondary group-hover:text-white group-hover:border-gray-700">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-text-primary">高性能优先</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                基于 Next.js 15 + React Server Components。实现极致的 TTFB 和 SEO 优化。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
