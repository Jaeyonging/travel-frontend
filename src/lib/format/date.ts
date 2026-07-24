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

/** 박수 없이 날짜만 (8.12(수) ~ 8.13(목)) */
export function formatDateRangeShort(start: string, end: string) {
  const f = (value: string) => {
    const d = new Date(value)
    return `${d.getMonth() + 1}.${d.getDate()}(${DAY_NAMES[d.getDay()]})`
  }
  return `${f(start)} ~ ${f(end)}`
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

/** 알림 목록용 상대 시간 (방금 전, 3시간 전, 어제 ...) */
export function formatRelativeTime(value: string, now = new Date()): string {
  const target = new Date(value)
  const diffMs = now.getTime() - target.getTime()
  const minutes = Math.floor(diffMs / 60_000)

  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`

  const hours = Math.floor(minutes / 60)
  if (hours < 24 && target.getDate() === now.getDate()) return `${hours}시간 전`

  const days = daysUntil(toDateOnly(value), now) * -1
  if (days === 1) return '어제'
  if (days < 7) return `${days}일 전`
  return `${target.getMonth() + 1}월 ${target.getDate()}일`
}

function toDateOnly(value: string) {
  return value.slice(0, 10)
}

/** 알림 묶음 제목 (오늘 / 어제 / 지난 알림) */
export function relativeGroup(value: string, now = new Date()): string {
  const days = daysUntil(toDateOnly(value), now) * -1
  if (days <= 0) return '오늘'
  if (days === 1) return '어제'
  return '지난 알림'
}
