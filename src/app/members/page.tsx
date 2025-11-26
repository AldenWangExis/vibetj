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
 * 作者: ZHWA | 创建: 2024-11-26
 * 规范: docs/01_tds.md, docs/01_urs.md
 */

import { Suspense } from "react";
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
    <div className="container mx-auto max-w-screen-2xl px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Team Members
        </h1>
        <p className="text-text-secondary">
          Meet the people behind VibeTJ
        </p>
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
          className="h-[180px] animate-pulse rounded-lg border border-border bg-surface"
        />
      ))}
    </div>
  );
}

