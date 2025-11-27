import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1. 字体排印 (Typography)
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-geist-mono)", "Fira Code", ...defaultTheme.fontFamily.mono],
      },
      letterSpacing: {
        tight: "-0.025em",
        wide: "0.025em", // 用于全大写的小标签
      },

      // 2. 色彩体系 (The Black Hierarchy & Engineering Colors)
      colors: {
        background: "#000000",
        surface: "#0A0A0A", // 主要卡片背景
        surfaceHighlight: "#111111", // Hover 后的背景亮色

        // 边框体系
        border: {
          DEFAULT: "#333333",
          subtle: "rgba(255,255,255,0.08)", // 极细微的分隔线
          hover: "#888888",
          active: "#FFFFFF", // 选中/高亮状态
        },

        // 文字层级
        text: {
          primary: "#FFFFFF",
          secondary: "#888888",
          muted: "#444444",
          code: "#D4D4D4", // 代码块文字颜色
        },

        // 强调色 (状态指示器)
        accent: {
          blue: "#0070F3",
          red: "#FF0000",
          green: "#00FF94", // Online / Success
          amber: "#FFB020", // Warning / Pending
        },
      },

      // 3. 背景纹理与图案
      backgroundImage: {
        // 极细的网格背景 (使用 SVG data URI)
        "grid-pattern": `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgba(255,255,255,0.03)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        // 胶片噪点 (用于 overlay)
        "noise-pattern": `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
        // 聚光灯渐变 (Spotlight)
        "spotlight-gradient": "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)",
      },

      // 4. 动画系统 (Motion Design)
      animation: {
        "radar-spin": "radar-spin 3s linear infinite", // 雷达扫描
        "cursor-blink": "cursor-blink 1s step-end infinite", // 打字机光标
        "grid-breath": "grid-breath 8s ease-in-out infinite", // 网格呼吸
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite", // 慢速呼吸（用于状态点）
      },
      keyframes: {
        "radar-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "cursor-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "grid-breath": {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "0.5" },
        },
      },

      // 5. UI 组件特征
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      transitionDuration: {
        "400": "400ms", // 稍微慢一点的过渡，更有质感
      },
    },
  },
  plugins: [],
};
export default config;