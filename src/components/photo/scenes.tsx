import type { SceneContext, SceneKind, SceneRenderer } from './types'

const beach: SceneRenderer = ({ rand, palette, gid, width: W, height: H, mood, sky, sun, clouds, stars }) => {
  const horizon = 96 + rand() * 12
  return (
    <>
      {sky}
      {stars}
      {sun}
      {clouds}
      <path
        d={`M -10 ${horizon} q 40 -18 92 -8 q 40 8 60 8 z`}
        fill={palette.land[1]}
        opacity="0.75"
      />
      <rect y={horizon} width={W} height={H - horizon} fill={`url(#${gid}-sea)`} />
      {Array.from({ length: 4 }, (_, i) => (
        <path
          key={i}
          d={`M ${-20 + rand() * 40} ${horizon + 14 + i * 15} q 30 -6 60 0 t 60 0 t 60 0 t 60 0 t 60 0`}
          stroke={palette.haze}
          strokeWidth="2"
          fill="none"
          opacity={0.8 - i * 0.12}
        />
      ))}
      <path
        d={`M -10 ${H} L -10 ${H - 34} q 90 -16 170 4 q 90 20 170 6 L ${W + 10} ${H} Z`}
        fill={mood === 'night' ? '#3b3730' : '#f0e2c8'}
      />
      <path
        d={`M -10 ${H - 32} q 90 -16 170 4 q 90 20 170 6`}
        stroke={palette.haze}
        strokeWidth="3"
        fill="none"
      />
    </>
  )
}

const mountain: SceneRenderer = ({ rand, palette, width: W, height: H, sky, sun, clouds, stars }) => {
  const ridges = [
    { y: 96, fill: palette.land[0], o: 0.55, amp: 34 },
    { y: 116, fill: palette.land[0], o: 0.8, amp: 44 },
    { y: 138, fill: palette.land[1], o: 1, amp: 52 },
  ]
  return (
    <>
      {sky}
      {stars}
      {sun}
      {clouds}
      {ridges.map((rg, i) => {
        const peaks = 3 + Math.floor(rand() * 2)
        let d = `M -10 ${H} L -10 ${rg.y}`
        for (let p = 0; p <= peaks; p++) {
          const x = (-10 + ((W + 20) / peaks) * p) | 0
          const py = rg.y - (p % 2 === 0 ? rg.amp * (0.6 + rand() * 0.6) : rg.amp * 0.25)
          d += ` L ${x} ${py.toFixed(1)}`
        }
        d += ` L ${W + 10} ${rg.y} L ${W + 10} ${H} Z`
        return <path key={i} d={d} fill={rg.fill} opacity={rg.o} />
      })}
      <g fill={palette.land[1]} opacity="0.95">
        {Array.from({ length: 7 }, (_, i) => {
          const x = 12 + i * 46 + rand() * 14
          const h = 16 + rand() * 14
          return <path key={i} d={`M ${x} ${H} L ${x - 7} ${H} L ${x} ${H - h} L ${x + 7} ${H} Z`} />
        })}
      </g>
    </>
  )
}

const market: SceneRenderer = ({ rand, palette, width: W, height: H, mood, sky, clouds, stars }) => {
  const cols = 6
  return (
    <>
      {sky}
      {stars}
      {clouds}
      <path
        d={`M -10 ${H} L -10 120 Q ${W / 2} 96 ${W + 10} 122 L ${W + 10} ${H} Z`}
        fill={palette.land[0]}
        opacity="0.5"
      />
      {Array.from({ length: cols }, (_, i) => {
        const bw = W / cols
        const x = i * bw
        const top = 108 + rand() * 26
        return (
          <g key={i}>
            <rect x={x + 3} y={top} width={bw - 6} height={H - top} rx="3" fill="#f0e6d8" />
            <rect
              x={x + 3}
              y={top}
              width={bw - 6}
              height="9"
              fill={i % 2 === 0 ? '#ff6b4a' : '#0e7c86'}
            />
            {Array.from({ length: 3 }, (_, k) => (
              <rect
                key={k}
                x={x + 9 + k * 13}
                y={top + 18}
                width="8"
                height="10"
                rx="1.5"
                fill={mood === 'night' ? '#ffd98a' : '#c8bcab'}
              />
            ))}
          </g>
        )
      })}
      <g>
        {Array.from({ length: 8 }, (_, i) => (
          <circle
            key={i}
            cx={18 + i * 40}
            cy={104 + (i % 2) * 4}
            r="3.5"
            fill={mood === 'night' ? '#ffe9a8' : '#fff'}
            opacity="0.9"
          />
        ))}
      </g>
    </>
  )
}

const cafe: SceneRenderer = ({ palette, gid, width: W, height: H, mood }) => {
  const warm = mood === 'night' ? '#3a2a24' : '#f0e3d2'
  return (
    <>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.skyTop} />
          <stop offset="100%" stopColor={palette.skyBottom} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={warm} />
      <rect x="24" y="20" width="130" height="120" rx="65" fill={`url(#${gid})`} />
      <path d="M24 100 h130 v40 h-130 z" fill={palette.sea[0]} opacity="0.85" />
      <rect
        x="20"
        y="16"
        width="138"
        height="128"
        rx="69"
        fill="none"
        stroke="#00000018"
        strokeWidth="6"
      />
      <rect x="0" y="140" width={W} height="60" fill={mood === 'night' ? '#2a1e1a' : '#dcc9b0'} />
      <g transform="translate(215,96)">
        <path d="M0 22 h44 l-5 30 h-34 z" fill="#fff" />
        <path d="M44 28 a10 10 0 1 1 0 16" fill="none" stroke="#fff" strokeWidth="5" />
        <path d="M12 12 q6 -8 0 -16" stroke="#ffffff90" strokeWidth="3" fill="none" />
        <path d="M24 12 q6 -8 0 -16" stroke="#ffffff90" strokeWidth="3" fill="none" />
      </g>
      <g transform="translate(178,120)" opacity="0.9">
        <path d="M6 40 v-22" stroke="#4d7256" strokeWidth="3" />
        <ellipse cx="0" cy="14" rx="9" ry="5" fill="#4d7256" transform="rotate(-25 0 14)" />
        <ellipse cx="13" cy="10" rx="9" ry="5" fill="#5f8a68" transform="rotate(25 13 10)" />
      </g>
    </>
  )
}

const hanok: SceneRenderer = ({ palette, width: W, height: H, sky, sun, clouds, stars }) => (
  <>
    {sky}
    {stars}
    {sun}
    {clouds}
    <path
      d={`M -10 ${H} L -10 138 Q ${W / 2} 118 ${W + 10} 140 L ${W + 10} ${H} Z`}
      fill={palette.land[1]}
      opacity="0.6"
    />
    <g transform="translate(50,74)">
      <path
        d="M0 46 Q110 8 220 46 Q190 30 110 26 Q30 30 0 46 Z"
        fill="#5b4a42"
        transform="translate(-20,0) scale(0.95)"
      />
      <rect x="14" y="46" width="192" height="52" fill="#efe3d0" />
      <g fill="#7a6250">
        {Array.from({ length: 5 }, (_, i) => (
          <rect key={i} x={26 + i * 38} y="52" width="26" height="40" rx="2" />
        ))}
      </g>
      <rect x="8" y="96" width="204" height="8" rx="2" fill="#6a5546" />
    </g>
  </>
)

const night: SceneRenderer = ({ rand, palette, width: W, height: H, sky, stars }) => {
  const moonX = 40 + rand() * 240
  const moonY = 28 + rand() * 26
  return (
    <>
      {sky}
      {stars}
      <circle cx={moonX} cy={moonY} r="13" fill="#eef3fa" />
      <path
        d={`M -10 ${H} L -10 132 Q ${W / 2} 112 ${W + 10} 134 L ${W + 10} ${H} Z`}
        fill={palette.land[1]}
      />
      {Array.from({ length: 5 }, (_, i) => {
        const x = 24 + i * 58
        const h = 40 + rand() * 40
        return (
          <g key={i}>
            <rect x={x} y={H - h - 40} width="40" height={h + 40} rx="3" fill="#1c2b3c" />
            {Array.from({ length: 8 }, (_, k) => (
              <rect
                key={k}
                x={x + 6 + (k % 3) * 11}
                y={H - h - 32 + Math.floor(k / 3) * 13}
                width="7"
                height="8"
                fill={rand() > 0.35 ? '#ffd98a' : '#33465c'}
              />
            ))}
          </g>
        )
      })}
    </>
  )
}

export const SCENES: Record<SceneKind, SceneRenderer> = {
  beach,
  mountain,
  market,
  cafe,
  hanok,
  night,
}

export function renderScene(kind: SceneKind, ctx: SceneContext) {
  return (SCENES[kind] ?? beach)(ctx)
}
