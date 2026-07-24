export function formatViews(n: number) {
  if (n >= 10_000) return `${(n / 10_000).toFixed(1)}만`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}천`
  return String(n)
}

export function formatCount(n: number) {
  return n.toLocaleString('ko-KR')
}

export function formatKm(km: number) {
  return `${Math.round(km * 10) / 10}km`
}

export function formatPercent(ratio: number) {
  return `${Math.round(ratio * 100)}%`
}
