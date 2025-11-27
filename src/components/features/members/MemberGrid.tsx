/**
 * components/features/members/MemberGrid.tsx - 成员网格布局
 *
 * 核心功能:
 * - 响应式网格布局 (移动端单列，大屏三列)
 * - 批量渲染成员卡片
 *
 * 架构设计:
 * - Server Component (纯展示组件)
 * - 首屏前 3 个卡片标记 priority (LCP 优化)
 *
 * 作者: Alden | 创建: 2025-11-26
 * 规范: docs/01_tds.md, docs/01_urs.md
 */

import { MemberCard } from "./MemberCard";
import { JoinCard } from "./JoinCard";
import type { MemberProfile } from "@/types";

interface MemberGridProps {
  profiles: MemberProfile[];
}

export function MemberGrid({ profiles }: MemberGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {profiles.length > 0 ? (
        profiles.map((profile, index) => (
          <MemberCard
            key={profile.github}
            profile={profile}
            priority={index < 3} // 首屏前 3 个卡片优化 LCP
          />
        ))
      ) : (
        <div className="col-span-full flex items-center justify-center py-12">
          <p className="text-text-secondary">No members found. Be the first!</p>
        </div>
      )}

      {/* 总是显示引导添加卡片 */}
      <JoinCard />
    </div>
  );
}
