import { useEffect, useState } from 'react'

/**
 * 진행 단계 UI용 타이머.
 * 실제 요청이 끝날 때까지 단계가 순차적으로 올라가고, 마지막 단계에서 멈춥니다.
 */
export function useTimedSteps(total: number, intervalMs = 700, active = true) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!active) {
      setStep(0)
      return
    }
    setStep(0)
    const timers = Array.from({ length: total }, (_, i) =>
      window.setTimeout(() => setStep(i + 1), intervalMs * (i + 1)),
    )
    return () => timers.forEach(clearTimeout)
  }, [total, intervalMs, active])

  return Math.min(step, total)
}
