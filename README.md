# VibeTJ

**一个展示团队成员的极简主义网站**

VibeTJ 是一个基于 GitOps 理念构建的团队成员展示平台。我们相信，团队信息应该像代码一样被管理——通过 Pull Request 加入，通过 Git 历史追溯，通过自动化部署更新。

🌐 **在线访问**: https://vibetj.vercel.app

---

## 项目背景

在传统的团队展示网站中，添加新成员通常需要：
1. 联系管理员
2. 提供个人信息和照片
3. 等待管理员手动更新数据库
4. 等待网站重新部署

这个流程繁琐、低效，且不透明。

**VibeTJ 改变了这一切**：
- 无需数据库，成员信息存储在代码仓库中
- 通过 GitHub API 自动获取头像和个人信息
- 任何人都可以通过 Pull Request 加入
- 代码合并后自动部署，实时生效

---

## 核心功能

### 1. 成员展示

- 响应式网格布局，自适应各种屏幕尺寸
- 展示成员的 GitHub 头像、昵称、用户名和自定义签名
- 点击卡片直接跳转到成员的 GitHub 主页
- 工业极简主义设计风格（Vercel / Geist Design System）

### 2.待探索 ...

---

## 如何加入 VibeTJ？

### 方式一：通过 Pull Request（推荐）

这是最透明、最符合开源精神的方式。

#### 步骤 1: Fork 仓库

访问 https://github.com/AldenWangExis/vibetj ，点击右上角的 "Fork" 按钮，将仓库 fork 到你的 GitHub 账号下。

#### 步骤 2: 克隆到本地

```bash
git clone https://github.com/你的用户名/vibetj.git
cd vibetj
```

#### 步骤 3: 创建新分支

```bash
git checkout -b add-myself
```

#### 步骤 4: 编辑成员列表

打开 `src/config/members.ts` 文件，添加你的信息：

```typescript
export const MEMBERS: MemberConfig[] = [
  // 现有成员...
  
  // 添加你的信息
  { 
    github: "你的GitHub用户名",
    customBio: "一句话介绍自己（可选）"
  },
];
```

**说明**：
- `github`: 你的 GitHub 用户名（必填）
- `customBio`: 自定义签名，会覆盖你的 GitHub Bio（可选）

系统会自动从 GitHub API 获取：
- 头像
- 昵称（Display Name）
- 默认 Bio（如果没有提供 customBio）

#### 步骤 5: 提交更改

```bash
git add src/config/members.ts
git commit -m "feat: add [你的名字] to members"
git push origin add-myself
```

#### 步骤 6: 创建 Pull Request

1. 访问你 fork 的仓库页面
2. 点击 "Compare & pull request" 按钮
3. 填写 PR 标题和描述：
   - 标题: `feat: add [你的名字] to members`
   - 描述: 简单介绍自己，说明为什么想加入 VibeTJ
4. 点击 "Create pull request"

#### 步骤 7: 等待审核

维护者会审核你的 PR。一旦合并：
- 你的信息会自动出现在网站上
- 通常在 1 小时内生效（ISR 缓存）
- 你可以在 https://vibetj.vercel.app/members 看到自己

### 方式二：提交 Issue

如果你不熟悉 Git 操作，也可以：

1. 访问 https://github.com/AldenWangExis/vibetj/issues
2. 点击 "New issue"
3. 提供以下信息：
   - GitHub 用户名
   - 自定义签名（可选）
4. 等待维护者帮你添加

---

## 技术特点

- **框架**: Next.js 15 + React 19
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 3.4
- **设计**: Vercel / Geist Design System
- **部署**: Vercel（自动部署）

---

## 本地开发

如果你想在本地运行项目，查看效果：

```bash
# 克隆仓库
git clone https://github.com/AldenWangExis/vibetj.git
cd vibetj

# 安装依赖
npm install

# 配置 GitHub Token（可选，但推荐）
cp .env.local.example .env.local
# 编辑 .env.local，添加你的 GitHub Token

# 启动开发服务器
npm run dev
```

访问 http://localhost:8005

**详细的开发和部署指南**: [docs/PROJECT_SETUP.md](docs/PROJECT_SETUP.md)

---

## 项目文档

- [项目配置与部署指南](docs/PROJECT_SETUP.md) - 开发、部署、故障排查
- [用户需求说明书](docs/01_urs.md) - 项目需求和设计理念
- [技术设计说明书](docs/01_tds.md) - 架构设计和技术细节
- [项目总结](docs/00_PROJECT_SUMMARY.md) - 完整的项目概览

---

## 常见问题

### Q: 为什么需要 GitHub Token？

A: GitHub API 对匿名请求有限流（每小时 60 次）。配置 Token 后可以提升到 5000 次/小时，确保网站稳定运行。Token 仅需 `public_user` 权限（只读）。

### Q: 我的头像多久会更新？

A: 网站使用 ISR（增量静态再生成），每 1 小时自动更新一次。如果你更改了 GitHub 头像，最多 1 小时后会在网站上生效。

### Q: 可以自定义更多信息吗？

A: 目前支持自定义签名（`customBio`）。如果需要更多自定义选项，欢迎提交 Issue 或 PR。

### Q: 这个项目开源吗？

A: 是的，项目采用 MIT 协议开源。你可以自由使用、修改和分发。

---

## 贡献指南

我们欢迎任何形式的贡献：

- 添加自己为成员
- 改进 UI/UX 设计
- 修复 Bug
- 添加新功能
- 完善文档

请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细的贡献指南。

---

## License

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 联系方式

- **项目地址**: https://github.com/AldenWangExis/vibetj
- **在线访问**: https://vibetj.vercel.app
- **问题反馈**: https://github.com/AldenWangExis/vibetj/issues

---

**Made with ❤️ by VibeTJ Team**
