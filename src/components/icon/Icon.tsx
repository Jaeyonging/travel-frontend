import { ICON_PATHS, type IconName } from './icon-paths'

export interface IconProps {
  name: IconName
  size?: number
  className?: string
  strokeWidth?: number
  filled?: boolean
}

export default function Icon({
  name,
  size = 20,
  className = '',
  strokeWidth = 1.7,
  filled = false,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICON_PATHS[name].map((p, i) => (
        <path key={i} d={p.d} fill={filled && i === 0 ? 'currentColor' : 'none'} />
      ))}
    </svg>
  )
}
