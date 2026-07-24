import { useId, useMemo } from 'react'
import type { Place } from '@/types'
import MapBackground from './MapBackground'
import MapMarker from './MapMarker'
import { smoothPath, spreadOverlapping } from './geometry'
import { createProjection } from './projection'
import { useMapSize } from './useMapSize'

export interface MapMarkerInput {
  place: Place
  index?: number
  color?: string
  active?: boolean
}

export interface MockMapProps {
  markers: MapMarkerInput[]
  /** 마커를 순서대로 잇는 동선 표시 */
  route?: boolean
  height?: number
  showLabels?: boolean
  onSelect?: (placeId: string) => void
}

const DEFAULT_COLOR = '#0e7c86'

/**
 * 카카오지도 API 연동 전 단계의 목업 지도.
 * 실제 위경도를 그대로 투영하므로 장소 간 상대 위치는 실제와 동일합니다.
 */
export default function MockMap({
  markers,
  route = false,
  height = 420,
  showLabels = true,
  onSelect,
}: MockMapProps) {
  const { ref, width } = useMapSize()
  const gradientId = useId().replace(/:/g, '')

  const { project, points } = useMemo(() => {
    const projection = createProjection({
      points: markers.map((m) => m.place),
      width,
      height,
    })
    const projected = markers.map((m) => projection(m.place.lat, m.place.lng))
    return { project: projection, points: spreadOverlapping(projected, width, height) }
  }, [markers, width, height])

  const routePath = route && points.length > 1 ? smoothPath(points) : null

  return (
    <div ref={ref} className="relative overflow-hidden bg-[#eef2ec]" style={{ height }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        <MapBackground
          project={project}
          width={width}
          height={height}
          gradientId={gradientId}
        />

        {routePath && (
          <>
            <path
              d={routePath}
              fill="none"
              stroke="rgba(14,124,134,.22)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d={routePath}
              fill="none"
              stroke={DEFAULT_COLOR}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="9 8"
              className="animate-draw-line"
            />
          </>
        )}

        {markers.map((marker, i) => (
          <MapMarker
            key={marker.place.id}
            point={points[i]}
            label={marker.place.name}
            index={marker.index ?? i + 1}
            color={marker.color ?? DEFAULT_COLOR}
            active={marker.active}
            showLabel={showLabels}
            onClick={onSelect ? () => onSelect(marker.place.id) : undefined}
          />
        ))}
      </svg>

      <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[10.5px] font-bold text-ink-500 backdrop-blur">
        카카오지도 연동 예정 · 목업
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-lg bg-white/92 text-ink-500 shadow-sm">
        {['＋', '－'].map((t) => (
          <span key={t} className="flex h-7 w-7 items-center justify-center text-sm font-bold">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
