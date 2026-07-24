import type { Point } from './projection'

export interface MapMarkerProps {
  point: Point
  label: string
  index: number
  color: string
  active?: boolean
  showLabel?: boolean
  onClick?: () => void
}

export default function MapMarker({
  point,
  label,
  index,
  color,
  active = false,
  showLabel = true,
  onClick,
}: MapMarkerProps) {
  const [x, y] = point
  const labelWidth = label.length * 6.6 + 12

  return (
    <g
      transform={`translate(${x},${y})`}
      className={onClick ? 'cursor-pointer' : undefined}
      onClick={onClick}
    >
      {active && (
        <circle r="22" fill={color} opacity="0.18">
          <animate attributeName="r" values="16;26;16" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      <circle r="14" fill="white" stroke={color} strokeWidth="3" />
      <text textAnchor="middle" dy="4.5" fontSize="13" fontWeight="700" fill={color}>
        {index}
      </text>
      {showLabel && (
        <g transform={`translate(0,${index % 2 === 1 ? 33 : -25})`}>
          <rect
            x={-labelWidth / 2}
            y={-13}
            width={labelWidth}
            height={22}
            rx={11}
            fill="white"
            opacity="0.92"
          />
          <text textAnchor="middle" dy="2.5" fontSize="12" fontWeight="600" fill="#3a4049">
            {label}
          </text>
        </g>
      )}
    </g>
  )
}
