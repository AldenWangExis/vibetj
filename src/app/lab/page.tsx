/**
 * app/lab/page.tsx - 实验室页面 (Lab Page)
 *
 * 核心功能:
 * - 预留的扩展页面
 *
 * 架构设计:
 * - Server Component (静态内容)
 *
 * 作者: ZHWA | 创建: 2024-11-26
 * 规范: docs/01_tds.md, docs/01_urs.md
 */

export default function LabPage() {
  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-text-primary">Lab</h1>
          <p className="mx-auto max-w-[700px] text-lg text-text-secondary">
            Experimental features and prototypes
          </p>
        </div>

        <div className="mx-auto max-w-[600px] rounded-lg border border-border bg-surface p-8">
          <p className="text-text-secondary">
            This page is reserved for future experimental features.
          </p>
        </div>
      </div>
    </div>
  );
}
