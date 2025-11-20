---
inclusion: manual
---
<!------------------------------------------------------------------------------------
   Add rules to this file or a short description and have Kiro refine them for you.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
-------------------------------------------------------------------------------------> 
<EngineeringSpecification title="Vercel Deployment & Architecture Best Practices 2025" theme="Cloud Infrastructure">
  <Module name="VercelDeploymentSpecification">
    
    <!-- 1. 核心理念与计算模型 -->
    <Category name="CoreArchitecture" id="1.0">
      <Rule id="1.1" name="FrameworkDefinedInfrastructure">
        <Title>Framework-Defined Infrastructure (FDI)</Title>
        <Detail>
          Vercel 不再是单纯的静态托管，而是通过代码自动推导基建的边缘云。
          核心契约是 Build Output API (v3)，将 Next.js/Vite/Remix 等构建产物标准化为 Serverless/Edge 基元。
          架构选型应优先考虑框架对 Build Output API 的适配程度。
        </Detail>
      </Rule>

      <Section name="ComputeModels" id="1.2">
        <Title>计算与渲染模型架构决策</Title>
        
        <Guideline id="1.2.1">
          <Title>Static Assets (CDN)</Title>
          <Detail>
            Vite/React SPA 的默认模式。Vercel 自动处理 Rewrites 指向 index.html。
            对于 SPA，必须开启 `cleanUrls` 并利用 Immutable Caching 策略。
          </Detail>
        </Guideline>

        <Guideline id="1.2.2">
          <Title>Serverless Functions (Node.js/Go/Python)</Title>
          <Detail>
            适用于数据库连接（需配合连接池）、重型计算或完整 Node.js API 场景。
            2025 特性：Function Warming 和 Concurrency 控制已成熟，可缓解冷启动。
            Hobby Tier 限制：默认 10s 超时，最大 60s，无高优先级并发保障。
          </Detail>
        </Guideline>

        <Guideline id="1.2.3">
          <Title>Edge Functions (Edge Runtime)</Title>
          <Detail>
            基于 V8 Isolates，启动近乎零延迟。适用于 Middleware、重定向、Header 注入。
            Hobby Tier 陷阱：若 Middleware 匹配所有路由，每一个静态资源请求都会消耗配额（100万次/月）。
            必须配置 matcher 排除 `_next/static` 等静态资源。
          </Detail>
        </Guideline>
      </Section>
    </Category>

    <!-- 2. 缓存策略与数据一致性 -->
    <Category name="CachingStrategy" id="2.0">
      <Section name="IncrementalStaticRegeneration" id="2.1">
        <Title>ISR 与缓存失效</Title>
        <Rule id="2.1.1">
          <Title>On-Demand ISR</Title>
          <Detail>
            优先使用 On-Demand ISR (API 触发 Purge) 而非 Time-based TTL。
            这能实现 CMS 内容更新后的秒级一致性，同时保持静态性能。
          </Detail>
        </Rule>
        <Rule id="2.1.2">
          <Title>Vercel Data Cache</Title>
          <Detail>
            Next.js App Router 专用的持久化 HTTP 缓存，跨部署存在。
            高频更新数据必须在 fetch 层显式声明 `no-store` 或 `force-dynamic`，避免旧数据残留。
          </Detail>
        </Rule>
      </Section>

      <Section name="EdgeCaching" id="2.2">
        <Title>CDN 层缓存配置</Title>
        <Configuration id="2.2.1">
          <Title>Stale-While-Revalidate</Title>
          <Detail>
            利用 SWR 策略实现零延迟体验：后台更新缓存的同时立即向用户提供旧内容。
          </Detail>
        </Configuration>
      </Section>
    </Category>

    <!-- 3. 存储与数据库集成 -->
    <Category name="StorageIntegration" id="3.0">
      <Convention id="3.1">
        <Title>Serverless Storage 选型指南</Title>
        <Tool name="Vercel KV">Redis 兼容，适用于 Session、Rate Limiting，配合 Edge Functions 使用。</Tool>
        <Tool name="Vercel Postgres">关系型数据，必须配置连接池 (Pooling) 以防止 Serverless 函数耗尽连接。</Tool>
        <Tool name="Vercel Blob">替代 S3 存储文件，免 IAM 配置。</Tool>
        <Tool name="Edge Config">极高频读取、极低频写入的全局配置（Feature Flags、重定向）。读取 &lt; 5ms。</Tool>
      </Convention>
    </Category>

    <!-- 4. 部署流水线与配置 -->
    <Category name="DeploymentPipeline" id="4.0">
      <Section name="CICD" id="4.1">
        <Title>CI/CD 最佳实践</Title>
        <Configuration id="4.1.1">
          <Title>Ignored Build Step</Title>
          <Detail>配置 Git Diff 命令，若 PR 仅修改文档或非生产代码，自动跳过构建以节省配额。</Detail>
        </Configuration>
        <Rule id="4.1.2">
          <Title>Skew Protection (版本倾斜保护)</Title>
          <Detail>
            解决滚动更新期间客户端（旧 JS）请求新版 API 的问题。
            系统自动路由旧版本请求至旧部署实例，直到页面刷新。
          </Detail>
        </Rule>
      </Section>

      <Section name="ConfigurationFile" id="4.2">
        <Title>vercel.json 配置规范</Title>
        <Configuration id="4.2.1">
          <Title>Hobby Tier 限制性配置</Title>
          <Applicability>Hobby Plan (Free Tier)</Applicability>
          <Detail>
            - functions.maxDuration: 最大 60秒（设置更高会被截断）。
            - functions.memory: 最大 1024MB（可能导致图像处理 OOM）。
            - crons: 最大 2 个任务，频率每天一次（每分钟配置无效）。
          </Detail>
          <Example><![CDATA[
{
  "functions": {
    "api/long-running-task.js": {
      "maxDuration": 60, 
      "memory": 1024
    }
  },
  "cleanUrls": true
}
          ]]></Example>
        </Configuration>
      </Section>
    </Category>

    <!-- 5. 安全与合规 -->
    <Category name="Security" id="5.0">
      <Rule id="5.1">
        <Title>环境隔离与密钥管理</Title>
        <Detail>
          区分 Development, Preview, Production 三套环境变量。
          禁止将 `NEXT_PUBLIC_` 前缀用于敏感密钥。
        </Detail>
      </Rule>
      <Rule id="5.2">
        <Title>Hobby Tier 商业红线</Title>
        <Detail>
          Hobby 计划严禁商业用途（支付网关、通过广告获利、客户交付项目）。
          违规将导致账户封禁。
        </Detail>
      </Rule>
      <Guideline id="5.3">
        <Title>企业级防护 (Pro/Enterprise)</Title>
        <Detail>
          - WAF: 自定义拦截规则（Hobby Tier 仅有基础 DDoS 防护）。
          - Deployment Protection: 为预览环境添加密码或 SSO 验证（Hobby Tier 无法配置密码）。
        </Detail>
      </Guideline>
    </Category>

    <!-- 6. 架构师自查清单 -->
    <Category name="ArchitectChecklist" id="6.0">
      <ChecklistItem id="1">
        <Title>Partial Prerendering (PPR)</Title>
        <Detail>是否利用了 Next.js 14/15 的 PPR 特性，结合静态 Shell 与动态流式传输？</Detail>
      </ChecklistItem>
      <ChecklistItem id="2">
        <Title>Middleware 性能消耗</Title>
        <Detail>Middleware 逻辑是否过重？是否正确排除了静态资源匹配？</Detail>
      </ChecklistItem>
      <ChecklistItem id="3">
        <Title>图片优化成本</Title>
        <Detail>Hobby Tier 限制 1000 源图片/月。是否评估了 Vercel Image Optimization 的成本，或需转用 Cloudinary？</Detail>
      </ChecklistItem>
      <ChecklistItem id="4">
        <Title>数据库连接管理</Title>
        <Detail>是否使用了支持 Serverless 的连接池（如 Neon Pooling, Supabase Transaction Mode）？Hobby Tier 禁止使用 Cron Job 保活。</Detail>
      </ChecklistItem>
      <ChecklistItem id="5">
        <Title>构建优化</Title>
        <Detail>是否使用了 Turborepo 和 Remote Caching 以复用云端构建缓存？</Detail>
      </ChecklistItem>
    </Category>

  </Module>
</EngineeringSpecification>