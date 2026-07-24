import { useMemo, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { DAYTIME_MOODS, MOODS, type Mood } from './moods'
import { createRandom, pick } from './random'
import { renderScene } from './scenes'
import type { SceneContext, SceneKind } from './types'

const VIEW_W = 320
const VIEW_H = 200

export interface PhotoProps {
  /** 같은 seed는 항상 같은 그림 */
  seed: string
  kind?: SceneKind
  mood?: Mood
  className?: string
  children?: ReactNode
}

/**
 * 실제 사진(관광공사 이미지 API) 연동 전 단계의 일러스트 풍경.
 * 씬 구현은 scenes.tsx, 색은 moods.ts로 분리되어 있습니다.
 */
export default function Photo({ seed, kind = 'beach', mood, className, children }: PhotoProps) {
  const scene = useMemo(() => buildScene(seed, kind, mood), [seed, kind, mood])

  return (
    <div className={cn('relative overflow-hidden bg-ink-100', className)}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {scene}
      </svg>
      {children}
    </div>
  )
}

function buildScene(seed: string, kind: SceneKind, forcedMood?: Mood) {
  const rand = createRandom(seed)
  const mood: Mood = forcedMood ?? (kind === 'night' ? 'night' : pick(DAYTIME_MOODS, rand))
  const palette = MOODS[mood]
  const gid = `ph-${Math.floor(rand() * 1e9)}`

  const sky = (
    <>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.skyTop} />
          <stop offset="100%" stopColor={palette.skyBottom} />
        </linearGradient>
        <linearGradient id={`${gid}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.sea[0]} />
          <stop offset="100%" stopColor={palette.sea[1]} />
        </linearGradient>
      </defs>
      <rect width={VIEW_W} height={VIEW_H} fill={`url(#${gid})`} />
    </>
  )

  const sunX = 40 + rand() * 240
  const sunY = 28 + rand() * 26
  const sun = (
    <g>
      <circle cx={sunX} cy={sunY} r="26" fill={palette.sun} opacity="0.25" />
      <circle cx={sunX} cy={sunY} r={mood === 'night' ? 11 : 15} fill={palette.sun} />
    </g>
  )

  const clouds = Array.from({ length: 3 }, (_, i) => {
    const cx = rand() * VIEW_W
    const cy = 20 + rand() * 40
    const s = 0.6 + rand() * 0.7
    return (
      <g key={`cloud-${i}`} opacity={mood === 'night' ? 0.18 : 0.5}>
        <ellipse cx={cx} cy={cy} rx={26 * s} ry={7 * s} fill="#fff" />
        <ellipse cx={cx + 14 * s} cy={cy - 4 * s} rx={16 * s} ry={6 * s} fill="#fff" />
      </g>
    )
  })

  const stars =
    mood === 'night'
      ? Array.from({ length: 22 }, (_, i) => (
          <circle
            key={`star-${i}`}
            cx={rand() * VIEW_W}
            cy={rand() * 90}
            r={rand() * 1.2 + 0.4}
            fill="#fff"
            opacity={0.4 + rand() * 0.5}
          />
        ))
      : null

  const ctx: SceneContext = {
    rand,
    mood,
    palette,
    gid,
    width: VIEW_W,
    height: VIEW_H,
    sky,
    sun,
    clouds,
    stars,
  }

  return renderScene(kind, ctx)
}
