import type { SceneKind } from '@/components/photo'

export interface Collection {
  id: string
  title: string
  sub: string
  seed: string
  kind: SceneKind
}

export const COLLECTIONS: Collection[] = [
  {
    id: 'c1',
    title: '바다 보며 커피 한 잔',
    sub: '강릉 · 속초 카페 12곳',
    seed: 'coll-cafe',
    kind: 'cafe',
  },
  {
    id: 'c2',
    title: '차 없이도 가능한 코스',
    sub: 'KTX + 버스 6코스',
    seed: 'coll-train',
    kind: 'market',
  },
  {
    id: 'c3',
    title: '해돋이 명당 모음',
    sub: '동해안 일출 8곳',
    seed: 'coll-sunrise',
    kind: 'beach',
  },
  {
    id: 'c4',
    title: '비 오는 날 실내 코스',
    sub: '전시 · 시장 9곳',
    seed: 'coll-rain',
    kind: 'hanok',
  },
]

/** 축제 카드에 번갈아 사용할 씬 */
export const FESTIVAL_SCENES: SceneKind[] = ['market', 'beach', 'mountain']
