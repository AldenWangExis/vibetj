"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface SimpleMarkdownProps {
  content: string;
  className?: string;
}

/**
 * SimpleMarkdown - 轻量级 Markdown 渲染组件
 *
 * 支持:
 * - 有序列表 (1. 2. 3.)
 * - 无序列表 (- * +)
 * - 换行
 *
 * 样式: 适配工业极简风格，使用 Mono 字体
 */
export function SimpleMarkdown({ content, className }: SimpleMarkdownProps) {
  return (
    <div className={cn("font-mono text-xs text-text-muted", className)}>
      <ReactMarkdown
        components={{
          // 有序列表
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 ml-2">{children}</ol>
          ),
          // 无序列表
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 ml-2">{children}</ul>
          ),
          // 列表项
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          // 段落
          p: ({ children }) => <p className="leading-relaxed mb-2 last:mb-0">{children}</p>,
          // 换行
          br: () => <br />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
