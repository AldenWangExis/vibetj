# 贡献指南

感谢你对 VibeTJ 项目的关注！我们欢迎任何形式的贡献。

---

## 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
  - [添加自己为成员](#添加自己为成员)
  - [报告 Bug](#报告-bug)
  - [建议新功能](#建议新功能)
  - [提交代码](#提交代码)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交信息规范](#提交信息规范)
- [Pull Request 流程](#pull-request-流程)

---

## 行为准则

本项目遵循 [Contributor Covenant](https://www.contributor-covenant.org/) 行为准则。参与本项目即表示你同意遵守其条款。

简而言之：
- 尊重他人
- 包容不同观点
- 接受建设性批评
- 关注对社区最有利的事情

---

## 如何贡献

### 添加自己为成员

这是最简单的贡献方式！详细步骤请参考 [README.md](README.md#如何加入-vibetj)。

**快速指南**：

1. Fork 仓库
2. 编辑 `src/config/members.ts`，添加你的信息：
   ```typescript
   {
     github: "你的GitHub用户名",
     customBio: "一句话介绍自己（可选）"
   }
   ```
3. 提交 PR，标题格式：`feat: add [你的名字] to members`

### 报告 Bug

发现问题？请帮助我们改进！

1. 检查 [Issues](https://github.com/AldenWangExis/vibetj/issues) 确认问题是否已被报告
2. 如果没有，[创建新 Issue](https://github.com/AldenWangExis/vibetj/issues/new/choose)
3. 选择 "Bug 报告" 模板
4. 详细描述问题，包括：
   - 问题描述
   - 复现步骤
   - 期望行为 vs 实际行为
   - 截图或录屏
   - 浏览器和设备信息

### 建议新功能

有好点子？我们很乐意听取！

1. 检查 [Issues](https://github.com/AldenWangExis/vibetj/issues) 确认功能是否已被建议
2. 如果没有，[创建新 Issue](https://github.com/AldenWangExis/vibetj/issues/new/choose)
3. 选择 "功能建议" 模板
4. 详细描述：
   - 要解决的问题或需求
   - 建议的解决方案
   - 替代方案
   - 是否愿意参与实现

### 提交代码

想要贡献代码？太好了！

1. 先创建 Issue 讨论你的想法（大型变更）
2. Fork 仓库
3. 创建功能分支
4. 编写代码
5. 提交 Pull Request

---

## 开发流程

### 1. 环境准备

```bash
# 克隆你 fork 的仓库
git clone https://github.com/你的用户名/vibetj.git
cd vibetj

# 添加上游仓库
git remote add upstream https://github.com/AldenWangExis/vibetj.git

# 安装依赖
npm install

# 配置环境变量（可选）
cp .env.local.example .env.local
# 编辑 .env.local，添加你的 GitHub Token
```

### 2. 创建功能分支

```bash
# 确保主分支是最新的
git checkout main
git pull upstream main

# 创建功能分支
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

分支命名规范：
- `feature/xxx` - 新功能
- `fix/xxx` - Bug 修复
- `docs/xxx` - 文档更新
- `style/xxx` - 样式调整
- `refactor/xxx` - 代码重构
- `perf/xxx` - 性能优化

### 3. 开发

```bash
# 启动开发服务器
npm run dev

# 在另一个终端运行 linter
npm run lint
```

访问 http://localhost:8005 查看效果。

### 4. 测试

确保你的变更：
- 在本地运行正常
- 通过 linter 检查
- 没有引入新的错误
- 在不同浏览器和设备上测试（如果是 UI 变更）

### 5. 提交

```bash
# 添加变更
git add .

# 提交（遵循 Conventional Commits 规范）
git commit -m "feat: add new feature"

# 推送到你的 fork
git push origin feature/your-feature-name
```

### 6. 创建 Pull Request

1. 访问你 fork 的仓库页面
2. 点击 "Compare & pull request"
3. 填写 PR 模板
4. 提交 PR

---

## 代码规范

### TypeScript

- 使用 TypeScript 严格模式
- 为所有函数添加类型注解
- 避免使用 `any`
- 使用 `interface` 定义对象类型

### React

- 优先使用 Server Component
- 仅在需要交互时使用 Client Component
- 遵循 Next.js 15 App Router 最佳实践
- 组件命名使用 PascalCase

### 样式

- 使用 Tailwind CSS
- 遵循 Vercel / Geist Design System 风格
- 避免内联样式
- 使用语义化的类名

### 文件组织

- 组件文件使用 PascalCase（如 `MemberCard.tsx`）
- 工具函数文件使用 camelCase（如 `utils.ts`）
- 每个文件顶部添加文档注释，说明：
  - 文件功能
  - 核心导出
  - 作者和日期
  - 参考规范

**示例**：

```typescript
/**
 * components/features/members/MemberCard.tsx - 成员卡片组件
 * 
 * 核心功能:
 * - 展示成员头像、昵称、用户名和自定义签名
 * - 点击卡片跳转至成员的 GitHub 主页
 * 
 * 架构设计:
 * - Server Component (纯展示组件，无交互逻辑)
 * 
 * 作者: ZHWA | 创建: 2025-11-26
 * 规范: docs/01_tds.md
 */
```

---

## 提交信息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建工具或辅助工具的变动

### Scope（可选）

- `members`: 成员相关
- `ui`: UI 组件
- `api`: API 相关
- `config`: 配置文件

### 示例

```bash
# 添加新成员
git commit -m "feat(members): add John Doe to members"

# 修复 Bug
git commit -m "fix(ui): fix member card hover effect"

# 更新文档
git commit -m "docs: update README with new instructions"

# 代码重构
git commit -m "refactor(api): simplify GitHub API client"
```

---

## Pull Request 流程

### 1. 提交前检查

- [ ] 代码通过 `npm run lint`
- [ ] 在本地测试过所有变更
- [ ] 更新了相关文档
- [ ] 提交信息遵循规范
- [ ] PR 描述清晰完整

### 2. 提交 PR

- 使用清晰的标题
- 填写完整的 PR 模板
- 关联相关 Issue（如果有）
- 添加截图或录屏（UI 变更）

### 3. 代码审查

- 维护者会审查你的代码
- 可能会提出修改建议
- 请及时响应反馈
- 根据建议修改代码

### 4. 合并

- 审查通过后，维护者会合并 PR
- 合并后，你的变更会在 1 小时内部署到生产环境
- 感谢你的贡献！🎉

---

## 常见问题

### Q: 我不熟悉 Git，可以贡献吗？

A: 当然可以！你可以：
- 通过 Issue 报告 Bug 或建议功能
- 通过 Issue 申请加入成员（我们会帮你添加）
- 学习 Git 基础知识（推荐：[Git 教程](https://www.liaoxuefeng.com/wiki/896043488029600)）

### Q: 我的 PR 多久会被审查？

A: 通常在 1-3 个工作日内。如果超过一周没有响应，请在 PR 中评论提醒我们。

### Q: 我可以同时提交多个 PR 吗？

A: 可以，但建议每个 PR 只关注一个功能或修复。这样更容易审查和合并。

### Q: 我的 PR 被拒绝了怎么办？

A: 不要气馁！查看拒绝原因，改进后可以重新提交。或者在 Issue 中讨论更好的解决方案。

---

## 获取帮助

如果你有任何问题：

- 查看 [项目文档](docs/)
- 搜索 [Issues](https://github.com/AldenWangExis/vibetj/issues)
- 在 [Discussions](https://github.com/AldenWangExis/vibetj/discussions) 提问
- 联系维护者

---

## 致谢

感谢所有贡献者！你们的贡献让 VibeTJ 变得更好。

查看所有贡献者：[Contributors](https://github.com/AldenWangExis/vibetj/graphs/contributors)

---

**再次感谢你的贡献！❤️**

