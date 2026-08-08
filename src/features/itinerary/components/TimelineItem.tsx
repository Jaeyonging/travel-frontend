import Photo from '@/components/photo'
import Icon from '@/components/icon'
import { Badge } from '@/components/ui'
import { CATEGORY_META, SLOT_META } from '@/lib/constants'
import { sceneOfPlace } from '@/lib/scene'
import { VerifyChip } from '@/features/places'
import type { ItineraryItem, Place } from '@/types'

export interface TimelineItemProps {
  item: ItineraryItem
  place: Place
  index: number
  color: string
  onOpen: () => void
  onExclude: () => void
}

/** 일정 타임라인의 장소 카드 */
export default function TimelineItem({
  item,
  place,
  index,
  color,
  onOpen,
  onExclude,
}: TimelineItemProps) {
  const slot = SLOT_META[item.slot]

  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      className="pressable flex cursor-pointer gap-3 py-2"
    >
      <div className="flex w-[26px] shrink-0 flex-col items-center pt-1">
        <span
          className="grid h-[26px] w-[26px] place-items-center rounded-full text-[11.5px] font-extrabold text-white"
          style={{ background: color }}
        >
          {index}
        </span>
        <span className="mt-1 text-[10.5px] font-bold text-ink-700">{item.startTime}</span>
      </div>

      <Photo
        seed={place.id} src={place.image}
        kind={sceneOfPlace(place)}
        className="h-[84px] w-[84px] shrink-0 rounded-xl"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1">
          <Badge className={slot.className}>{slot.label}</Badge>
          <Badge className="bg-ink-50 text-ink-700">{CATEGORY_META[place.category].label}</Badge>
          <VerifyChip level={place.verification} />
        </div>
        <p className="mt-1 line-clamp-1 text-[15px] font-bold tracking-tight">{place.name}</p>
        <p className="mt-0.5 line-clamp-1 text-[12px] text-ink-500">{item.note}</p>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-300">
          <span className="flex items-center gap-0.5">
            <Icon name="clock" size={11} />
            {item.startTime}
            {item.endTime && `–${item.endTime}`}
          </span>
          {place.source === 'sns' && (
            <span className="font-bold text-ink-500">SNS에서 담은 곳</span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onExclude()
        }}
        aria-label={`${place.name} 일정에서 빼기`}
        className="pressable-sm grid h-8 w-8 shrink-0 self-center place-items-center rounded-lg text-ink-300 active:bg-ink-50"
      >
        <Icon name="trash" size={16} />
      </button>
    </div>
  )
}
