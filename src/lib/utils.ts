/**
 * lib/utils.ts - 工具函数集合
 * 
 * 核心导出:
 * - cn: Tailwind CSS 类名合并工具
 * 
 * 作者: ZHWA | 创建: 2024-11-26
 * 规范: docs/01_tds.md
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并 Tailwind CSS 类名，处理冲突
 * 
 * @example
 * cn("px-2 py-1", "px-4") // => "py-1 px-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

