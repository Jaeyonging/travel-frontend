import { BASE_LATITUDE } from './coastline'

export type Point = [number, number]
export type Projection = (lat: number, lng: number) => Point

interface Bounds {
  points: { lat: number; lng: number }[]
  width: number
  height: number
  /** 여백 비율 */
  padding?: number
}

/**
 * 주어진 좌표들이 모두 들어가도록 하는 단순 정사각 투영.
 * 위도에 따른 경도 축소를 보정해 실제 지도와 비슷한 비율을 유지합니다.
 */
export function createProjection({ points, width, height, padding = 0.35 }: Bounds): Projection {
  const k = Math.cos((BASE_LATITUDE * Math.PI) / 180)
  const projected = points.map((p) => [p.lng * k, -p.lat] as Point)
  if (projected.length === 0) projected.push([128.8 * k, -38])

  const xs = projected.map((p) => p[0])
  const ys = projected.map((p) => p[1])

  let minX = Math.min(...xs)
  let maxX = Math.max(...xs)
  let minY = Math.min(...ys)
  let maxY = Math.max(...ys)

  const padX = Math.max(maxX - minX, 0.06) * padding
  const padY = Math.max(maxY - minY, 0.06) * padding
  minX -= padX
  maxX += padX
  minY -= padY
  maxY += padY

  const scale = Math.min(width / (maxX - minX), height / (maxY - minY))
  const offX = (width - (maxX - minX) * scale) / 2
  const offY = (height - (maxY - minY) * scale) / 2

  return (lat, lng) => [(lng * k - minX) * scale + offX, (-lat - minY) * scale + offY]
}
