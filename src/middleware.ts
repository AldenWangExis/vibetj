/**
 * middleware.ts - 全局中间件 (Edge Runtime)
 *
 * 核心功能:
 * - 路由守卫
 * - 请求日志
 * - 性能监控
 *
 * 架构设计:
 * - Edge Runtime (轻量化)
 * - 在请求到达页面前执行
 *
 * 使用场景:
 * - 路由重定向
 * - 请求拦截
 * - A/B 测试
 *
 * 作者: ZHWA | 创建: 2025-11-26
 * 规范: docs/01_tds.md
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 记录请求日志（开发环境）
  if (process.env.NODE_ENV === "development") {
    console.log(`[Middleware] ${request.method} ${pathname}`);
  }

  // 示例：重定向旧路由到新路由
  // if (pathname === "/team") {
  //   return NextResponse.redirect(new URL("/members", request.url));
  // }

  // 示例：阻止访问特定路由
  // if (pathname.startsWith("/admin")) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // 添加自定义响应头
  const response = NextResponse.next();

  // 安全头
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

// 配置中间件匹配规则
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
