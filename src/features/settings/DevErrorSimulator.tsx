import { useState } from 'react'
import { Chip } from '@/components/ui'
import { useToast } from '@/components/feedback'
import { getSimulatedStatus, setSimulatedStatus } from '@/lib/api'

const OPTIONS: { value: number | null; label: string }[] = [
  { value: null, label: '정상' },
  { value: 0, label: '네트워크 끊김' },
  { value: 403, label: '403 권한 없음' },
  { value: 429, label: '429 한도 초과' },
  { value: 500, label: '500 서버 오류' },
]

/**
 * 백엔드 연동 전, 에러 화면을 실제로 확인하기 위한 개발자 스위치.
 * 선택한 상태는 다음 API 호출부터 적용됩니다.
 */
export default function DevErrorSimulator() {
  const toast = useToast()
  const [current, setCurrent] = useState<number | null>(() => getSimulatedStatus())

  const apply = (value: number | null) => {
    setSimulatedStatus(value)
    setCurrent(value)
    toast(
      value === null ? '정상 응답으로 되돌렸어요' : '다음 요청부터 오류가 발생해요',
      value === null ? 'success' : 'warn',
    )
  }

  return (
    <section className="px-5 py-5">
      <h2 className="text-[15px] font-extrabold tracking-tight">개발자 · 오류 화면 테스트</h2>
      <p className="mt-1 text-[12px] text-ink-500">
        선택한 오류를 다음 분석/일정 생성 요청에서 재현합니다.
      </p>
      <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
        {OPTIONS.map((option) => (
          <Chip
            key={String(option.value)}
            size="sm"
            active={current === option.value}
            onClick={() => apply(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>
    </section>
  )
}
