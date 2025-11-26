import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"], // 支持手动切换深色模式
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1. 字体排印 (Typography)
      // 优先使用 Next.js 的 Geist 变量，回退到 Inter/Fira Code
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-geist-mono)", "Fira Code", ...defaultTheme.fontFamily.mono],
      },
      // 默认收紧字间距，符合 "Industrial" 紧凑感
      letterSpacing: {
        tight: "-0.025em", 
      },

      // 2. 色彩体系 (The Black Hierarchy)
      colors: {
        // 背景层级
        background: "#000000", // 纯黑背景
        surface: "#0A0A0A",    // 卡片/表面背景 (极深灰)

        // 边框体系 (灵魂所在)
        border: {
          DEFAULT: "#333333", // 标准边框 (1px border)
          subtle: "rgba(255,255,255,0.15)", // 次要边框
          hover: "#888888",   // Hover 状态加深
          highlight: "#FFFFFF", // 选中状态
        },

        // 文字层级
        text: {
          primary: "#FFFFFF",   // 标题 (纯白)
          secondary: "#888888", // 次要信息 (中灰)
          muted: "#444444",     // 占位符/低优先级 (深灰)
        },

        // 强调色 (Accents - 极度克制)
        accent: {
          blue: "#0070F3", // Vercel Blue
          red: "#EE0000",  // Error
          green: "#00FF94", // Success (Turbo Green)
        },
      },

      // 3. UI 组件特征
      borderRadius: {
        lg: "8px", // 卡片圆角
        md: "6px", // 按钮/小卡片圆角
        sm: "4px", // 极小元素
      },
      
      // 扩展动画 (可选，用于卡片 Hover)
      transitionDuration: {
        "200": "200ms",
      },
    },
  },
  plugins: [],
};
export default config;