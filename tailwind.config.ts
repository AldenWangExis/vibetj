import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 自定义 "光落心间" 色系
        zen: {
          50:  '#F6ECE3', // 最浅背景 (温暖米白) - 适合网页大背景
          100: '#E8DAD2', // 次浅 - 适合卡片背景或输入框背景
          200: '#D5CAC2', // 装饰线条
          300: '#C1B9B7',
          400: '#ADA8AF', // 禁用状态文字
          500: '#9A97A3', // 次要文字
          600: '#8A8692',
          700: '#7A7681',
          800: '#6A6671', // 正文颜色
          900: '#5A5560', // 最深 (主标题/强调色/按钮背景) - 深紫灰
        },
      },
      // 推荐配合圆角，增加柔和感
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
};
export default config;