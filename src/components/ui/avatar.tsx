/**
 * components/ui/avatar.tsx - 头像组件 (Shadcn/ui)
 * 
 * 核心导出:
 * - Avatar: 头像容器
 * - AvatarImage: 头像图片 (支持 asChild prop)
 * - AvatarFallback: 头像加载失败时的占位符
 * 
 * 技术实现:
 * - 使用 @radix-ui/react-slot 支持 asChild prop
 * - asChild=true 时，将样式应用到子元素而不是包裹元素
 * 
 * 作者: ZHWA | 创建: 2024-11-26 | 修改: 2025-11-26
 * 规范: docs/01_tds.md
 */

"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  asChild?: boolean;
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "img";
    return (
      <Comp
        ref={ref}
        className={cn("aspect-square h-full w-full object-cover", className)}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-text-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };

