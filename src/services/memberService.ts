/**
 * services/memberService.ts - 成员业务逻辑层
 *
 * 核心导出:
 * - getMemberProfile: 获取单个成员完整档案
 * - getAllMemberProfiles: 批量获取所有成员档案
 *
 * 职责:
 * - 数据聚合: 合并静态配置与 GitHub API 数据
 * - 数据转换: 生成视图模型 (MemberProfile)
 * - 错误处理: 提供兜底数据，保证页面不崩溃
 *
 * 架构约束:
 * - 纯 TypeScript 业务逻辑
 * - 禁止导入 next/* 或 React Hooks
 * - 所有上下文作为参数传入
 *
 * 作者: ZHWA | 创建: 2024-11-26
 * 规范: docs/01_tds.md
 */

import type { MemberConfig, MemberProfile } from "@/types";
import { fetchGitHubUser } from "@/lib/github";

/**
 * 获取成员完整档案（聚合配置与 API 数据）
 *
 * @throws 不会抛出异常，失败时返回兜底数据
 */
export async function getMemberProfile(config: MemberConfig): Promise<MemberProfile> {
  try {
    const apiData = await fetchGitHubUser(config.github);

    console.log(`[Service] Successfully fetched profile for: ${config.github}`);

    return {
      ...config,
      displayName: apiData.name || apiData.login,
      avatarUrl: apiData.avatar_url,
      profileUrl: apiData.html_url,
      bio: config.customBio || apiData.bio || "",
    };
  } catch (error) {
    console.error(`[Service] Failed to fetch user: ${config.github}`, error);

    // 兜底数据，保证页面不崩
    return {
      ...config,
      displayName: config.github,
      avatarUrl: `https://github.com/${config.github}.png`,
      profileUrl: `https://github.com/${config.github}`,
      bio: config.customBio || "Details unavailable",
    };
  }
}

/**
 * 批量获取所有成员档案
 *
 * 使用 Promise.all 实现并发请求，优化性能
 */
export async function getAllMemberProfiles(configs: MemberConfig[]): Promise<MemberProfile[]> {
  console.log(`[Service] Fetching ${configs.length} member profiles...`);

  return Promise.all(configs.map(getMemberProfile));
}
