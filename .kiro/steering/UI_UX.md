---
inclusion: always
---
<!------------------------------------------------------------------------------------
   Add rules to this file or a short description and have Kiro refine them for you.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
-------------------------------------------------------------------------------------> 
### 🎨 Vercel 风格设计规范 (The Geist Style)

**核心设计哲学：**
**“工业级的极简主义 (Industrial Minimalism)。”**
Vercel 的界面不是为了“好看”而设计的，而是为了**效率、清晰度和高性能**。它给人的感觉是精密的、数学化的、以开发者为中心的。每一个像素都有其存在的理由。

#### 1. 色彩体系：关于“黑”的五种层次
Vercel 的暗色模式不是纯黑，而是**基于边框和层级**的深灰色阶。

*   **背景 (Background):** 纯黑 (`#000000`) 或极深灰 (`#0A0A0A`)。
*   **表面/卡片 (Surfaces):** 透明或极低透明度的背景，通过 **1px 的边框**来区分，而不是靠背景色块。
*   **边框 (Borders):** 这是灵魂。使用非常细微的灰色 (`#333333` 或 `rgba(255,255,255,0.15)`)。**Vercel 的层次感 90% 来自于边框，而不是阴影。**
*   **文字 (Typography Colors):**
    *   主要标题：纯白 (`#FFFFFF`)。
    *   次要信息/描述：中灰 (`#888888` 或 `#A1A1A1`)。
    *   低优先级/占位符：深灰 (`#444444`)。
*   **强调色 (Accents):** 极度克制。只有 Logo、Status（状态点）或选中的 Focus 状态才会出现颜色（通常是白色发光、Vercel 绿、或者错误红）。

#### 2. 布局与空间 (Layout & Spacing)
*   **网格系统 (Grid):** 严格对齐。卡片之间有固定的间距（通常是 16px 或 24px）。
*   **留白 (Whitespace):** 内部留白（Padding）要大方。卡片内部内容不要贴边，通常保持 `p-6` (24px) 或 `p-4` (16px) 的内边距。
*   **密集度:** 即使留白多，信息密度依然很高（Information Dense），通过小字号和紧凑的行高实现。

#### 3. 字体排印 (Typography)
*   **字体家族:** 使用 **Inter** 或 Vercel 自家的 **Geist Sans**。这是一种无衬线字体，具有极高的可读性。
*   **代码字体:** Commit Hash（如 `8c5a2b`）、分支名（`main`）必须使用等宽字体（Monospace），如 **Geist Mono** 或 **Fira Code**。
*   **字重与字号:**
    *   标题：小而粗（Bold, 14px-16px）。不要用巨大的标题，Vercel 倾向于用字重区分层级。
    *   正文：小（Regular, 13px-14px）。
    *   辅助文本：极小（12px）。
*   **字间距 (Tracking):** 稍微收紧 (`tracking-tight`)，让文本块看起来更结实。

#### 4. UI 组件特征 (Component Details)
*   **卡片 (Cards):**
    *   圆角：小圆角，通常是 `rounded-md` (6px) 或 `rounded-lg` (8px)。绝对不要用全圆角（Pill shape）。
    *   交互：Hover 时边框颜色变亮（从 `#333` 变为 `#888` 或白色），或者背景极其轻微地变亮。
*   **按钮 (Buttons):**
    *   主按钮：白底黑字（高对比度）。
    *   次级按钮：黑底、白字、细灰边框（Ghost/Outline style）。
    *   高度：通常较矮，给人一种紧凑的工具感（height: 32px 或 40px）。
*   **图标 (Icons):**
    *   使用细线条图标（Stroke width 1.5px 或 1px）。
    *   图标通常是灰色的，Hover 时变白。

---

### 👩‍💻 给 React 开发者的具体复刻指令

如果我是你的 Tech Lead，我会这样给你下达 Ticket：

> “嘿，我们要复刻 Vercel 的 Dashboard。不要引入 Ant Design 或 Material UI，那些太重了。请使用 **React + Tailwind CSS**。
>
> **关键实现细节：**
>
> 1.  **全局样式：** 页面背景设为 `bg-black`，全局文字设为 `text-gray-100`，字体设为 `font-sans antialiased`。
> 2.  **边框优先策略：** 任何卡片**不要用背景色区分**，要用边框。
>     *   CSS: `border border-gray-800 bg-black hover:border-gray-500 transition-colors duration-200`。
> 3.  **导航栏：** 固定在顶部，背景使用 `bg-black/50` 加上 `backdrop-blur-md` (毛玻璃效果)，底部加一条 `border-b border-gray-800`。
> 4.  **徽章 (Badges):** 比如那个 `Hobby` 标签。
>     *   样式：`text-xs px-2 py-0.5 rounded-full border border-gray-700 bg-gray-900 text-gray-400`。
> 5.  **Git 信息：** 那个分支图标和 Commit ID。
>     *   使用 Flexbox 对齐。
>     *   图标大小 `w-4 h-4`。
>     *   字体：`font-mono text-xs text-gray-500`。
> 6.  **Avatar 堆叠：** 项目图标（如 Next.js Logo）通常是圆形的，背景白色，居中黑色图标。
>
> **记住：** 如果你觉得界面看起来‘太乱’，通常是因为灰色用得太多太杂。保持克制，主要只用三种灰（边框灰、正文灰、辅助灰）。让黑色保持纯净。”

### 🧩 视觉参考代码 (Tailwind CSS 示例)

你可以直接给她这段代码片段作为“卡片”样式的基准：

```jsx
// ProjectCard.jsx
const ProjectCard = ({ name, domain, time, branch, commit }) => {
  return (
    <div className="group flex flex-col justify-between p-5 rounded-lg border border-[#333] bg-black hover:border-gray-400 transition-all duration-200 cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 border border-gray-700 flex items-center justify-center">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-white"></div>
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-100">{name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{domain}</p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-xs text-gray-400 space-y-2">
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-gray-600"></span>
           <span>{time}</span>
           <span className="text-gray-600">on</span>
           <span className="font-mono text-gray-300 bg-gray-900 px-1 py-0.5 rounded border border-gray-800">
             {branch}
           </span>
        </div>
        <p className="truncate text-gray-500">{commit}</p>
      </div>
    </div>
  );
};
```