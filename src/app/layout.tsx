/**
 * app/layout.tsx - Root Layout
 *
 * 核心功能:
 * - 全局字体配置 (Geist Sans + Geist Mono)
 * - SEO Metadata 配置
 * - 全局导航栏集成
 * - 全局状态栏集成 (StatusBar)
 * - 全局背景样式 (Grid + Noise + Breathing)
 *
 * 架构设计:
 * - Server Component
 * - 使用 Geist 字体实现零 CLS 加载
 *
 * 作者: Alden | 创建: 2025-11-26 | 修改: 2025-11-27
 * 规范: docs/03_tds.md
 */

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "@/components/layout/Navbar";
import { StatusBar } from "@/components/layout/StatusBar";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["VibeTJ", "Team", "Members", "Industrial Minimalism", "Vercel Style"],
  authors: [{ name: "Alden" }],
  creator: "VibeTJ Team",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background text-text-primary min-h-screen relative selection:bg-accent-green/20 selection:text-accent-green flex flex-col overflow-x-hidden">
        {/* 1. Film Grain (Noise) Overlay - Global */}
        <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] bg-noise-pattern mix-blend-overlay"></div>

        {/* 2. Breathing Grid Background */}
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-grid-pattern opacity-[0.15] animate-grid-breath [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]"></div>

        <Navbar />
        <main className="relative z-10 flex-1 pb-8">{children}</main>
        <StatusBar />
      </body>
    </html>
  );
}
