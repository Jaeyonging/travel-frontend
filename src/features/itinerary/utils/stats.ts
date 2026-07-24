import type { ItineraryItem } from '@/types'

export interface DayStats {
  moveMinutes: number
  distanceKm: number
  placeCount: number
}

export function summarizeDay(items: ItineraryItem[]): DayStats {
  return {
    moveMinutes: items.reduce((sum, it) => sum + (it.moveFromPrev?.minutes ?? 0), 0),
    distanceKm:
      Math.round(items.reduce((sum, it) => sum + (it.moveFromPrev?.distanceKm ?? 0), 0) * 10) /
      10,
    placeCount: items.length,
  }
}
