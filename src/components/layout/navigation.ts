import type { IconName } from '@/components/icon'

export interface TabItem {
  to: string
  label: string
  icon: IconName
}

export const TABS: TabItem[] = [
  { to: '/', label: '홈', icon: 'home' },
  { to: '/explore', label: '탐색', icon: 'compass' },
  { to: '/saved', label: '담은 곳', icon: 'bookmark' },
  { to: '/trips', label: '내 일정', icon: 'route' },
  { to: '/my', label: 'MY', icon: 'user' },
]

const TAB_PATHS = TABS.map((t) => t.to)

/** 하단 탭이 숨겨지는 몰입형 화면 */
const FULLSCREEN_PREFIXES = ['/plan/new', '/extract/result']

export function isFullscreenRoute(pathname: string) {
  return FULLSCREEN_PREFIXES.some((p) => pathname.startsWith(p))
}

/** 탭 화면은 0, 상세로 들어가는 화면은 1 — 전환 방향 판단용 */
export function routeDepth(pathname: string) {
  return TAB_PATHS.includes(pathname) ? 0 : 1
}
