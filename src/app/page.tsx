/**
 * app/page.tsx - 主页 (Home Page)
 * 
 * 核心功能:
 * - 展示 VibeTJ 的品牌介绍和核心理念
 * 
 * 架构设计:
 * - Server Component (静态内容)
 * 
 * 作者: ZHWA | 创建: 2024-11-26
 * 规范: docs/01_tds.md, docs/01_urs.md
 */

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        {/* 品牌标题 */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl">
            VibeTJ
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-text-secondary">
            Industrial Minimalism Showcase
          </p>
        </div>

        {/* 核心理念 */}
        <div className="mx-auto max-w-[800px] space-y-4 rounded-lg border border-border bg-surface p-8">
          <h2 className="text-2xl font-semibold text-text-primary">
            核心理念
          </h2>
          <div className="space-y-3 text-left text-text-secondary">
            <p>
              <span className="font-semibold text-text-primary">GitOps 驱动:</span> 通过代码仓库管理成员列表，移除对传统数据库的依赖。
            </p>
            <p>
              <span className="font-semibold text-text-primary">工业极简主义:</span> 严格遵循 Vercel / Geist Design System 风格，追求精密的、数学化的设计。
            </p>
            <p>
              <span className="font-semibold text-text-primary">高性能优先:</span> 基于 Next.js 15 + React Server Components，实现极致的加载速度和 SEO 优化。
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-4">
          <a
            href="/members"
            className="rounded-md bg-text-primary px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-text-primary/90"
          >
            查看成员
          </a>
          <a
            href="https://github.com/AldenWangExis/vibetj"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-border-hover"
          >
            GitHub 仓库
          </a>
        </div>
      </div>
    </div>
  );
}
