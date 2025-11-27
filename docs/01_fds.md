# VibeTJ - 功能设计说明书 (FDS)

**版本号:** v1.0
**日期:** 2025-11-26
**引用文档:** VibeTJ URS v1.0
**文档状态:** 正式版

---

## 1. 引言 (Introduction)
### 1.1 目的
本文件旨在定义 **VibeTJ** 应用的功能行为、信息架构及交互逻辑。它作为开发团队进行技术设计（TDS）和测试团队编写测试用例的依据。

### 1.2 范围
本设计涵盖应用的前端展示逻辑、数据获取策略（GitOps + GitHub API）、以及界面交互规范。后端逻辑仅限于 Next.js 的服务端组件渲染及构建时数据处理，不涉及外部数据库设计。

## 2. 信息架构 (Information Architecture)

### 2.1 站点地图 (Site Map)
系统采用扁平化层级结构：
*   **Level 0 (App Shell):** 全局布局（导航栏 + 页脚 + 背景）
    *   **Level 1 (Tabs):**
        *   **Home:** 品牌与项目概览
        *   **Members:** 成员展示网格
        *   **Lab:** 实验性功能（预留容器）

### 2.2 导航逻辑
*   **持久化:** 导航栏在所有页面切换中保持状态（Position Sticky），不重新渲染。
*   **路由高亮:** 当前激活的 Tab 文字颜色需变为高亮色（白色），非激活状态为灰色。
*   **平滑切换:** 页面切换时，内容区域应有极短的淡入淡出（Fade-in/out）效果。

## 3. 功能模块详述 (Functional Specifications)

### 3.1 模块 A：全局导航 (Global Navigation)
*对应 URS: REQ-01, REQ-02*

*   **功能描述:** 提供全站统一的入口和品牌标识。
*   **UI 组成:**
    *   **左侧:** 项目 Logo (SVG格式)，点击跳转至 Home。
    *   **中间/右侧:** 导航组件，包含 "Home", "Members", "Lab"。
    *   **背景:** 半透明黑色 + 高斯模糊 (Backdrop Blur)。
    *   **分割线:** 底部 1px 深灰色边框。
*   **交互规则:**
    *   页面滚动时，导航栏背景模糊效果需实时透出下方内容。
    *   移动端视图下，保持顶部固定，导航项若过多可横向滚动或折叠（当前需求仅3项，暂定横向排列）。

### 3.2 模块 B：主页 (Home Module)
*对应 URS: REQ-03*

*   **功能描述:** 静态展示页面。
*   **内容构成:**
    *   Hero Section: 大字号标题、简短 Slogan。
    *   Action Area: 引导用户访问 Members 页面或 GitHub 仓库的按钮。

### 3.3 模块 C：成员列表 (Members Module)
*对应 URS: REQ-04*

*   **功能描述:** 展示从配置文件读取并经 API 富化的成员信息。
*   **数据处理逻辑 (Data Logic):**
    1.  **输入:** 读取代码库中的成员配置文件（含 GitHub ID、自定义签名）。
    2.  **处理:**
        *   在构建阶段 (Build Time) 或 缓存失效重验证时 (Revalidation)，遍历 ID 列表。
        *   请求 GitHub API 获取：`avatar_url`, `name` (昵称), `html_url` (主页链接)。
        *   若 API 失败，使用默认占位图和 ID 作为兜底显示。
    3.  **输出:** 渲染好的成员卡片列表。
*   **界面状态 (UI States):**
    *   **Loading:** 显示骨架屏 (Skeleton)，包含圆形头像占位和两行文本占位。
    *   **Success:** 显示完整的成员 Grid 网格。
    *   **Error:** 若部分成员数据拉取失败，显示兜底信息，不阻断整个页面渲染。
*   **卡片交互:**
    *   **默认态:** 边框色 `#333333`，背景色 `#0A0A0A`。
    *   **悬停态 (Hover):** 边框色变亮（如 `#888888`），鼠标指针变为手型。
    *   **点击:** 在新标签页打开该成员的 GitHub 主页。

### 3.4 模块 D：GitOps 自动化流程 (System Logic)
*对应 URS: REQ-05*

*   **功能描述:** 定义非 GUI 的数据录入流程。
*   **逻辑流:**
    1.  用户提交 PR 修改 `config/members.ts`。
    2.  管理员 Merge 代码。
    3.  Vercel 检测到主分支变更，触发 Deployment。
    4.  Next.js Build 过程执行 3.3 中的数据处理逻辑。
    5.  生成新的静态页面并发布。

## 4. 界面设计规范 (UI Specifications)

### 4.1 布局系统 (Layout Grid)
*对应 URS: REQ-04, NFR-03*

*   **容器限制:** 主内容区最大宽度 `max-w-5xl`，水平居中。
*   **网格响应策略:**
    *   **Mobile (< 640px):** 单列 (1 col)。
    *   **Tablet (640px - 1024px):** 双列 (2 cols)。
    *   **Desktop (> 1024px):** 三列 (3 cols)。
*   **间距 (Spacing):** 遵循宽松原则，卡片间距推荐 `gap-4` 或 `gap-6`。

### 4.2 视觉样式定义 (Visual Definition)
*对应 URS: REQ-06, REQ-07, REQ-08*

*该部分指导 CSS 变量与 Tailwind 配置的逻辑映射。*

| UI 元素 | 视觉属性 (FDS 描述) | 对应设计系统变量 |
| :--- | :--- | :--- |
| **页面背景** | 纯黑 | `bg-background` (#000000) |
| **卡片背景** | 极深灰，用于从背景中浮起 | `bg-surface` (#0A0A0A) |
| **默认边框** | 难以察觉的深灰，用于界定轮廓 | `border-border` (#333333) |
| **高亮边框** | 中灰，用于 Focus/Hover | `border-border-hover` |
| **主要文字** | 纯白，高对比度 | `text-primary` |
| **次要文字** | 灰色，用于辅助信息 | `text-secondary` |
| **字体** | 无衬线，紧凑，抗锯齿 | Geist Sans |

### 4.3 反馈机制 (Feedback)
*   **Hover 延迟:** 所有 Hover 效果应无延迟响应，过渡时间 (Transition Duration) 建议 200ms。
*   **图片加载:** 头像加载过程中显示灰色圆圈占位，加载完成后平滑淡入。

## 5. 数据与性能规格 (Data & Performance Specs)

### 5.1 数据模型 (Logical Data Model)
虽然无数据库，但系统内部对象需包含以下字段：
*   `github_id` (String, 必填, 唯一键): GitHub 用户名。
*   `custom_bio` (String, 选填): 用户在 VibeTJ 覆盖显示的签名。
*   `display_name` (String, 自动获取): 优先使用 API 返回的 name，无则用 id。
*   `avatar_url` (String, 自动获取): 头像地址。

### 5.2 缓存与时效性
*对应 URS: NFR-01*

*   **缓存策略:** 服务端数据请求（GitHub API）必须实施缓存。
*   **更新频率 (ISR):** 设定 Revalidation Time = **3600秒 (1小时)**。即：成员修改 GitHub 头像后，最长需 1 小时在 VibeTJ 上生效，除非重新触发构建。
*   **API 限流保护:** 使用已认证的 Token 进行请求，确保每小时 5000 次的配额。

---

## 6. 边界与限制 (Limitations & Boundaries)
*   **不支持** 在线表单提交成员申请（必须走 Git）。
*   **不支持** 成员信息的实时（秒级）同步。
*   **不支持** 历史版本查看（以当前 Main 分支为准）。
