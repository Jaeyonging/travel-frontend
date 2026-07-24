interface LatLng {
  lat: number
  lng: number
}

const KM_PER_DEG_LAT = 111
const KM_PER_DEG_LNG_AT_38 = 88

/** 강원권 한정 근사 거리(km) — 정확한 거리는 카카오 길찾기 API로 대체 예정 */
export function approximateDistanceKm(a: LatLng, b: LatLng) {
  const dx = (a.lng - b.lng) * KM_PER_DEG_LNG_AT_38
  const dy = (a.lat - b.lat) * KM_PER_DEG_LAT
  return Math.sqrt(dx * dx + dy * dy)
}

/** 기준 좌표에서 가까운 순으로 정렬 */
export function sortByDistance<T extends LatLng>(items: T[], origin: LatLng): T[] {
  return [...items].sort(
    (a, b) => approximateDistanceKm(a, origin) - approximateDistanceKm(b, origin),
  )
}
