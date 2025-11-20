---
inclusion: always
---
<!------------------------------------------------------------------------------------
   Add rules to this file or a short description and have Kiro refine them for you.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
-------------------------------------------------------------------------------------> 
<?xml version="1.0" encoding="UTF-8"?>
<EngineeringSpecification theme="TypeScript 工程规范文档（文件级）">
    <Module name="TypeScript 文件级规范">
        <Category name="类型系统与架构">
            <Section name="类型安全边界">
                <Rule id="1.0">
                    <Title>强类型约束</Title>
                    <Detail>tsconfig.json 强制 strict: true，禁用 any（ESLint @typescript-eslint/no-explicit-any）。</Detail>
                    <Detail>外部数据边界使用 unknown + 类型守卫，或 Zod schema 推导类型（z.infer）。</Detail>
                    <Detail>复杂类型使用 discriminated unions 确保穷尽性检查（exhaustive switch）。</Detail>
                </Rule>
                <Rule id="1.1">
                    <Title>类型设计原则</Title>
                    <Detail>interface 用于对象契约（支持声明合并），type 用于联合/交叉/映射类型，遵循SOLID、KISS、DRY、YAGNI原则。</Detail>
                    <Detail>使用 branded types 区分语义相同但业务不同的类型（如 UserId vs ProductId）。</Detail>
                    <Detail>泛型约束使用 extends，避免过度泛化导致类型丢失。</Detail>
                </Rule>
            </Section>

            <Section name="模块边界设计">
                <Rule id="1.2">
                    <Title>依赖管理</Title>
                    <Detail>命名导出为主（tree-shaking 友好），避免默认导出。</Detail>
                    <Detail>导入顺序：外部库 → 内部模块 → 类型导入（import type 分离运行时与类型依赖）。</Detail>
                    <Detail>路径别名（@/）限制跨层级导入，强制依赖方向（如禁止 utils 导入 services）。</Detail>
                </Rule>
                <Rule id="1.3">
                    <Title>公共 API 设计</Title>
                    <Detail>模块入口文件（index.ts）显式导出公共 API，内部实现不导出或使用 _ 前缀。</Detail>
                    <Detail>公共函数/类必须包含 JSDoc（功能、@throws、@example），依赖 TS 类型系统而非 @param/@returns 类型注解。</Detail>
                </Rule>
            </Section>
        </Category>

        <Category name="文档与协作规范">
            <Section name="模块文档">
                <Requirement id="2.0">
                    <Title>模块级注释</Title>
                    <Detail>文件头部注释：模块职责、核心导出、最小调用示例、关键依赖、设计模式（如适用）。</Detail>
                    <Detail>元数据：作者（默认 ZHWA）、创建/修改时间（YYYY-MM-DD）、关联规范文档路径。</Detail>
                    <Example>
                        ```typescript
                        /**
                         * userService.ts - 用户领域服务层
                         * 
                         * 核心导出：
                         * - UserService: CRUD + 认证逻辑
                         * - UserRepository: 数据访问抽象
                         * 
                         * 最小调用：
                         *   const service = new UserService(repo, validator)
                         *   await service.createUser({ username: 'john', email: 'john@example.com' })
                         * 
                         * 依赖：zod (校验), Repository 模式
                         * 作者: ZHWA | 创建: 2025-10-14 | 修改: 2025-11-17
                         * 规范: docs/01_SPEC_user_domain.md
                         */
                        ```
                    </Example>
                </Requirement>
            </Section>

            <Section name="API 文档">
                <Requirement id="2.1">
                    <Title>公共 API JSDoc</Title>
                    <Detail>必需项：功能描述、@throws（异常类型与触发条件）、@example（复杂逻辑必需）。</Detail>
                    <Detail>避免冗余：@param/@returns 仅描述语义，类型信息由 TS 类型签名提供。</Detail>
                    <Example>
                        ```typescript
                        /**
                         * 提交用户表单并持久化
                         * 
                         * @throws {ValidationError} 数据格式不符合 schema
                         * @throws {ConflictError} 用户名或邮箱已存在
                         * 
                         * @example
                         * const result = await submitUserForm({ name: 'John', email: 'john@example.com' })
                         * console.log('User ID:', result.userId)
                         */
                        async function submitUserForm(data: UserFormData): Promise<SubmitResult>
                        ```
                    </Example>
                </Requirement>
            </Section>
        </Category>

        <Category name="工程决策与工具链">
            <Section name="技术栈选型">
                <Convention id="3.0">
                    <Title>核心工具</Title>
                    <Detail>包管理：pnpm（lockfile 必须提交）</Detail>
                    <Detail>构建：Vite（开发服务器 + 生产构建）</Detail>
                    <Detail>测试：Vitest（*.spec.ts 或 *.test.ts，覆盖率 ≥ 80%）</Detail>
                    <Detail>校验：Zod（外部数据边界：API 响应、表单、配置文件）</Detail>
                    <Detail>日期：date-fns 或 Day.js（后端交互统一 ISO 8601）</Detail>
                </Convention>
            </Section>

            <Section name="错误处理策略">
                <Convention id="3.1">
                    <Title>错误分类与传播</Title>
                    <Detail>自定义错误类继承 Error，使用 discriminated unions 区分错误类型。</Detail>
                    <Detail>错误链使用 cause 属性保留原始错误上下文。</Detail>
                    <Detail>异步边界强制 try-catch，避免 unhandled rejection。</Detail>
                    <Detail>生产环境集成 Sentry/LogRocket，开发环境禁止 console.log 残留（ESLint no-console）。</Detail>
                </Convention>
            </Section>

            <Section name="性能优化">
                <Convention id="3.2">
                    <Title>代码分割与懒加载</Title>
                    <Detail>路由级别使用动态 import() 实现 code splitting。</Detail>
                    <Detail>大型依赖库（如图表库）按需加载，避免打包到主 bundle。</Detail>
                    <Detail>并发请求使用 Promise.all/allSettled，避免串行等待。</Detail>
                    <Detail>大数据集使用虚拟滚动或分页，避免一次性渲染。</Detail>
                </Convention>
            </Section>

            <Section name="配置约束">
                <Convention id="3.3">
                    <Title>tsconfig.json 强制项</Title>
                    <Detail>strict: true（包含 noImplicitAny, strictNullChecks 等）</Detail>
                    <Detail>target: ES2020+, lib: ["ES2020", "DOM"]</Detail>
                    <Detail>paths: 配置路径别名（@/ → src/），限制跨层级导入</Detail>
                    <Detail>noEmit: true（类型检查与构建分离）</Detail>
                </Convention>
            </Section>
        </Category>

        <Category name="质量门槛与检查清单">
            <Section name="自动化检查">
                <Rule id="4.0">
                    <Title>CI/CD 强制项</Title>
                    <Detail>tsc --noEmit（类型检查，零错误）</Detail>
                    <Detail>ESLint（complexity ≤ 10, no-explicit-any, no-console）</Detail>
                    <Detail>Prettier（格式化，零差异）</Detail>
                    <Detail>Vitest（测试覆盖率 ≥ 80%，核心业务逻辑必测）</Detail>
                </Rule>
            </Section>

            <Section name="代码审查要点">
                <ChecklistItem id="1">类型安全：无 any，外部数据使用 Zod 校验，discriminated unions 穷尽性检查</ChecklistItem>
                <ChecklistItem id="2">模块边界：公共 API 显式导出，内部实现 _ 前缀或不导出，依赖方向正确</ChecklistItem>
                <ChecklistItem id="3">错误处理：自定义错误类型，异步边界 try-catch，错误链 cause 属性</ChecklistItem>
                <ChecklistItem id="4">性能：并发请求 Promise.all，大数据集虚拟化/分页，动态 import 代码分割</ChecklistItem>
                <ChecklistItem id="5">文档：模块注释（职责、示例、依赖），公共 API JSDoc（@throws, @example）</ChecklistItem>
                <ChecklistItem id="6">安全：无硬编码敏感信息，环境变量管理配置</ChecklistItem>
            </Section>

            <Section name="命名与风格">
                <Rule id="4.1">
                    <Title>命名约定</Title>
                    <Detail>类型/接口：PascalCase，私有成员：_prefix 或 # 字段</Detail>
                    <Detail>常量：UPPER_CASE，文件名：camelCase（工具）或 PascalCase（类/组件）</Detail>
                    <Detail>禁止 emoji，遵循 Airbnb Style Guide</Detail>
                </Rule>
            </Section>
        </Category>
    </Module>
</EngineeringSpecification>
