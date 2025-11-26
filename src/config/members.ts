/**
 * config/members.ts - 成员列表配置 (GitOps 数据源)
 * 
 * 核心导出:
 * - MEMBERS: 成员配置数组
 * 
 * 使用说明:
 * - 新增成员: 添加新的 MemberConfig 对象到数组
 * - customBio: 可选，用于覆盖 GitHub 默认 Bio
 * - 数据富化: 通过 GitHub API 自动获取头像、昵称等信息
 * 
 * 作者: ZHWA | 创建: 2024-11-26
 * 规范: docs/01_tds.md, docs/01_urs.md
 */

import { MemberConfig } from "@/types";

export const MEMBERS: MemberConfig[] = [
  { 
    github: "shadcn", 
    customBio: "Design System Engineer" 
  },
  { 
    github: "AldenWangExis",
    customBio: "nana" 
  },
  { 
    github: "rauchg",
    customBio: "CEO at Vercel" 
  },
];

