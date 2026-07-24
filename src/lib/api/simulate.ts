import { ApiError, kindFromStatus } from './errors'

const STORAGE_KEY = 'gp:simulate-error'

/**
 * 백엔드가 붙기 전까지 에러 화면을 확인할 수 있는 스위치.
 *   ?simulate=403  같은 쿼리 또는 MY 탭의 개발자 설정으로 켭니다.
 */
export function getSimulatedStatus(): number | null {
  if (typeof window === 'undefined') return null

  const fromQuery = new URLSearchParams(window.location.search).get('simulate')
  if (fromQuery) {
    if (fromQuery === 'off') {
      window.localStorage.removeItem(STORAGE_KEY)
      return null
    }
    window.localStorage.setItem(STORAGE_KEY, fromQuery)
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  const status = Number(raw)
  return Number.isFinite(status) ? status : null
}

export function setSimulatedStatus(status: number | null) {
  if (typeof window === 'undefined') return
  if (status === null) window.localStorage.removeItem(STORAGE_KEY)
  else window.localStorage.setItem(STORAGE_KEY, String(status))
}

/** 시뮬레이션이 켜져 있으면 해당 상태의 ApiError를 던집니다. */
export function throwIfSimulated() {
  const status = getSimulatedStatus()
  if (status === null) return
  if (status === 0) {
    throw new ApiError('network', '네트워크 오류 시뮬레이션')
  }
  throw new ApiError(kindFromStatus(status), `${status} 응답 시뮬레이션`, { status })
}
