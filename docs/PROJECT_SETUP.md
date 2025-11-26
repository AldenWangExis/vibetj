# VibeTJ - 项目配置与部署指南

创建人: ZHWA
创建日期: 2025-11-26
修改日期: 2025-11-26
参考文档: docs/01_tds.md
适用范围: VibeTJ 项目 - 开发与部署

---

## 技术栈

- **框架**: Next.js 15.x
- **视图库**: React 19.x
- **语言**: TypeScript 5.x
- **样式**: Tailwind CSS 3.4.x
- **UI 组件**: Shadcn/ui
- **字体**: Geist Sans + Geist Mono
- **图标**: Lucide React
- **GitHub API**: @octokit/rest
- **Slot 组件**: @radix-ui/react-slot

---

## 环境要求

- Node.js 22.20+
- npm 或 pnpm

---

## 本地开发

### 1. 克隆仓库

```bash
git clone git@github.com:AldenWangExis/vibetj.git
cd vibetj
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 GitHub Token

#### 为什么需要 GitHub Token？

GitHub API 对匿名请求有严格限流：**每小时仅 60 次**。若成员数量超过 60 人或开发时频繁刷新页面，构建会报错 `403 Forbidden`。

使用 Token（身份认证）后，**每小时可请求 5000 次**，确保构建稳定。

#### 配置步骤

1. 创建 `.env.local` 文件:
```bash
cp .env.local.example .env.local
```

2. 获取 GitHub Personal Access Token:
   - 访问 https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 权限范围: 仅勾选 `public_user` (只读)
   - 生成并复制 Token

3. 添加到 `.env.local`:
```ini
GITHUB_TOKEN=ghp_你的Token粘贴在这里
```

4. 重启开发服务器（如果已启动）

**重要**: `.env.local` 默认已被 `.gitignore` 忽略，不会提交到 Git 仓库。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:8005

### 5. 构建生产版本

```bash
npm run build
npm run start
```

---

## 部署到 Vercel

### 1. 推送代码到 GitHub

```bash
git add .
git commit -m "feat: add new member"
git push origin main
```

### 2. 导入项目到 Vercel

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 选择 GitHub 仓库 `vibetj`
4. 点击 "Import"

### 3. 配置环境变量

**关键步骤**：Vercel 无法读取本地 `.env.local`，必须在 Dashboard 中配置。

1. 进入项目 Settings > Environment Variables
2. 添加变量:
   - **Key**: `GITHUB_TOKEN`
   - **Value**: 粘贴你的 `ghp_...` Token
   - **Environments**: 全选（Production, Preview, Development）
3. 点击 "Save"

### 4. 重新部署

配置环境变量后，**不会立即生效**。必须执行以下操作之一：
- 在 Deployments 页面手动 "Redeploy"
- 或推送任意代码到 GitHub 触发重新构建

新部署完成后，网站才能正确读取 Token。

---

## 项目结构

```
vibetj/
├── docs/                           # 项目文档
│   ├── 00_PROJECT_SUMMARY.md      # 项目总结
│   ├── 01_urs.md                  # 用户需求说明书
│   ├── 01_tds.md                  # 技术设计说明书
│   └── PROJECT_SETUP.md           # 本文档
├── public/                         # 静态资源
├── src/
│   ├── app/                        # App Router 路由
│   │   ├── layout.tsx             # Root Layout
│   │   ├── page.tsx               # Home Page
│   │   ├── not-found.tsx          # 404 页面
│   │   ├── error.tsx              # 错误边界
│   │   ├── global-error.tsx       # 全局错误边界
│   │   ├── members/               # Members Page
│   │   │   ├── page.tsx           # 成员列表页
│   │   │   ├── loading.tsx        # 加载状态
│   │   │   └── error.tsx          # 页面级错误边界
│   │   └── lab/                   # Lab Page
│   ├── components/
│   │   ├── ui/                    # Shadcn 基础组件
│   │   │   ├── card.tsx           # 卡片组件
│   │   │   └── avatar.tsx         # 头像组件
│   │   ├── layout/                # 布局组件
│   │   │   └── Navbar.tsx         # 全局导航栏
│   │   └── features/              # 业务组件
│   │       └── members/           # 成员相关组件
│   ├── services/                  # 业务逻辑层
│   │   └── memberService.ts       # 成员服务
│   ├── lib/                       # 工具函数与数据访问层
│   │   ├── utils.ts               # 工具函数
│   │   └── github.ts              # GitHub API 客户端
│   ├── config/                    # 静态配置文件
│   │   ├── site.ts                # 站点元数据
│   │   └── members.ts             # 成员列表 (GitOps)
│   ├── types/                     # TypeScript 类型定义
│   │   └── index.ts               # 核心类型
│   └── middleware.ts              # 全局中间件
├── .env.local                     # 环境变量 (不提交)
├── .env.local.example             # 环境变量模板
├── next.config.ts                 # Next.js 配置
├── tailwind.config.ts             # Tailwind CSS 配置
├── tsconfig.json                  # TypeScript 配置
└── package.json                   # 依赖与脚本
```

---

## 架构设计

### 渲染策略

- **Server Component**: 默认所有组件，优化性能和 SEO
- **Client Component**: 仅限于交互组件 (Navbar, 错误边界)
- **ISR**: 成员列表页 1 小时重新验证
- **Streaming**: 使用 Suspense 优化 TTFB

### 数据流

1. 静态配置 (`config/members.ts`) - GitOps 数据源
2. GitHub API 调用 (`lib/github.ts`) - 数据富化
3. 业务逻辑聚合 (`services/memberService.ts`) - 数据转换
4. 视图模型渲染 (`components/features/members`) - UI 展示

### 错误处理

- **404 页面** (`not-found.tsx`): 处理不存在的路由
- **全局错误边界** (`error.tsx`): 捕获运行时错误
- **根错误边界** (`global-error.tsx`): 捕获 Root Layout 错误
- **页面级错误边界** (`members/error.tsx`): 处理 GitHub API 错误

### 路由守卫

- **中间件** (`middleware.ts`): 请求拦截、安全头、日志记录

---

## 开发指令

```bash
# 启动开发服务器 (Port 8005)
npm run dev

# 构建生产版本
npm run build

# 预览生产版本 (Port 8005)
npm run start

# Linter 检查
npm run lint
```

---

## 样式规范

### 色彩体系

- **背景**: 纯黑 (#000000)、极深灰 (#0A0A0A)
- **边框**: 深灰 (#333333)，Hover 时高亮 (#888888)
- **文字**: 纯白 (#FFFFFF)、中灰 (#888888)、深灰 (#444444)
- **强调色**: Vercel Blue (#0070F3)、Error Red (#EE0000)、Turbo Green (#00FF94)

### 字体排印

- **正文**: Geist Sans (14px-16px)
- **代码**: Geist Mono (13px-14px)
- **标题**: 小而粗 (Bold, 14px-16px)
- **字间距**: 收紧 (tracking-tight)

### UI 组件特征

- **卡片圆角**: 8px (rounded-lg)
- **按钮圆角**: 6px (rounded-md)
- **边框宽度**: 1px
- **交互**: Hover 边框高亮、轻微阴影

---

## 性能优化

### 1. 渲染优化

- **Server Component**: 默认服务端渲染，优化 SEO
- **ISR**: 1 小时重新验证，平衡性能与时效性
- **Streaming**: Suspense + 骨架屏，优化 TTFB

### 2. 资源优化

- **图片**: next/image + priority 属性（首屏前 3 个）
- **字体**: Geist 字体实现零 CLS
- **代码分割**: 动态 import() 按需加载

### 3. 类型安全

- **Typed Routes**: 避免 404 死链
- **严格模式**: TypeScript strict: true
- **类型推导**: 端到端类型流

---

## 故障排查

### 问题 1: GitHub API 限流

**症状**: 构建时出现 `403 Forbidden` 错误

**解决方案**:
1. 确认 `.env.local` 文件存在且包含 `GITHUB_TOKEN`
2. 重启开发服务器
3. 如果是 Vercel 部署，检查环境变量是否配置正确

### 问题 2: 成员头像无法加载

**症状**: 图片显示 broken image

**解决方案**:
1. 检查 `next.config.ts` 中是否配置了 `avatars.githubusercontent.com` 域名
2. 确认网络连接正常
3. 检查浏览器控制台错误信息

### 问题 3: 页面样式错误

**症状**: 页面显示异常，缺少样式

**解决方案**:
1. 确认 `tailwind.config.ts` 配置正确
2. 检查 `globals.css` 是否正确导入
3. 清除 `.next` 缓存并重新构建

---

## 相关文档

- [用户需求说明书 (URS)](01_urs.md)
- [技术设计说明书 (TDS)](01_tds.md)
- [项目总结 (PROJECT_SUMMARY)](00_PROJECT_SUMMARY.md)

---

## License

MIT

## 作者

ZHWA @ VibeTJ Team

