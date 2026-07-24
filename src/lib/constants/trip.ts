import type { CompanionType, SlotType, TransportMode, TripPace } from '@/types'

export const COMPANION_LABEL: Record<CompanionType, string> = {
  solo: '혼자',
  couple: '커플',
  family: '가족',
  friends: '친구',
}

export const COMPANION_OPTIONS: { id: CompanionType; label: string }[] = [
  { id: 'solo', label: '혼자' },
  { id: 'couple', label: '커플' },
  { id: 'family', label: '가족' },
  { id: 'friends', label: '친구' },
]

export const TRANSPORT_LABEL: Record<TransportMode, string> = {
  car: '자차',
  transit: '대중교통',
}

export const TRANSPORT_OPTIONS: { id: TransportMode; icon: 'car' | 'walk'; label: string }[] = [
  { id: 'car', icon: 'car', label: '자차' },
  { id: 'transit', icon: 'walk', label: '대중교통' },
]

export const PACE_OPTIONS: { id: TripPace; label: string; sub: string }[] = [
  { id: 'relaxed', label: '여유롭게', sub: '3~4곳' },
  { id: 'normal', label: '적당하게', sub: '5~6곳' },
  { id: 'packed', label: '알차게', sub: '7곳+' },
]

export const THEME_OPTIONS = [
  '바다',
  '카페',
  '맛집',
  '산책',
  '자연',
  '전시',
  '액티비티',
  '야경',
  '시장',
]

export const SLOT_META: Record<SlotType, { label: string; className: string }> = {
  meal: { label: '식사', className: 'bg-coral-50 text-coral-600' },
  activity: { label: '일정', className: 'bg-brand-50 text-brand-600' },
  stay: { label: '숙박', className: 'bg-ink-900 text-white' },
}

/** 지도 마커 색 (Day 구분) */
export const DAY_COLORS = ['#0e7c86', '#ff6b4a', '#8e6a26', '#0a6470']
