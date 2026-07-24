import { COASTLINE } from './coastline'
import { smoothPath } from './geometry'
import type { Projection } from './projection'

interface Props {
  project: Projection
  width: number
  height: number
  gradientId: string
}

/** 바다 / 육지 / 격자 / 산 실루엣 등 지도 배경 레이어 */
export default function MapBackground({ project, width, height, gradientId }: Props) {
  const coastPoints = COASTLINE.map(([lat, lng]) => project(lat, lng))
  const coastPath = smoothPath(coastPoints)
  const lastY = coastPoints[coastPoints.length - 1][1]
  const seaPath = `${coastPath} L ${width + 200},${lastY} L ${width + 200},${-200} L ${
    width + 200
  },${height + 200} Z`

  return (
    <>
      <defs>
        <pattern id={`${gradientId}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 L0 0 0 40" fill="none" stroke="rgba(20,23,28,.05)" strokeWidth="1" />
        </pattern>
        <linearGradient id={`${gradientId}-sea`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cfe6ff" />
          <stop offset="100%" stopColor="#a7d0f7" />
        </linearGradient>
      </defs>

      <rect width={width} height={height} fill="#eef2ec" />
      <rect width={width} height={height} fill={`url(#${gradientId}-grid)`} />
      <path d={seaPath} fill={`url(#${gradientId}-sea)`} />
      <path d={coastPath} fill="none" stroke="#7fb6e6" strokeWidth="2.5" />

      <g opacity="0.35" fill="#c9d8c4">
        <path d="M40 220 l60 -80 l55 80 z" />
        <path d="M110 240 l75 -105 l70 105 z" />
        <path d="M60 420 l50 -66 l46 66 z" />
      </g>
    </>
  )
}
