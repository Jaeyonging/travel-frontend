import Photo from '@/components/photo'
import Icon from '@/components/icon'
import { Badge } from '@/components/ui'
import { CATEGORY_META } from '@/lib/constants'
import { formatCount, formatMinutes } from '@/lib/format'
import { sceneOfPlace } from '@/lib/scene'
import type { Place } from '@/types'
import SaveButton from './SaveButton'
import VerifyChip from './VerifyChip'

export interface PlaceRowProps {
  place: Place
  saved: boolean
  onToggle: () => void
  onOpen: () => void
  rank?: number
}

/** 리스트용 장소 행 */
export default function PlaceRow({ place, saved, onToggle, onOpen, rank }: PlaceRowProps) {
  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      className="pressable flex cursor-pointer items-center gap-3 px-5 py-3 active:bg-ink-50"
    >
      {rank !== undefined && (
        <span className="w-4 shrink-0 text-center text-[15px] font-extrabold text-ink-900">
          {rank}
        </span>
      )}

      <Photo
        seed={place.id}
        kind={sceneOfPlace(place)}
        className="h-[76px] w-[76px] shrink-0 rounded-xl"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="line-clamp-1 text-[14.5px] font-bold tracking-tight">{place.name}</p>
          <VerifyChip level={place.verification} />
        </div>
        <p className="mt-0.5 text-[12px] text-ink-500">
          {place.city} · {CATEGORY_META[place.category].label} · 체류{' '}
          {formatMinutes(place.stayMinutes)}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="flex items-center gap-0.5 text-[12px] font-bold">
            <Icon name="star" size={12} filled className="text-coral-500" />
            {place.rating.toFixed(1)}
            <span className="ml-0.5 font-medium text-ink-300">
              ({formatCount(place.reviewCount)})
            </span>
          </span>
          {place.source === 'sns' && <Badge className="bg-ink-900 text-white">SNS 추출</Badge>}
        </div>
      </div>

      <SaveButton saved={saved} onToggle={onToggle} />
    </div>
  )
}
