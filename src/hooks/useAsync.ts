import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError, toApiError } from '@/lib/api'

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  status: AsyncStatus
  data: T | null
  error: ApiError | null
  isLoading: boolean
  isError: boolean
  run: () => void
  retry: () => void
}

interface Options {
  /** false면 수동으로 run()을 호출할 때까지 실행하지 않습니다. */
  immediate?: boolean
}

/**
 * 비동기 요청 상태(로딩/성공/실패)를 한곳에서 관리합니다.
 * 에러는 항상 ApiError로 정규화되어 화면에서 동일하게 처리됩니다.
 */
export function useAsync<T>(
  fn: () => Promise<T>,
  deps: unknown[] = [],
  { immediate = true }: Options = {},
): AsyncState<T> {
  const [status, setStatus] = useState<AsyncStatus>(immediate ? 'loading' : 'idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [attempt, setAttempt] = useState(0)

  const fnRef = useRef(fn)
  fnRef.current = fn
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const execute = useCallback(() => {
    setStatus('loading')
    setError(null)
    fnRef
      .current()
      .then((result) => {
        if (!mounted.current) return
        setData(result)
        setStatus('success')
      })
      .catch((e) => {
        if (!mounted.current) return
        setError(toApiError(e))
        setStatus('error')
      })
  }, [])

  useEffect(() => {
    if (!immediate && attempt === 0) return
    execute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const trigger = useCallback(() => setAttempt((n) => n + 1), [])

  return {
    status,
    data,
    error,
    isLoading: status === 'loading',
    isError: status === 'error',
    run: trigger,
    retry: trigger,
  }
}
