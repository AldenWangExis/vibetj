/**
 * map/layout.tsx - 地图页面专属布局
 *
 * 布局策略:
 * - 使用 absolute positioning 覆盖全局 Footer
 * - 顶部保留 Header (h-16)
 * - 底部不显示 Footer，提供全屏地图体验
 *
 * 规范: docs/02_tds.md Section 3.3
 */
export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    // top-16 对应 header 高度 (64px)
    // z-20 确保在 Footer 之上
    <div className="absolute inset-0 top-16 z-20 bg-background">{children}</div>
  );
}
