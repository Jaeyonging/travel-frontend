import type { PlaceCategory, Verification } from '@/types'

export const CATEGORY_META: Record<PlaceCategory, { label: string; className: string }> = {
  attraction: { label: '관광지', className: 'bg-brand-50 text-brand-600' },
  food: { label: '맛집', className: 'bg-coral-50 text-coral-600' },
  cafe: { label: '카페', className: 'bg-sand-100 text-sand-700' },
  culture: { label: '문화', className: 'bg-ink-50 text-ink-700' },
  stay: { label: '숙소', className: 'bg-brand-50 text-brand-600' },
}

export const CATEGORY_ORDER: PlaceCategory[] = [
  'attraction',
  'food',
  'cafe',
  'culture',
  'stay',
]

export const VERIFICATION_META: Record<
  Verification,
  { label: string; className: string; dot: string; help: string }
> = {
  confirmed: {
    label: '확정',
    className: 'bg-brand-50 text-brand-600',
    dot: 'bg-brand-500',
    help: '한국관광공사 OpenAPI에서 같은 장소를 찾았어요. 주소와 좌표까지 확인된 장소예요.',
  },
  likely: {
    label: '유력',
    className: 'bg-sand-100 text-sand-700',
    dot: 'bg-sand-500',
    help: '비슷한 이름의 장소가 조회됐어요. 주소가 맞는지 한 번만 확인해 주세요.',
  },
  needs_check: {
    label: '확인필요',
    className: 'bg-coral-50 text-coral-600',
    dot: 'bg-coral-500',
    help: '공공데이터에서 못 찾은 장소예요. SNS에만 있는 별칭일 수 있어요.',
  },
}

export const VERIFICATION_ORDER: Verification[] = ['confirmed', 'likely', 'needs_check']
