import Photo from '@/components/photo'
import Icon from '@/components/icon'
import { CATEGORY_META } from '@/lib/constants'
import { formatMinutes } from '@/lib/format'
import { sceneOfPlace } from '@/lib/scene'
import { cn } from '@/lib/cn'
import { VerifyChip } from '@/features/places'
import type { Place } from '@/types'

export interface ExtractedPlaceRowProps {
  place: Place
  saved: boolean
  onToggle: () => void
  onOpen: () => void
}

/** 분석 결과 화면의 추출 장소 행 (검증 경고 포함) */
export default function ExtractedPlaceRow({
  place,
  saved,
  onToggle,
  onOpen,
}: ExtractedPlaceRowProps) {
  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      className="pressable flex cursor-pointer gap-3 px-5 py-3 active:bg-ink-50"
    >
      <Photo
        seed={place.id} src={place.image}
        kind={sceneOfPlace(place)}
        className="h-[82px] w-[82px] shrink-0 rounded-xl"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="line-clamp-1 text-[15px] font-bold tracking-tight">{place.name}</p>
          <VerifyChip level={place.verification} />
        </div>
        <p className="mt-0.5 text-[12px] text-ink-500">
          {place.city} · {CATEGORY_META[place.category].label} · 체류{' '}
          {formatMinutes(place.stayMinutes)}
        </p>
        <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-ink-500">{place.summary}</p>

        {place.verification === 'needs_check' && (
          <p className="mt-1 flex items-center gap-1 text-[11.5px] font-semibold text-coral-600">
            <Icon name="alert" size={12} strokeWidth={2.2} />
            공공데이터에서 못 찾았어요. 확인 후 담아주세요
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        className={cn(
          'pressable h-8 shrink-0 self-center rounded-lg px-3 text-[12.5px] font-bold',
          saved ? 'bg-ink-50 text-ink-500' : 'bg-brand-500 text-white',
        )}
      >
        {saved ? '담김' : '담기'}
      </button>
    </div>
  )
}
