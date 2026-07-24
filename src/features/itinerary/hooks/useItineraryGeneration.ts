import { useCallback, useState } from 'react'
import { useTimedSteps } from '@/hooks'
import { api, toApiError, type ApiError } from '@/lib/api'
import type { GenerateItineraryInput, Itinerary } from '@/types'

export const GENERATION_STEPS = [
  '담은 장소 위치 정리 중',
  '장소 사이 이동 시간 계산 중',
  '식사 시간과 숙소 기준으로 배치 중',
  '무리한 동선 다듬는 중',
]

type Status = 'idle' | 'generating' | 'error'

/** 일정 생성 요청 상태 (진행 단계 + 실패 처리) */
export function useItineraryGeneration(onSuccess: (itinerary: Itinerary) => void) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<ApiError | null>(null)
  const [lastInput, setLastInput] = useState<GenerateItineraryInput | null>(null)

  const step = useTimedSteps(GENERATION_STEPS.length, 700, status === 'generating')

  const generate = useCallback(
    async (input: GenerateItineraryInput) => {
      setLastInput(input)
      setStatus('generating')
      setError(null)
      try {
        const itinerary = await api.generateItinerary(input)
        onSuccess(itinerary)
      } catch (e) {
        setError(toApiError(e))
        setStatus('error')
      }
    },
    [onSuccess],
  )

  const retry = useCallback(() => {
    if (lastInput) void generate(lastInput)
  }, [generate, lastInput])

  return {
    status,
    error,
    step,
    steps: GENERATION_STEPS,
    isGenerating: status === 'generating',
    isError: status === 'error',
    generate,
    retry,
    reset: () => setStatus('idle'),
  }
}
