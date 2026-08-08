import type { TripCondition } from '@/types'

export const DEFAULT_CONDITION: TripCondition = {
  cities: ['강릉', '속초'],
  startDate: '2026-08-12',
  endDate: '2026-08-13',
  transport: 'car',
  companion: 'couple',
  themes: ['카페', '바다', '맛집'],
  pace: 'normal',
}

/** 배포 기본값: 빈 상태에서 시작 — 링크 분석으로 장소를 담으면서 채워진다. */
export const INITIAL_CANDIDATE_IDS: string[] = []

export const INITIAL_ANALYZED_IDS: string[] = []
