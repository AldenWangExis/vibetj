/**
 * lib/github.ts - GitHub API 数据访问层 (DAL)
 *
 * 核心导出:
 * - fetchGitHubUser: 获取 GitHub 用户原始数据
 *
 * 职责:
 * - 纯数据访问，仅负责 GitHub API 调用
 * - 不包含业务逻辑，错误处理由 Service 层负责
 *
 * 缓存说明:
 * - GitHub API 数据属于公共数据 (CMS/Public Data)
 * - 当前使用 @octokit/rest，缓存由 Route-level ISR (revalidate = 3600) 控制
 *
 * 作者: ZHWA | 创建: 2024-11-26
 * 规范: docs/01_tds.md
 */

import { Octokit } from "@octokit/rest";
import type { GitHubUser } from "@/types";

// 服务端专用实例，不要在 Client Component 调用
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/**
 * 获取 GitHub 用户原始数据
 *
 * @throws {Error} API 调用失败时抛出异常，由 Service 层处理
 */
export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  console.log(`[GitHub API] Fetching user: ${username}`);

  const { data } = await octokit.users.getByUsername({ username });

  return {
    login: data.login,
    id: data.id,
    avatar_url: data.avatar_url,
    html_url: data.html_url,
    name: data.name,
    bio: data.bio,
  };
}
