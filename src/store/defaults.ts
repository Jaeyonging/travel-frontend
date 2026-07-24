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

/** 데모용: SNS 분석을 이미 한 번 끝낸 상태로 시작합니다. */
export const INITIAL_CANDIDATE_IDS = [
  'p-anmok',
  'p-chodang',
  'p-jungang-market',
  'p-terarosa',
  'p-sokcho-beach',
  'p-abai',
  'p-oeongchi',
  'p-seoraksan',
  'p-ulsanbawi',
]

export const INITIAL_ANALYZED_IDS = ['sns-1', 'sns-2', 'sns-3', 'sns-4']
