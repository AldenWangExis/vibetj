# VibeTJ - 技术设计说明书 (TDS)

**版本号:** v1.0
**日期:** 2024-11-26
**适用对象:** 开发工程师、DevOps
**技术栈:** Next.js 15, React 19, TypeScript 5, Tailwind CSS 3.4, Shadcn/ui

---

## 1. 系统架构设计 (System Architecture)

### 1.1 渲染策略 (Rendering Strategy)
鉴于 VibeTJ "重展示、轻交互" 的特性，全面采用 **React Server Components (RSC)** 优先策略：
*   **服务端渲染 (SSR/RSC):** `MembersPage`, `HomePage`, `MemberCard` (数据获取部分)。
*   **客户端渲染 (CSR):** 仅限于交互组件，如 `Navbar` (路由高亮状态)、`ThemeToggle` (如果有)。
*   **静态生成 (SSG) + 增量更新 (ISR):** 成员列表页启用 ISR，配置 `revalidate = 3600` (1小时)，平衡构建速度与数据时效性。

### 1.2 数据流 (Data Flow)
1.  **Source:** `src/config/members.ts` (静态数组)。
2.  **Fetch:** 服务端组件读取数组 -> 并行请求 GitHub API (带 Token)。
3.  **Transform:** 合并静态配置与 API 数据 -> 生成 ViewModel。
4.  **Render:** RSC 渲染 HTML -> 发送至客户端。

---

## 2. 目录结构规范 (Directory Structure)

采用 Next.js App Router 推荐的 `src` 目录结构，遵循**模块化服务层**架构原则。

```text
vibetj/
├── public/                 # 静态资源 (svgs, images)
├── src/
│   ├── app/                # App Router 路由 (Controller 层)
│   │   ├── layout.tsx      # Root Layout (Html, Body, Providers)
│   │   ├── page.tsx        # Home Page (Route: /)
│   │   ├── members/
│   │   │   ├── page.tsx    # Members Page (Route: /members)
│   │   │   └── loading.tsx # Suspense Skeleton for Members
│   │   ├── lab/            # Lab Page
│   │   └── globals.css     # 全局样式 & Tailwind Directives
│   ├── components/
│   │   ├── ui/             # Shadcn 基础组件 (Button, Card, Avatar...)
│   │   ├── layout/         # 布局组件 (Navbar, Footer)
│   │   └── features/       # 业务组件
│   │       └── members/    # (MemberGrid, MemberCard)
│   ├── services/           # [新增] 业务逻辑层 (Service Layer)
│   │   └── memberService.ts # 成员数据聚合、转换、错误处理
│   ├── lib/                # 工具函数与数据访问层 (DAL)
│   │   ├── utils.ts        # cn() helper
│   │   └── github.ts       # GitHub API 客户端 (纯数据访问，无业务逻辑)
│   ├── config/             # 静态配置文件
│   │   ├── site.ts         # 站点元数据
│   │   └── members.ts      # [关键] 成员列表数据源
│   └── types/              # TS 类型定义
├── tailwind.config.ts      # 样式配置 (FDS 4.2 定义)
├── next.config.ts          # Next.js 配置
└── package.json            # 依赖与脚本
```

**架构分层说明：**
- **Controller 层 (`app/`)**: Server Component 仅负责调用 Service，不包含业务逻辑
- **Service 层 (`services/`)**: 纯 TypeScript 业务逻辑，禁止导入 `next/*` 或 React Hooks
- **DAL 层 (`lib/`)**: 数据访问抽象（GitHub API 调用），返回原始数据

---

## 3. 数据层设计 (Data Layer Design)

### 3.1 类型定义 (`src/types/index.ts`)

```typescript
// 1. 基础配置数据 (来自 members.ts)
export interface MemberConfig {
  github: string;       // GitHub Username (Unique ID)
  customBio?: string;   // 覆盖 GitHub Bio 的自定义签名
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
  displayName: string;  // 优先取 name，无则取 login
  avatarUrl: string;
  profileUrl: string;
  bio: string;          // 优先取 customBio，无则取 github bio
}
```

### 3.2 配置文件 (`src/config/members.ts`)

```typescript
import { MemberConfig } from "@/types";

export const MEMBERS: MemberConfig[] = [
  { github: "shadcn", customBio: "Design System Engineer" },
  { github: "leerob" }, // 使用 GitHub 默认 Bio
];
```

### 3.3 数据访问层 (`src/lib/github.ts`)

**职责：** 纯数据访问，仅负责 GitHub API 调用，不包含业务逻辑。

```typescript
import { Octokit } from "@octokit/rest";
import type { GitHubUser } from "@/types";

// 服务端专用实例，不要在 Client Component 调用
const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN 
});

/**
 * 获取 GitHub 用户原始数据
 * 
 * @throws {Error} API 调用失败时抛出异常，由 Service 层处理
 */
export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
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
```

### 3.4 业务逻辑层 (`src/services/memberService.ts`)

**职责：** 数据聚合、转换、错误处理与兜底逻辑。**禁止导入 `next/*` 或 React Hooks**。

```typescript
import type { MemberConfig, MemberProfile, GitHubUser } from "@/types";
import { fetchGitHubUser } from "@/lib/github";

/**
 * 获取成员完整档案（聚合配置与 API 数据）
 * 
 * @throws 不会抛出异常，失败时返回兜底数据
 */
export async function getMemberProfile(config: MemberConfig): Promise<MemberProfile> {
  try {
    const apiData = await fetchGitHubUser(config.github);
    return {
      ...config,
      displayName: apiData.name || apiData.login,
      avatarUrl: apiData.avatar_url,
      profileUrl: apiData.html_url,
      bio: config.customBio || apiData.bio || "",
    };
  } catch (error) {
    console.error(`Failed to fetch user: ${config.github}`, error);
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
 */
export async function getAllMemberProfiles(
  configs: MemberConfig[]
): Promise<MemberProfile[]> {
  return Promise.all(configs.map(getMemberProfile));
}
```

---

## 4. 组件详细设计 (Component Design)

### 4.1 全局导航 (`src/components/layout/Navbar.tsx`)
*   **类型:** Client Component (`"use client"`)。
*   **依赖:** `usePathname` (用于判断当前 Tab 是否激活)。
*   **样式逻辑:**
    *   Container: `sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`。
    *   Active Tab: `text-foreground` (白)。
    *   Inactive Tab: `text-foreground/60 transition-colors hover:text-foreground/80` (灰变白)。

### 4.2 成员列表页 (`src/app/members/page.tsx`)
*   **类型:** Server Component (Controller 层)。
*   **配置:** `export const revalidate = 3600;` (ISR 1小时)。
*   **架构原则:** Controller 仅调用 Service，不包含业务逻辑。
*   **伪代码逻辑:**
    ```tsx
    import { MEMBERS } from "@/config/members";
    import { getAllMemberProfiles } from "@/services/memberService";
    import { MemberGrid } from "@/components/features/members/MemberGrid";

    export const revalidate = 3600;

    export default async function MembersPage() {
      // 调用 Service 层，业务逻辑已封装
      const profiles = await getAllMemberProfiles(MEMBERS);
    
      return <MemberGrid profiles={profiles} />;
    }
    ```

### 4.3 成员卡片 (`src/components/features/members/MemberCard.tsx`)
*   **依赖:** shadcn/ui (`Card`, `Avatar`).
*   **样式类映射 (Tailwind):**
    *   Wrapper: `group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface text-card-foreground transition-all duration-200 hover:border-border-hover hover:shadow-md`
    *   Link Overlay: 使用 Next.js `<Link>` 覆盖整个卡片或仅包裹 Header，实现点击跳转。

---

## 5. 样式与主题实现 (Styling Implementation)

### 5.1 字体配置 (`src/app/layout.tsx`)
使用 `geist` 包，通过 CSS Variable 注入。

```tsx
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased bg-background text-text-primary">
        {children}
      </body>
    </html>
  );
}
```

### 5.2 Tailwind 配置
完全沿用 FDS 4.2 章节生成的 `tailwind.config.ts`。重点检查 `colors.border` 和 `colors.surface` 是否生效。

---

## 6. 环境配置 (Configuration)

### 6.1 环境变量 (`.env.local`)
开发环境需手动创建此文件：

```ini
# GitHub Personal Access Token (Classic)
# Scope: public_user (read-only)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxx
```

### 6.2 Next.js 配置 (`next.config.ts`)
必须配置远程图片域名白名单，否则 `next/image` 会报错。

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // 严格模式
  reactStrictMode: true,
};

export default nextConfig;
```

---

## 7. 部署与运维 (Deployment & Ops)

### 7.1 开发指令 (基于 package.json 修正版)
*   **启动开发:** `npm run dev` (Runs on Port 8005 via Turbopack)
*   **构建生产:** `npm run build` (Standard Webpack build)
*   **预览生产:** `npm run start` (Runs on Port 8005)

### 7.2 Vercel 部署配置
*   **Build Command:** `next build`
*   **Output Directory:** `.next`
*   **Install Command:** `npm install`
*   **Environment Variables:** 务必在 Vercel Project Settings 中添加 `GITHUB_TOKEN`。

---

## 8. 测试重点 (Testing Strategy)

1.  **ISR 验证:** 修改代码中的 `revalidate` 为 60秒，本地 Build 后 Start，修改 GitHub 头像，观察 60秒后刷新页面是否变化。
2.  **API 限流测试:** 移除 Token 运行 Build，检查控制台是否输出限流警告。
3.  **样式回归:** 检查 Dark Mode 下边框 (`border-border`) 是否清晰，Hover 效果是否明显。
4.  **响应式:** 在 Chrome DevTools 中切换至 iPhone SE (375px) 尺寸，确认成员列表为单列显示。