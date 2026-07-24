import type { ReactNode } from 'react'
import type { Mood, MoodPalette } from './moods'

export type SceneKind = 'beach' | 'mountain' | 'market' | 'cafe' | 'hanok' | 'night'

/** 씬 그리기에 필요한 공통 재료 */
export interface SceneContext {
  /** 0~1 난수 (seed 고정) */
  rand: () => number
  mood: Mood
  palette: MoodPalette
  /** 그라디언트 id 접두사 (문서 내 충돌 방지) */
  gid: string
  width: number
  height: number
  sky: ReactNode
  sun: ReactNode
  clouds: ReactNode
  stars: ReactNode
}

export type SceneRenderer = (ctx: SceneContext) => ReactNode
