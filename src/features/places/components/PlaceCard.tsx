import Photo from '@/components/photo'
import Icon from '@/components/icon'
import { CATEGORY_META } from '@/lib/constants'
import { sceneOfPlace } from '@/lib/scene'
import type { Place } from '@/types'
import SaveButton from './SaveButton'
import VerifyChip from './VerifyChip'

export interface PlaceCardProps {
  place: Place
  saved: boolean
  onToggle: () => void
  onOpen: () => void
  width?: number
}

/** 가로 캐러셀용 장소 카드 */
export default function PlaceCard({
  place,
  saved,
  onToggle,
  onOpen,
  width = 168,
}: PlaceCardProps) {
  return (
    // 내부에 담기 버튼이 있어 button 중첩을 피합니다.
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      style={{ width }}
      className="pressable shrink-0 cursor-pointer text-left"
    >
      <div className="relative">
        <Photo seed={place.id} src={place.image} kind={sceneOfPlace(place)} className="h-[124px] w-full rounded-2xl">
          <div className="absolute right-2 top-2">
            <SaveButton saved={saved} onToggle={onToggle} tone="dark" />
          </div>
          {place.source === 'sns' && (
            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-ink-900/55 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">
              <Icon name="play" size={10} strokeWidth={2.5} /> SNS
            </span>
          )}
        </Photo>
      </div>

      <div className="mt-2">
        <p className="line-clamp-1 text-[14px] font-bold tracking-tight">{place.name}</p>
        <p className="mt-0.5 line-clamp-1 text-[12px] text-ink-500">
          {place.city} · {CATEGORY_META[place.category].label}
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          {place.rating > 0 && (
            <span className="flex items-center gap-0.5 text-[12px] font-bold text-ink-900">
              <Icon name="star" size={12} filled className="text-coral-500" />
              {place.rating.toFixed(1)}
            </span>
          )}
          <VerifyChip level={place.verification} />
        </div>
      </div>
    </div>
  )
}
