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
 * 数据流:
 * 1. 从 config/members.ts 读取静态配置
 * 2. 调用 Service 层获取完整档案
 * 3. 传递给 MemberGrid 渲染
 *
 * 作者: ZHWA | 创建: 2024-11-26 | 修改: 2025-11-27
 * 规范: docs/01_tds.md, docs/01_urs.md
 */

import { Suspense } from "react";
import { Github } from "lucide-react";
import { MEMBERS } from "@/config/members";
import { getAllMemberProfiles } from "@/services/memberService";
import { MemberGrid } from "@/components/features/members/MemberGrid";

// ISR 缓存策略: 1小时重新验证
export const revalidate = 3600;

async function MembersContent() {
  // 调用 Service 层，业务逻辑已封装
  const profiles = await getAllMemberProfiles(MEMBERS);

  return <MemberGrid profiles={profiles} />;
}

export default function MembersPage() {
  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-12 sm:py-20">
      {/* 页面标题与操作区 */}
      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 sm:text-5xl">
            Team Members
          </h1>
          <p className="text-lg text-text-secondary max-w-[500px] font-light">
            Meet the people behind VibeTJ. We are a distributed team of developers, designers, and
            creators.
          </p>
        </div>

        <a
          href="https://github.com/AldenWangExis/vibetj#how-to-join-vibetj"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex h-10 items-center justify-center rounded-md border border-border bg-black px-6 text-sm font-medium text-text-secondary transition-all hover:text-white hover:border-gray-500 hover:bg-surface"
        >
          <Github className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          Join via GitHub
        </a>
      </div>

      {/* 成员列表 - 使用 Suspense 实现流式渲染 */}
      <Suspense fallback={<MembersLoadingSkeleton />}>
        <MembersContent />
      </Suspense>
    </div>
  );
}

// 骨架屏组件
function MembersLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-[180px] animate-pulse rounded-lg border border-border bg-surface/50"
        />
      ))}
    </div>
  );
}
