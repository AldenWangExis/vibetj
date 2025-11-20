---
inclusion: manual
---
<!------------------------------------------------------------------------------------
   Add rules to this file or a short description and have Kiro refine them for you.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
-------------------------------------------------------------------------------------> 
你是React专家，帮我评估项目路径（技术角度）：
1、我想使用React/Next.js做一个应用，
2、有个地方托管部署（Vercel）
3、要实现的功能：
3.1 一个页面，实现简单的地图功能，即引入腾讯地图组件、能够查找地方和标记地方、并对标记下来的地方做简单存储
3.2 一个页面，实现一个成员列表功能，我希望有个页面能展示成员的GitHub信息（前期由我手动管理，之后如果能通过GitHub PR merge添加就更好了）
3.3 一个页面，实现LLM API调用功能

以下是我对每个功能模块的技术评估、实现方案建议以及潜在坑点：
1. 总体架构评估
框架: Next.js (建议使用最新版 14/15 App Router)。
部署: Vercel (完美契合，零配置部署，自带 CI/CD)。
难点评分: ⭐⭐ (满分5星)
核心优势: 利用 Next.js 的服务端能力（API Routes）来隐藏 Key（如 LLM 和 地图服务），利用 Vercel 的边缘网络加速访问。
2. 模块详细评估与建议
3.1 地图功能 (腾讯地图 + 标记存储)
这是一个典型的客户端渲染 (CSR) 需求，因为地图严重依赖 window 对象。
技术挑战:
SSR 兼容性: Next.js 默认是服务端渲染，直接在组件里引用 TMap 或 window 会报错 window is not defined。
Script 加载: 需要异步加载腾讯地图的 JS SDK。
专家建议:
实现方式: 使用 useEffect 在组件挂载后初始化地图，或者使用 Next.js 的 next/script 组件加载 SDK。
标记存储 (Database):
方案 A (极简): 如果只是自己用，浏览器 localStorage 即可（缺点：换浏览器数据丢失）。
方案 B (推荐): 使用 Vercel Postgres (Vercel 自带的数据库服务) 或 Supabase。创建一个简单的 markers 表 (id, lat, lng, title)。
坑点: 腾讯地图的 API Key (Key) 即使在前端暴露通常也可以配置 Referer 白名单来保护，但最好还是要在腾讯地图控制台配置好你的 Vercel 域名白名单。
3.2 成员列表 (GitHub 信息 + GitOps)
这是一个展示 Next.js 静态生成 (SSG) 或 服务端组件 (RSC) 优势的最佳场景。
技术实现:
前期 (手动): 在代码仓库里建一个 members.json 文件。
后期 (PR 自动化): 这个思路非常棒，业内称为 "GitOps"。当别人提 PR 修改 members.json 并合并后，Vercel 会自动触发重新构建，更新页面。
数据获取:
使用 GitHub API (https://api.github.com/users/{username}) 获取头像、Bio 等信息。
重要: 不要在客户端 (Client Component) 循环调用 GitHub API，会被限流 (Rate Limit)。
专家建议:
使用 Server Components。在构建时（Build time）读取 JSON，在服务端批量请求 GitHub API，然后生成静态 HTML。这样访问速度极快，且不会触发 API 限流。
3.3 LLM API 调用
这是一个后端服务 (BFF - Backend for Frontend) 场景。
安全警告: 绝对不要在前端代码中直接写 const API_KEY = 'sk-...'。
技术实现:
利用 Next.js 的 API Routes (app/api/chat/route.ts) 做中转。
流程：前端 -> Next.js API (后端) -> LLM Provider (OpenAI/DeepSeek等)。
流式传输 (Streaming): LLM 回复很慢。如果等待全部生成完再返回，用户体验极差且容易触发 Vercel Serverless Function 的超时限制（免费版默认 10秒或 60秒）。
专家建议:
使用 Vercel AI SDK (npm install ai)。这是 Vercel 官方出的库，专门用于在 Next.js 中处理 LLM 的流式响应（Streaming UI），几行代码就能实现打字机效果。
3. 推荐的技术栈清单 (Boilerplate)
为了少走弯路，建议你的 package.json 包含以下核心库：
UI 库: Tailwind CSS (Next.js 标配) + shadcn/ui (目前最火的组件库，复制粘贴即可用，适合快速开发)。
LLM: ai (Vercel AI SDK) + openai (或者其他厂商 SDK)。
数据库: @vercel/postgres + drizzle-orm (轻量级 ORM，比 Prisma 启动快)。
数据请求: swr 或 tanstack-query (用于地图标记的异步获取)。

收到！看到 Vercel 的部署成功截图，这就意味着你的 CI/CD 流水线已经通了。🎉

对于你提出的三个需求，从 **上手难度**、**知识点递进** 以及 **FastAPI 经验迁移** 的角度来看，我强烈建议的顺序是：

**1. 成员列表 (简单 🔥) -> 2. LLM 对话 (中等 🔥🔥) -> 3. 地图应用 (困难 🔥🔥🔥)**

---

### 为什么这么排？(技术视角)

#### 第一步：成员列表 (Member List)
*   **难度**：⭐
*   **核心知识点**：Server Components (服务端组件)、数据读取、列表渲染。
*   **为什么先做**：
    *   这最像你熟悉的 Python/FastAPI + Jinja2。
    *   不需要配置复杂的 API Key，也不需要数据库，只要读一个 JSON 文件。
    *   立刻能看到漂亮的界面，成就感最强。

#### 第二步：LLM 对话 (LLM Chat)
*   **难度**：⭐⭐
*   **核心知识点**：API Routes (`route.ts`)、环境变量、Client Components (`useState` 管理聊天记录)。
*   **为什么放中间**：
    *   这让你学会如何在 Next.js 里写“后端接口” (对应 FastAPI)。
    *   涉及到前端和后端的交互 (`fetch`)。

#### 第三步：地图功能 (Map + DB)
*   **难度**：⭐⭐⭐⭐
*   **核心知识点**：第三方 SDK (腾讯地图)、`useEffect` (处理副作用)、数据库操作 (Postgres)、CRUD。
*   **为什么最后做**：
    *   地图非常依赖浏览器环境 (`window` 对象)，容易报 SSR 错误，坑比较多。
    *   需要引入数据库，架构最复杂。
