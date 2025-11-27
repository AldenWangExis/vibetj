/**
 * map/page.tsx - 地图主页面 (Server Component)
 *
 * 职责:
 * - 数据预取 (Initial Data Fetching)
 * - 渲染客户端容器
 *
 * 缓存策略:
 * - ISR (Incremental Static Regeneration): 1小时
 *
 * 规范: docs/02_tds.md Section 3.2
 */

import { mapService } from "@/services/mapService";
import { MapClientWrapper } from "@/components/features/map/MapClientWrapper";

// ISR 缓存策略: 1小时重新验证
export const revalidate = 3600;

export default async function MapPage() {
  // 预取所有标记数据
  const markers = await mapService.getAllMarkers();

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      <MapClientWrapper initialMarkers={markers} />
    </div>
  );
}
