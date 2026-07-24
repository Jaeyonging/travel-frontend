import { VERIFICATION_META, VERIFICATION_ORDER } from '@/lib/constants'
import type { Place } from '@/types'

/** 분석 결과 상단의 검증 단계 요약 배너 */
export default function VerificationSummary({ places }: { places: Place[] }) {
  return (
    <div className="mx-5 rounded-2xl bg-brand-600 px-4 py-3.5 text-white">
      <p className="text-[15px] font-extrabold">강원도 여행지 {places.length}곳을 찾았어요</p>
      <div className="mt-2 flex gap-1.5">
        {VERIFICATION_ORDER.map((level) => {
          const count = places.filter((p) => p.verification === level).length
          if (!count) return null
          return (
            <span
              key={level}
              className="rounded-md bg-white/15 px-2 py-1 text-[11.5px] font-bold backdrop-blur"
            >
              {VERIFICATION_META[level].label} {count}
            </span>
          )
        })}
      </div>
    </div>
  )
}
