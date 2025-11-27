/**
 * app/page.tsx - 主页 (Home Page)
 *
 * 核心功能:
 * - 展示 VibeTJ 的品牌介绍和核心理念
 * - Bento Grid 布局展示核心功能模块 (Map, Builders, System Lab)
 *
 * 架构设计:
 * - Server Component (静态内容)
 * - 采用 Vercel/Geist 风格：Grid 背景、打字机效果、Bento Grid
 *
 * 作者: Alden | 创建: 2025-11-26 | 修改: 2025-11-27
 * 规范: docs/03_tds.md
 */

import { Github, Users } from "lucide-react";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { getAllMemberProfiles } from "@/services/memberService";
import { MEMBERS } from "@/config/members";
import { ActiveBuildersCard } from "@/components/features/home/ActiveBuildersCard";
import { MapCard } from "@/components/features/home/MapCard";
import { RawCard } from "@/components/features/home/RawCard";
import Link from "next/link";

export const revalidate = 3600; // ISR 1 hour

export default async function HomePage() {
  // Fetch member data on server side
  const profiles = await getAllMemberProfiles(MEMBERS);

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
              v1.0.0 System Online
            </div>

            <h1 className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 sm:text-6xl md:text-7xl lg:text-8xl">
              VibeTJ
            </h1>

            <div className="mx-auto h-8">
              <TypewriterText
                text="Connect · Build · Vibe"
                className="text-lg text-text-secondary md:text-xl font-mono"
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/members"
              className="group flex items-center justify-center gap-2 h-10 rounded-md bg-white px-8 text-sm font-medium text-black transition-all hover:bg-gray-200"
            >
              <Users className="h-4 w-4" />
              <span>Join Community</span>
            </Link>
            <a
              href="https://github.com/AldenWangExis/vibetj"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 h-10 rounded-md border border-border bg-black px-8 text-sm font-medium text-text-secondary transition-all hover:text-white hover:border-gray-500"
            >
              <Github className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              <span>GitHub</span>
            </a>
          </div>

          {/* Bento Grid Layout - Viewports */}
          <div className="grid w-full grid-cols-1 gap-4 pt-12 md:grid-cols-3 text-left h-auto md:h-[500px]">
            {/* Map Viewport (2/3 width) */}
            <div className="md:col-span-2 h-[300px] md:h-auto">
              <Link href="/map" className="block h-full w-full">
                <MapCard />
              </Link>
            </div>

            {/* Stack Column (1/3 width) */}
            <div className="md:col-span-1 flex flex-col gap-4 h-full">
              {/* Active Builders (Top) */}
              <Link href="/members" className="flex-1 min-h-[200px]">
                <ActiveBuildersCard profiles={profiles} />
              </Link>

              {/* System Lab / Raw Mode (Bottom) */}
              <Link href="/lab" className="h-[180px]">
                <RawCard />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
