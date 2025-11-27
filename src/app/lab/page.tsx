/**
 * app/lab/page.tsx - 实验室页面 (Lab Page)
 *
 * 核心功能:
 * - 预留的扩展页面
 *
 * 架构设计:
 * - Server Component (静态内容)
 *
 * 作者: Alden | 创建: 2025-11-26 | 修改: 2025-11-27
 * 规范: docs/01_tds.md, docs/01_urs.md
 */

import { FlaskConical } from "lucide-react";

export default function LabPage() {
  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-20 sm:py-32">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div className="space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface border border-border mb-4">
            <FlaskConical className="h-6 w-6 text-text-secondary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 sm:text-5xl">
            Lab
          </h1>
          <p className="mx-auto max-w-[600px] text-lg text-text-secondary font-light">
            Experimental features and prototypes. Nothing here yet.
          </p>
        </div>

        <div className="mx-auto w-full max-w-[600px] rounded-lg border border-border-dashed bg-surface/30 p-12 backdrop-blur-sm">
          <p className="text-text-secondary text-sm font-mono">
            &#47;&#47; TODO: Implement cool stuff here...
          </p>
        </div>
      </div>
    </div>
  );
}
