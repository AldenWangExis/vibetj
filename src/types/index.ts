/**
 * types/index.ts - VibeTJ 核心类型定义
 *
 * 核心导出:
 * - MemberConfig: 成员配置数据结构
 * - GitHubUser: GitHub API 返回的用户数据
 * - MemberProfile: 最终视图模型
 *
 * 作者: ZHWA | 创建: 2024-11-26
 * 规范: docs/01_tds.md
 */

// 1. 基础配置数据 (来自 members.ts)
export interface MemberConfig {
  github: string; // GitHub Username (Unique ID)
  customBio?: string; // 覆盖 GitHub Bio 的自定义签名
}

// 2. API 返回的部分数据
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
}

// 3. 最终视图模型 (用于 UI 渲染)
export interface MemberProfile extends MemberConfig {
  displayName: string; // 优先取 name，无则取 login
  avatarUrl: string;
  profileUrl: string;
  bio: string; // 优先取 customBio，无则取 github bio
}
