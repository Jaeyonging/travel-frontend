import { ApiError, kindFromStatus, toApiError } from './errors'

const DEFAULT_TIMEOUT_MS = 15_000

export interface RequestOptions extends RequestInit {
  timeoutMs?: number
}

/**
 * 실제 백엔드가 붙으면 이 파일만 사용하도록 전환합니다.
 * 상태 코드를 ApiError로 정규화해 화면에서 일관되게 처리할 수 있게 합니다.
 */
export async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, signal, ...init } = options

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new ApiError('offline', '인터넷 연결이 끊겼습니다.')
  }

  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true })

  try {
    const res = await fetch(url, { ...init, signal: controller.signal })
    if (!res.ok) {
      throw new ApiError(kindFromStatus(res.status), `요청 실패 (${res.status})`, {
        status: res.status,
      })
    }
    if (res.status === 204) return undefined as T
    return (await res.json()) as T
  } catch (error) {
    throw toApiError(error)
  } finally {
    window.clearTimeout(timer)
  }
}
