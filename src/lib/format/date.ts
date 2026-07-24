const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

export function formatShortDate(date: string) {
  const d = new Date(date)
  return `${d.getMonth() + 1}.${d.getDate()} ${DAY_NAMES[d.getDay()]}`
}

export function formatDateRange(start: string, end: string) {
  const s = new Date(start)
  const e = new Date(end)
  const f = (d: Date) => `${d.getMonth() + 1}.${d.getDate()}(${DAY_NAMES[d.getDay()]})`
  const nights = nightsBetween(start, end)
  return `${f(s)} – ${f(e)} · ${nights}박 ${nights + 1}일`
}

export function nightsBetween(start: string, end: string) {
  const diff = new Date(end).getTime() - new Date(start).getTime()
  if (Number.isNaN(diff)) return 0
  return Math.max(0, Math.round(diff / 86_400_000))
}

export function formatMinutes(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h && m) return `${h}시간 ${m}분`
  if (h) return `${h}시간`
  return `${m}분`
}

/** 오늘 기준 남은 일수 (D-n) */
export function daysUntil(date: string, from = new Date()) {
  const target = new Date(date)
  const base = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  return Math.round((target.getTime() - base.getTime()) / 86_400_000)
}

export function formatDday(date: string) {
  const d = daysUntil(date)
  if (d === 0) return 'D-DAY'
  return d > 0 ? `D-${d}` : `D+${-d}`
}
