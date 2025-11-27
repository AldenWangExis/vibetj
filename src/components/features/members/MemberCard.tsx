/**
 * components/features/members/MemberCard.tsx - 成员卡片组件
 *
 * 核心功能:
 * - 展示成员头像、昵称、GitHub Handle、自定义签名
 * - 点击卡片跳转至成员的 GitHub 主页
 * - 使用 SpotlightCard 实现聚光灯效果
 *
 * 样式特征:
 * - 工业极简风格: 黑白配色，Hover 变色
 * - 数据化展示: 强调 Handle 和 Bio
 *
 * 作者: Alden | 创建: 2025-11-26 | 修改: 2025-11-27
 * 规范: docs/03_tds.md
 */

import Image from "next/image";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import type { MemberProfile } from "@/types";

interface MemberCardProps {
  profile: MemberProfile;
  priority?: boolean; // LCP 优化标记
}

export function MemberCard({ profile, priority = false }: MemberCardProps) {
  return (
    <a
      href={profile.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full"
    >
      <SpotlightCard className="h-full bg-surface p-6 transition-all duration-300 hover:border-border-hover flex flex-col gap-4">
        <div className="flex items-start justify-between">
          {/* 头像 - 视觉设计: System Tint (赛博青滤镜) 
              默认状态: 单色青、低亮度、高对比，模拟 HUD/全息投影的休眠状态
              Hover状态: 全彩恢复
          */}
          <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border transition-transform duration-300 group-hover:scale-105 group-hover:border-accent-green/50">
            <Image
              src={profile.avatarUrl}
              alt={profile.displayName}
              fill
              className="object-cover transition-all duration-500
                filter grayscale sepia hue-rotate-[170deg] brightness-75 contrast-[1.2] opacity-80
                group-hover:filter-none group-hover:opacity-100"
              sizes="64px"
              priority={priority}
            />
          </div>

          {/* Git Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider opacity-0 transition-opacity group-hover:opacity-100">
              Contributor
            </span>
            <div className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-border group-hover:bg-accent-green transition-colors shadow-[0_0_0_0_rgba(0,255,148,0)] group-hover:shadow-[0_0_8px_rgba(0,255,148,0.6)]"></span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-lg text-text-primary tracking-tight group-hover:text-white transition-colors">
            {profile.displayName}
          </h3>
          <p className="text-xs text-text-code font-mono group-hover:text-accent-green transition-colors">
            @{profile.github}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-border/50">
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 font-light group-hover:text-text-primary/90 transition-colors">
            {profile.bio || "No system bio available."}
          </p>
        </div>
      </SpotlightCard>
    </a>
  );
}
