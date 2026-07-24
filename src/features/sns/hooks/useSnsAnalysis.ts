import { useAsync, useTimedSteps } from '@/hooks'
import { api } from '@/lib/api'
import type { SnsAnalysisResult } from '@/types'

export const ANALYSIS_STEPS = [
  '콘텐츠 정보 읽는 중',
  '영상 속 장소 찾는 중',
  '관광공사 데이터로 확인하는 중',
  '주소와 좌표 채우는 중',
]

/** SNS URL 분석 요청 + 진행 단계 상태 */
export function useSnsAnalysis(url: string) {
  const request = useAsync<SnsAnalysisResult>(() => api.analyzeSnsUrl(url), [url])
  const step = useTimedSteps(ANALYSIS_STEPS.length, 620, request.isLoading)

  return { ...request, steps: ANALYSIS_STEPS, step }
}
