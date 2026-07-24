import { useCallback } from 'react'
import { useAsync, useTimedSteps } from '@/hooks'
import { api } from '@/lib/api'
import type { SnsAnalysisResult } from '@/types'

export const ANALYSIS_STEPS = [
  '콘텐츠 정보 읽는 중',
  '영상 속 장소 찾는 중',
  '관광공사 데이터로 확인하는 중',
  '주소와 좌표 채우는 중',
]

/**
 * 한 번 분석한 URL은 기억해 둡니다.
 * 일정 만들기로 갔다가 뒤로 돌아와도 다시 분석하지 않습니다.
 */
const analysisCache = new Map<string, SnsAnalysisResult>()

export function clearAnalysisCache() {
  analysisCache.clear()
}

/** SNS URL 분석 요청과 진행 단계 상태 */
export function useSnsAnalysis(url: string) {
  const cached = analysisCache.get(url) ?? null

  const request = useAsync<SnsAnalysisResult>(
    async () => {
      const result = await api.analyzeSnsUrl(url)
      analysisCache.set(url, result)
      return result
    },
    [url],
    { immediate: !cached },
  )

  const data = request.data ?? cached
  const isLoading = !cached && request.isLoading
  const step = useTimedSteps(ANALYSIS_STEPS.length, 620, isLoading)

  /** 캐시를 버리고 처음부터 다시 분석합니다 */
  const retry = useCallback(() => {
    analysisCache.delete(url)
    request.retry()
  }, [url, request])

  return {
    data,
    error: request.error,
    isLoading,
    isError: !data && request.isError,
    steps: ANALYSIS_STEPS,
    step,
    retry,
    /** 캐시된 결과를 보여주는 중인지 */
    fromCache: Boolean(cached) && !request.data,
  }
}
