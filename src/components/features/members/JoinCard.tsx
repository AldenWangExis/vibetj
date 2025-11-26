/**
 * components/features/members/JoinCard.tsx - "加入团队" 引导卡片
 *
 * 核心功能:
 * - 作为一个特殊的卡片展示在成员列表末尾
 * - 引导用户跳转到 GitHub Readme 的 "How to join" 部分
 *
 * 样式特征:
 * - 虚线边框 (Dashed Border) 区分于普通成员卡片
 * - 居中布局，强调行动点
 * - 极简风格 (Vercel Style)
 *
 * 作者: ZHWA | 创建: 2024-11-26
 */

import { Plus, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function JoinCard() {
  return (
    <a
      href="https://github.com/AldenWangExis/vibetj?tab=readme-ov-file#%E5%A6%82%E4%BD%95%E5%8A%A0%E5%85%A5-vibetj"
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full"
    >
      <Card className="flex h-full min-h-[180px] flex-col items-center justify-center border-dashed border-border bg-transparent transition-all duration-200 hover:border-border-hover hover:bg-surface/50">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          {/* Icon Wrapper */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background transition-colors group-hover:border-border-hover group-hover:text-text-primary">
            <Plus className="h-6 w-6 text-text-secondary transition-colors group-hover:text-text-primary" />
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-text-primary">Join the Team</h3>
            <p className="text-sm text-text-secondary">Submit a Pull Request to add yourself</p>
          </div>

          <div className="flex items-center text-xs font-medium text-text-secondary opacity-0 transition-all group-hover:opacity-100">
            View Instructions <ArrowRight className="ml-1 h-3 w-3" />
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
