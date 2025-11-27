# VibeTJ - 技术设计说明书 (TDS)

**版本号:** v1.0
**日期:** 2025-11-26
**适用对象:** 开发工程师、DevOps
**技术栈:** Next.js 15, React 19, TypeScript 5, Tailwind CSS 3.4, Shadcn/ui

---

## 1. 系统架构设计 (System Architecture)

### 1.1 渲染策略 (Rendering Strategy)
鉴于 VibeTJ "重展示、轻交互" 的特性，全面采用 **React Server Components (RSC)** 优先策略：
*   **服务端渲染 (SSR/RSC):** `MembersPage`, `HomePage`, `MemberCard` 均为 Server Component。
*   **客户端渲染 (CSR):** 仅限于交互组件，如 `Navbar` (路由高亮状态)。**遵循叶子节点边界原则**：`Navbar` 作为布局组件，通过 `children` prop 接收 Server Component，避免在根 Layout 直接声明客户端组件。
*   **静态生成 (SSG) + 增量更新 (ISR):** 成员列表页启用 ISR，配置 `revalidate = 3600` (1小时)，平衡构建速度与数据时效性。
*   **流式渲染 (Streaming):** 使用 `<Suspense>` 包裹耗时的数据获取组件（`MemberGrid`），优化 TTFB。`loading.tsx` 提供骨架屏，服务端处理完 Layout 立即响应 HTML，后续 Chunk 流式传输。

### 1.2 数据流 (Data Flow)
1.  **Source:** `src/config/members.ts` (静态数组)。
2.  **Fetch:** 服务端组件直接使用 `async/await` 获取数据，**禁止使用 `useEffect` 获取初始数据**。
3.  **Request Memoization:** 利用 Next.js 自动请求去重机制。若 Header 和 Main 组件请求同一 API，无需 Prop Drilling。
4.  **Transform:** Service 层合并静态配置与 API 数据 -> 生成 ViewModel。
5.  **Render:** RSC 渲染 HTML -> 发送至客户端。耗时组件使用 `<Suspense>` 包裹，实现流式传输。

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

**缓存说明：** GitHub API 数据属于公共数据（CMS/Public Data），若使用原生 `fetch` 可配置 `next: { tags: ['members'] }` 实现按需更新。当前使用 `@octokit/rest`，缓存由 Route-level ISR (`revalidate = 3600`) 控制。

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
*   **类型:** Client Component (`"use client"`)，**叶子节点边界**。
*   **组合模式:** 通过 `children` prop 接收 Server Component（如 Logo），避免在 Client Component 中直接 import Server Component。
*   **依赖:** `usePathname` (用于判断当前 Tab 是否激活)。
*   **样式逻辑:**
    *   Container: `sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`。
    *   Active Tab: `text-foreground` (白)。
    *   Inactive Tab: `text-foreground/60 transition-colors hover:text-foreground/80` (灰变白)。

### 4.2 成员列表页 (`src/app/members/page.tsx`)
*   **类型:** Server Component (Controller 层)。
*   **缓存策略:** 
    *   `export const revalidate = 3600;` (ISR 1小时) - 适用于公共数据（GitHub 成员信息）。
    *   若未来需要按需更新（On-demand Revalidation），可在 Service 层使用 `next: { tags: ['members'] }` 配合 `revalidateTag('members')`。
*   **架构原则:** Controller 仅调用 Service，不包含业务逻辑。
*   **流式渲染:** 使用 `<Suspense>` 包裹 `<MemberGrid>`，配合 `loading.tsx` 实现骨架屏。
*   **伪代码逻辑:**
    ```tsx
    import { Suspense } from "react";
    import { MEMBERS } from "@/config/members";
    import { getAllMemberProfiles } from "@/services/memberService";
    import { MemberGrid } from "@/components/features/members/MemberGrid";

    export const revalidate = 3600;

    async function MembersContent() {
      // 调用 Service 层，业务逻辑已封装
      const profiles = await getAllMemberProfiles(MEMBERS);
      return <MemberGrid profiles={profiles} />;
    }

    export default function MembersPage() {
      return (
        <Suspense fallback={<div>Loading members...</div>}>
          <MembersContent />
        </Suspense>
      );
    }
    ```

### 4.3 成员卡片 (`src/components/features/members/MemberCard.tsx`)
*   **类型:** Server Component（纯展示组件，无交互逻辑）。
*   **依赖:** shadcn/ui (`Card`, `Avatar`), `next/image` (头像使用 `priority` 属性优化 LCP)。
*   **样式类映射 (Tailwind):**
    *   Wrapper: `group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface text-card-foreground transition-all duration-200 hover:border-border-hover hover:shadow-md`
    *   Link Overlay: 使用 Next.js `<Link>` 覆盖整个卡片或仅包裹 Header，实现点击跳转。

---

## 5. 样式与主题实现 (Styling Implementation)

### 5.1 Root Layout (`src/app/layout.tsx`)
使用 `geist` 包，通过 CSS Variable 注入。**配置全局 SEO Metadata**。

```tsx
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VibeTJ",
  description: "VibeTJ Team Members",
  // 使用 next/og 动态生成 Open Graph 图片（如需要）
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

### 5.3 性能优化要点
*   **图片优化:** 成员头像使用 `next/image`，LCP 元素（首屏头像）添加 `priority` 属性。
*   **字体加载:** `geist` 包实现零 CLS 字体加载，构建时内联 CSS。
*   **类型安全:** 启用 `experimental.typedRoutes`，`next/link` 和 `router.push` 使用静态路由名称自动补全。

---

## 6. 环境配置 (Configuration)

### 6.1 GitHub Token 配置

**为什么需要 GitHub Token？**

GitHub API 对匿名请求有严格限流：**每小时仅 60 次**。若成员数量超过 60 人或开发时频繁刷新页面，构建会报错 `403 Forbidden`，导致网站无法正常运行。

使用 Token（身份认证）后，**每小时可请求 5000 次**，即使有数百个成员或频繁调试也完全够用，确保构建稳定。


在项目根目录（`package.json` 同级）读取 `.env.local` 文件：

```ini
# GitHub Personal Access Token (Classic)
# Scope: public_user (read-only)
GITHUB_TOKEN=ghp_你的Token粘贴在这里
```

**重要：** `.env.local` 默认已被 `.gitignore` 忽略，**不要提交到 Git 仓库**，保护 Token 安全。

**生效方式：** 修改 `.env.local` 后，需重启开发服务器（`Ctrl+C` 然后重新 `npm run dev`）。

**代码集成**

确保 `src/lib/github.ts` 正确读取环境变量：

```typescript
const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN  // 自动读取 .env.local（本地）或 Vercel 配置（线上）
});
```

### 6.2 Next.js 配置 (`next.config.ts`)
必须配置远程图片域名白名单，否则 `next/image` 会报错。**启用 Typed Routes** 确保类型安全。

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
  // 类型安全路由（Next.js 15+）
  experimental: {
    typedRoutes: true,
  },
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

**基础配置：**
*   **Build Command:** `next build`
*   **Output Directory:** `.next`
*   **Install Command:** `npm install`

**GitHub Token 环境变量配置（关键步骤）：**

Vercel 无法读取本地 `.env.local`，必须在 Vercel Dashboard 中配置环境变量：

1.  进入 [Vercel Dashboard](https://vercel.com/dashboard)。
2.  点击你的 **VibeTJ** 项目。
3.  点击顶部 **Settings** 标签。
4.  左侧菜单点击 **Environment Variables**。
5.  添加变量：
    *   **Key:** `GITHUB_TOKEN`
    *   **Value:** 粘贴你的 `ghp_...` Token
    *   **Environments:** 全选（Production, Preview, Development）
6.  点击 **Save**。

**重要：** 配置环境变量后，**不会立即生效**。必须执行以下操作之一：
*   在 **Deployments** 页面手动 **Redeploy**（重新部署）
*   或推送任意代码到 GitHub 触发重新构建

新部署完成后，网站才能正确读取 Token，避免构建时出现 403 限流错误。

---

## 8. 测试重点 (Testing Strategy)

1.  **ISR 验证:** 修改代码中的 `revalidate` 为 60秒，本地 Build 后 Start，修改 GitHub 头像，观察 60秒后刷新页面是否变化。
2.  **流式渲染验证:** 检查 `loading.tsx` 骨架屏是否在数据加载前显示，验证 TTFB 优化效果。
3.  **Request Memoization 验证:** 在 Header 和 Main 组件中同时请求同一 GitHub API，验证是否只发起一次请求。
4.  **API 限流测试:** 移除 Token 运行 Build，检查控制台是否输出限流警告。
5.  **类型安全验证:** 使用 `router.push('/invalid-route')` 验证 TypeScript 是否报错（Typed Routes）。
6.  **样式回归:** 检查 Dark Mode 下边框 (`border-border`) 是否清晰，Hover 效果是否明显。
7.  **响应式:** 在 Chrome DevTools 中切换至 iPhone SE (375px) 尺寸，确认成员列表为单列显示。
8.  **性能检查:** 验证 LCP 元素（首屏头像）是否使用 `next/image` 的 `priority` 属性。