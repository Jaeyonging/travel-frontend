import { sortByDistance } from '@/lib/geo'
import type { ItineraryDay, Place } from '@/types'

/**
 * 일정에서 뺀 장소 주변의 대체 후보를 찾습니다.
 * (한국관광공사 위치기반 관광정보 조회 API 시나리오)
 */
export function findAlternatives(
  removed: Place | undefined,
  allPlaces: Place[],
  day: ItineraryDay,
  limit = 3,
): Place[] {
  if (!removed) return []

  const usedIds = new Set(day.items.map((item) => item.placeId))
  const candidates = allPlaces.filter(
    (p) => p.id !== removed.id && !usedIds.has(p.id) && p.category !== 'stay',
  )

  return sortByDistance(candidates, removed).slice(0, limit)
}
