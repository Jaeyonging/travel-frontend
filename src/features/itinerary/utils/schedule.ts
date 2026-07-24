import { approximateDistanceKm } from '@/lib/geo'
import type { ItineraryItem, Place } from '@/types'

/** 직선거리를 실제 도로 거리로 어림잡는 계수 */
const ROAD_FACTOR = 1.3
/** 강원 권역 평균 주행 속도 (km/h) */
const AVG_SPEED_KMH = 50
/** 시각은 5분 단위로 맞춥니다 */
const TIME_STEP = 5

export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

export function toTimeString(minutes: number): string {
  const wrapped = ((minutes % 1440) + 1440) % 1440
  const h = Math.floor(wrapped / 60)
  const m = wrapped % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const roundStep = (n: number) => Math.round(n / TIME_STEP) * TIME_STEP

/** 순서가 바뀐 뒤의 이동 거리·시간을 다시 계산합니다 */
export function estimateMove(from: Place, to: Place): { distanceKm: number; minutes: number } {
  const distanceKm = Math.round(approximateDistanceKm(from, to) * ROAD_FACTOR * 10) / 10
  const minutes = Math.max(TIME_STEP, roundStep((distanceKm / AVG_SPEED_KMH) * 60))
  return { distanceKm, minutes }
}

/**
 * 순서를 바꾼 뒤 일정 시각을 다시 흐르게 만듭니다.
 * 첫 장소의 시작 시각은 그대로 두고, 이후는 체류 시간과 이동 시간을 더해 밀어냅니다.
 */
export function recalculateSchedule(
  items: ItineraryItem[],
  getPlace: (id: string) => Place | undefined,
): ItineraryItem[] {
  if (items.length === 0) return items

  const result: ItineraryItem[] = []
  let cursor = toMinutes(items[0].startTime)

  items.forEach((item, i) => {
    const place = getPlace(item.placeId)
    const prevPlace = i > 0 ? getPlace(items[i - 1].placeId) : undefined

    let moveFromPrev = item.moveFromPrev
    if (i === 0) {
      moveFromPrev = null
    } else if (place && prevPlace) {
      const mode = item.moveFromPrev?.mode ?? 'car'
      const estimated = estimateMove(prevPlace, place)
      // 도보 구간은 원래 값을 유지합니다 (숙소 바로 옆 등)
      moveFromPrev = mode === 'walk' ? item.moveFromPrev : { ...estimated, mode }
      cursor += moveFromPrev?.minutes ?? 0
    }

    const startTime = toTimeString(cursor)
    const stay = item.slot === 'stay' ? 0 : (place?.stayMinutes ?? 60)
    cursor += stay

    result.push({
      ...item,
      moveFromPrev,
      startTime,
      endTime: item.slot === 'stay' ? '' : toTimeString(cursor),
    })
  })

  return result
}

/** 저장된 순서를 적용합니다. 순서에 없는 항목은 뒤에 붙습니다 */
export function applyOrder(items: ItineraryItem[], order?: string[]): ItineraryItem[] {
  if (!order || order.length === 0) return items
  const rank = new Map(order.map((id, index) => [id, index]))
  return [...items].sort(
    (a, b) => (rank.get(a.placeId) ?? Number.MAX_SAFE_INTEGER) -
      (rank.get(b.placeId) ?? Number.MAX_SAFE_INTEGER),
  )
}

/** 배열에서 한 항목을 다른 위치로 옮깁니다 */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to) return items
  const next = [...items]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}
