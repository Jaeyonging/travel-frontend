import type { ItineraryItem, Place } from '@/types'

export interface DayStats {
  placeCount: number
  /** 장소 사이를 옮겨다니는 시간 */
  moveMinutes: number
  distanceKm: number
  /** 장소에 머무는 시간 (숙박 제외) */
  stayMinutes: number
}

export function summarizeDay(
  items: ItineraryItem[],
  getPlace?: (id: string) => Place | undefined,
): DayStats {
  const stayMinutes = getPlace
    ? items.reduce((sum, item) => {
        if (item.slot === 'stay') return sum
        return sum + (getPlace(item.placeId)?.stayMinutes ?? 0)
      }, 0)
    : 0

  return {
    placeCount: items.length,
    moveMinutes: items.reduce((sum, it) => sum + (it.moveFromPrev?.minutes ?? 0), 0),
    distanceKm:
      Math.round(items.reduce((sum, it) => sum + (it.moveFromPrev?.distanceKm ?? 0), 0) * 10) /
      10,
    stayMinutes,
  }
}
