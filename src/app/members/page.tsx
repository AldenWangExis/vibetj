/**
 * app/members/page.tsx - 成员列表页 (Members Page)
 *
 * 核心功能:
 * - 展示所有成员的卡片列表
 * - 响应式网格布局
 *
 * 架构设计:
 * - Server Component (Controller 层)
 * - ISR 缓存策略: revalidate = 3600 (1小时)
 * - 流式渲染: 使用 Suspense 包裹 MemberGrid
 *
 * 作者: Alden | 创建: 2025-11-26 | 修改: 2025-11-27
 * 规范: docs/03_tds.md
 */

import { Suspense } from "react";
import { Github } from "lucide-react";
import { MEMBERS } from "@/config/members";
import { getAllMemberProfiles } from "@/services/memberService";
import { MemberGrid } from "@/components/features/members/MemberGrid";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { siteConfig } from "@/config/site";

// ISR 缓存策略: 1小时重新验证
export const revalidate = 3600;

async function MembersContent() {
  const profiles = await getAllMemberProfiles(MEMBERS);
  return <MemberGrid profiles={profiles} />;
}

export default function MembersPage() {
  return (
    <div className="container mx-auto max-w-screen-xl px-6 py-12 sm:py-24">
      {/* 页面标题与操作区 */}
      <div className="mb-16 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between border-b border-border/50 pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-accent-green">
            <span className="animate-pulse">●</span>
            <span>SYSTEM::MEMBERS_DIRECTORY</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
            Active Builders
          </h1>

          <div className="h-6">
            <TypewriterText
              text="Distributed intelligence network."
              className="text-text-secondary font-mono text-sm"
              minDelay={20}
            />
          </div>
        </div>

        <a
          href={`${siteConfig.links.github}#how-to-join-vibetj`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex h-12 items-center justify-center rounded-none border border-border bg-background px-6 text-xs font-mono uppercase tracking-wider text-text-secondary transition-all hover:bg-surface hover:text-white hover:border-white/40"
        >
          <Github className="mr-2 h-4 w-4" />
          <span>Initiate Join Protocol</span>
        </a>
      </div>

      {/* 成员列表 - 使用 Suspense 实现流式渲染 */}
      <Suspense fallback={<MembersLoadingSkeleton />}>
        <MembersContent />
      </Suspense>
    </div>
  );
}

// 骨架屏组件 - 适配 SpotlightCard 风格
function MembersLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-[240px] animate-pulse rounded-xl border border-border bg-surface/30"
        />
      ))}
    </div>
  );
}
