# VibeTJ - 用户需求说明书 (URS)

**版本号:** v1.0
**日期:** 2025-11-26
**项目代号:** VibeTJ
**核心理念:** Industrial Minimalism (工业极简主义), GitOps Driven (GitOps 驱动)

---

## 1. 项目概述 (Project Overview)
**VibeTJ** 是一个基于 Next.js 构建的高性能、现代化的团队/社区展示应用。
项目的核心目标是创建一个**重展示、轻交互**的门户站点，通过“GitOps（配置即代码）”的方式管理成员列表，移除对传统数据库的依赖，实现极低成本的维护和极高的扩展性。

## 2. 用户角色 (User Roles)
1.  **访客 (Viewer):** 浏览项目主页、查看成员列表及详细信息。
2.  **成员/贡献者 (Contributor):** 通过 GitHub Fork 仓库并提交 Pull Request (PR) 来申请加入列表或修改个人资料。
3.  **管理员 (Admin/Maintainer):** 负责审核 Merge Request，合并代码触发自动部署。

## 3. 功能需求 (Functional Requirements)

### 3.1 导航与架构 (Navigation & Architecture)
*   **REQ-01 全局导航栏:**
    *   必须固定在页面顶部 (Sticky Top)。
    *   视觉效果需包含背景模糊 (Backdrop blur) 和底部细边框。
    *   包含项目 Logo (VibeTJ) 和主要导航标签 (Tabs)。
*   **REQ-02 标签页架构 (Tab System):**
    *   系统需支持扩展，初始包含：
        *   `Home` (主页)
        *   `Members` (成员列表)
        *   `Lab` (预留的扩展页)
    *   切换标签时，导航栏保持不变，仅内容区切换。

### 3.2 页面功能 (Page Features)
*   **REQ-03 主页 (Home Page):**
    *   展示 VibeTJ 的品牌介绍和核心理念。
*   **REQ-04 成员列表页 (Members Page):**
    *   **数据源:** 成员数据（GitHub 用户名、自定义签名）必须存储在代码仓库的静态文件（JSON/TS）中，**不使用数据库**。
    *   **数据富化:** 必须通过 GitHub API 获取实时的头像、昵称等信息。
    *   **展示形式:** 响应式网格布局 (Grid)，在移动端单列，大屏三列。
    *   **卡片内容:** 包含圆形头像、加粗昵称、GitHub Handle (@username)、自定义签名 (Bio)。
    *   **交互:** 点击卡片或相关按钮可跳转至成员的 GitHub 主页。

### 3.3 数据管理 (Data Management)
*   **REQ-05 GitOps 工作流:**
    *   新增成员必须通过修改代码仓库中的配置文件并提交 PR 实现。
    *   系统需在构建时 (Build Time) 或通过 ISR (增量静态再生成) 获取 GitHub 数据，避免客户端频繁请求导致 API 限流。

## 4. UI/UX 设计规范 (Design Specifications)

### 4.1 视觉风格 (Visual Style) @./tailwind.config.tss
*   **REQ-06 设计语言:** 严格遵循 **Vercel / Geist Design System** 风格。
    *   **关键词:** 工业极简、数学化精确、黑白灰。
*   **REQ-07 色彩体系:**
    *   **背景:** 纯黑 (`#000000`) 或极深灰 (`#0A0A0A`)。
    *   **层级:** 依靠 **边框 (Border)** 区分层级，严禁使用大面积背景色块区分卡片。
    *   **边框颜色:** 默认为深灰 (`#333333`)，Hover 时高亮。
*   **REQ-08 字体排印:**
    *   标题/正文: `Geist Sans` (或 Inter)。
    *   代码/标签: `Geist Mono` (或 Fira Code)。
    *   字体需支持抗锯齿渲染。

### 4.2 交互体验 (Interaction)
*   **REQ-09 状态反馈:**
    *   所有可点击元素（卡片、按钮）在 Hover 状态下必须有边框变色或微弱发光效果。
    *   页面加载需有骨架屏 (Skeleton) 或平滑过渡，避免内容闪烁。