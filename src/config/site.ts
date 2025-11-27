/**
 * config/site.ts - 站点元数据配置
 *
 * 核心导出:
 * - siteConfig: 站点全局配置对象
 *
 * 作者: Alden | 创建: 2025-11-26 | 修改: 2025-11-27
 * 规范: docs/01_tds.md
 */

export const siteConfig = {
  name: "VibeTJ",
  description: "VibeTJ Team Members - Industrial Minimalism Showcase",
  url: "https://vibetj.vercel.app",
  nav: [
    { name: "Home", href: "/" as const },
    { name: "Members", href: "/members" as const },
    { name: "Lab", href: "/lab" as const },
  ],
  links: {
    github: "https://github.com/AldenWangExis/vibetj",
    personal: "https://aldenwangexis.github.io/",
  },
} as const;
