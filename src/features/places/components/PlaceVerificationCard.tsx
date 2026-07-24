import Icon from '@/components/icon'
import { VERIFICATION_META } from '@/lib/constants'
import type { Place } from '@/types'

/** 장소 상세의 공공데이터 검증 정보 블록 */
export default function PlaceVerificationCard({ place }: { place: Place }) {
  const rows: [string, string][] = [
    ['관광 유형', place.contentTypeName ?? '매칭 없음'],
    ['콘텐츠 ID', place.contentId ?? '—'],
    ['주소', place.address],
    ['운영시간', place.openHours],
  ]

  return (
    <div className="rounded-2xl bg-ink-50 p-4">
      <p className="flex items-center gap-1.5 text-[12.5px] font-extrabold text-ink-900">
        <Icon name="shield" size={15} className="text-brand-500" />
        공공데이터 검증
      </p>
      <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500">
        {VERIFICATION_META[place.verification].help}
      </p>
      <dl className="mt-3 space-y-1.5 text-[12px]">
        {rows.map(([label, value]) => (
          <div key={label} className="flex gap-3">
            <dt className="w-14 shrink-0 text-ink-300">{label}</dt>
            <dd className="flex-1 text-ink-700">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
