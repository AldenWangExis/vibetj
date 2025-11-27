/**
 * components/features/members/MemberCard.tsx - 成员卡片组件
 *
 * 核心功能:
 * - 展示成员头像、昵称、GitHub Handle、自定义签名
 * - 点击卡片跳转至成员的 GitHub 主页
 *
 * 架构设计:
 * - Server Component (纯展示组件，无交互逻辑)
 * - 使用 next/image 优化头像加载 (LCP 优化)
 *
 * 样式特征:
 * - Vercel 风格: 边框层级、Hover 高亮
 * - 圆角: rounded-xl (8px)
 * - 交互: Hover 时边框变亮、轻微阴影
 *
 * 作者: ZHWA | 创建: 2024-11-26 | 修改: 2025-11-27
 * 规范: docs/01_tds.md, docs/01_urs.md
 */

import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { MemberProfile } from "@/types";

interface MemberCardProps {
  profile: MemberProfile;
  priority?: boolean; // LCP 优化标记
}

export function MemberCard({ profile, priority = false }: MemberCardProps) {
  return (
    <a href={profile.profileUrl} target="_blank" rel="noopener noreferrer" className="group block">
      <Card className="h-full bg-surface/50 backdrop-blur-sm border-border transition-all duration-300 hover:border-border-hover hover:bg-surface hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            {/* 头像 */}
            <Avatar className="h-14 w-14 border border-border">
              <AvatarImage src={profile.avatarUrl} alt={profile.displayName} asChild>
                <Image
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  width={56}
                  height={56}
                  priority={priority}
                />
              </AvatarImage>
              <AvatarFallback className="bg-background text-text-secondary">
                {profile.displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* 昵称与 Handle */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-text-primary tracking-tight truncate group-hover:text-white transition-colors">
                {profile.displayName}
              </h3>
              <p className="text-xs text-text-secondary font-mono group-hover:text-text-muted transition-colors">
                @{profile.github}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* 自定义签名 */}
          <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed group-hover:text-text-secondary/80 transition-colors">
            {profile.bio || "No bio available"}
          </p>
        </CardContent>
      </Card>
    </a>
  );
}
