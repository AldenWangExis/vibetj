/**
 * app/members/loading.tsx - 成员列表页加载状态
 * 
 * 核心功能:
 * - 提供骨架屏，优化 TTFB
 * 
 * 架构设计:
 * - 自动被 Next.js 使用作为 Suspense fallback
 * 
 * 作者: ZHWA | 创建: 2024-11-26
 * 规范: docs/01_tds.md
 */

export default function MembersLoading() {
  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8">
      {/* 页面标题骨架 */}
      <div className="mb-8 space-y-2">
        <div className="h-9 w-48 animate-pulse rounded bg-surface" />
        <div className="h-5 w-64 animate-pulse rounded bg-surface" />
      </div>

      {/* 成员列表骨架 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[180px] animate-pulse rounded-lg border border-border bg-surface"
          />
        ))}
      </div>
    </div>
  );
}

