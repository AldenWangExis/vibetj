/**
 * config/site.ts - 站点元数据配置
 *
 * 核心导出:
 * - siteConfig: 站点全局配置对象
 *
 * 作者: Alden | 创建: 2025-11-26 | 修改: 2025-11-27
 * 规范: docs/01_tds.md, docs/03_tds.md
 */

export const siteConfig = {
  name: "VibeTJ",
  description: "VibeTJ Team Members - Industrial Minimalism Showcase",
  url: "https://vibetj.vercel.app",
  version: "1.0.0",
  systemStatus: {
    // 支持 Markdown 格式: 有序列表、无序列表、换行
    // 示例:
    // - 无序列表项 1
    // - 无序列表项 2
    // 1. 有序列表项 1
    // 2. 有序列表项 2
    awaitingInput: `- Developer Profile Module
- Social Links Integration (GitHub, Blog)
- WeChat Official Account Card
- Activity Board Module,
- Awaiting Input ...`,
  },
  nav: [
    { name: "Home", href: "/" as const },
    { name: "Members", href: "/members" as const },
    { name: "Map", href: "/map" as const },
    { name: "Lab", href: "/lab" as const },
  ],
  links: {
    github: "https://github.com/AldenWangExis/vibetj",
    personal: "https://aldenwangexis.github.io/",
  },
} as const;
