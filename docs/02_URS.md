# User Requirement Specification (URS) - Map Feature
**项目名称:** VibeTJ  
**模块名称:** 地图活动实验室 (Map Lab)  
**文档版本:** v1.0  
**日期:** 2025-05  

## 1. 概述 (Overview)

本项目旨在为 VibeTJ 平台扩展地理空间维度，新增一个“Map”功能模块。该模块将集成 **高德地图 (AMap)**，提供一个工业级极简风格的交互界面。用户可以通过该界面查看过往活动的举办地点，并通过搜索功能探索新地点，将其标记并存储到云端数据库（Neon）。

核心价值在于：**可视化连接“数字代码”与“物理空间”**，沿用 VibeTJ 的 GitOps 与工业极简主义美学。

## 2. 用户角色 (User Roles)

| 角色 | 权限与行为 |
| :--- | :--- |
| **访客 (Visitor)** | 1. 浏览地图，查看已标记的过往活动地点。<br>2. 点击活动列表，地图自动定位到相应坐标。<br>3. 在搜索框搜索地点，预览位置（不保存）。 |
| **管理员/开发者 (Admin)** | 1. 拥有访客所有权限。<br>2. 搜索地点后，可将其“标记”并保存为新的活动地点。<br>3. 数据将同步至 Neon 数据库。 |
| *注：在本期 MVP (最小可行性产品) 中，暂时不强制区分登录鉴权，前端开放搜索与标记功能以便演示 Server Actions 能力。* |

## 3. 界面需求 (UI Requirements)

遵循 **Vercel / Geist Design System**，强调“黑、灰、细边框、高密度信息”。

### 3.1 导航栏 (Navigation)
*   **位置**: 顶部现有导航栏。
*   **变更**: 在 `Members` 与 `Lab` 之间（或 `Members` 之后）增加 **`Map`** 标签。
*   **状态**: 选中时呈现高亮状态（白色文字），未选中为灰色。

### 3.2 页面布局 (Page Layout)
采用 **非对称分栏布局 (Split Pane Layout)**，严格控制视窗高度为 `100vh`（扣除导航栏）。

*   **左侧控制区 (Control Panel)**:
    *   **宽度**: 固定宽度（如 `400px`）或 占屏比 `30%`。
    *   **背景**: 纯黑 (`#000000`) 或 极深灰 (`#0A0A0A`)。
    *   **边框**: 右侧有一条 `1px` 的深灰分割线 (`#333333`)。
    *   **层级**: `z-index` 高于地图，确保面板内容清晰。
*   **右侧地图区 (Map Canvas)**:
    *   **宽度**: 剩余空间 (`flex-1`)。
    *   **样式**: 地图本身需自定义样式（通过高德地图样式 API），去除鲜艳色彩，调整为**暗色模式 (Dark Mode)**，以匹配 Vercel 的黑底白字风格。

### 3.3 视觉细节 (Visual Details)
*   **搜索框**: 位于左侧面板顶部。Shadcn Input 组件样式，黑色背景，深灰边框，Focus 时边框变白。
*   **列表项 (Card)**:
    *   无背景色或透明背景。
    *   依靠 `border-b` (`#333`) 进行分割。
    *   Hover 时背景轻微变亮 (`hover:bg-white/5`)。
    *   字体使用 `Geist Sans`，标题白色，描述灰色。
*   **地图标记 (Marker)**:
    *   使用自定义 SVG 图标或 CSS Marker。
    *   样式应简洁（如黑底白圈的圆点），避免使用高德默认的蓝色大头针。

## 4. 功能需求 (Functional Requirements)

### 4.1 地图基础交互 (Map Interaction)
*   **[FR-MAP-01] 初始化**: 页面加载时，异步加载 `@amap/amap-jsapi-loader`。
*   **[FR-MAP-02] 视图控制**: 支持鼠标拖拽平移、滚轮缩放。
*   **[FR-MAP-03] 主题适配**: 强制加载高德地图的“极夜蓝”或自定义暗色主题。

### 4.2 地点搜索 (Search Location)
*   **[FR-SRCH-01] 关键词输入**: 左上角输入框支持输入中文/英文地址。
*   **[FR-SRCH-02] 自动补全 (POISearch)**: (可选) 输入时下拉展示高德 API 返回的建议列表。
*   **[FR-SRCH-03] 定位跳转**: 选中搜索结果后，地图视野平滑飞跃 (`flyTo`) 至目标点，并显示临时标记。

### 4.3 活动列表与展示 (Activity List)
*   **[FR-LIST-01] 列表渲染**: 左下方区域展示从数据库 (`Neon`) 获取的活动列表。
*   **[FR-LIST-02] 信息展示**: 每个列表项包含：
    *   活动名称 (Name)
    *   活动时间 (Time)
    *   简短描述/地址 (Description/Address)
*   **[FR-LIST-03] 联动交互**: 点击列表项，右侧地图自动移动中心点到该活动坐标，并高亮对应的 Marker。

### 4.4 标记与存储 (Mark & Store)
*   **[FR-ACT-01] 新增标记**: 搜索并选中一个地点后，提供“保存为活动”按钮。
*   **[FR-ACT-02] 数据提交**: 通过 Next.js Server Actions 将以下信息写入数据库：
    *   地点名称 (Name)
    *   详细地址 (Address)
    *   经纬度 (Lat, Lng)
    *   活动时间 (选填，默认为当前或手动输入)
    *   活动描述 (选填)
*   **[FR-ACT-03] 实时反馈**: 保存成功后，列表自动刷新（`revalidatePath`），地图上标记转为永久状态。

## 5. 数据需求 (Data Requirements)

基于 Drizzle ORM 定义 `activities` 或 `map_markers` 表结构。

**Schema 定义 (参考):**
*   `id`: Serial / UUID (主键)
*   `name`: Text (地点/活动名, Not Null)
*   `address`: Text (详细地址)
*   `latitude`: Double Precision (Not Null)
*   `longitude`: Double Precision (Not Null)
*   `description`: Text (活动描述)
*   `event_time`: Timestamp (活动时间)
*   `created_at`: Timestamp (入库时间)

## 6. 技术限制与依赖 (Constraints & Dependencies)

*   **地图 SDK**: 必须使用 `@amap/amap-jsapi-loader` 进行动态加载，避免 SSR 报错（`window is not defined`）。
*   **API Key**: 需在 `.env.local` 中配置高德地图 Key (`NEXT_PUBLIC_AMAP_KEY`) 和安全密钥 (`NEXT_PUBLIC_AMAP_SECURITY_CODE`)。
*   **样式一致性**: 所有 UI 组件必须复用 `src/components/ui` 下的 Shadcn 组件，禁止手写原生 HTML 按钮。
*   **响应式**: 在移动端 (Mobile)，布局需自动调整为上下结构（地图在上，列表在下）或 Tab 切换模式。

## 7. 验收标准 (Acceptance Criteria)

1.  **加载**: 进入 `/map` 页面，地图在 2秒内加载完毕，且风格为暗色。
2.  **搜索**: 输入“天安门”，地图能准确跳转至北京天安门位置。
3.  **存储**: 点击保存后，刷新页面，刚才标记的点依然存在于地图和列表中。
4.  **联动**: 点击左侧列表的任一活动，地图能准确缩放并居中到该活动位置。
5.  **UI**: 整体视觉完全融入 VibeTJ 的黑白工业风格，无突兀的默认地图控件。