import Photo from '@/components/photo'
import Icon from '@/components/icon'
import { Badge } from '@/components/ui'
import { formatDday, formatShortDate } from '@/lib/format'
import { formatKm, formatPercent } from '@/lib/format'
import type { Itinerary } from '@/types'

export interface TripCardProps {
  itinerary: Itinerary
  onOpen: () => void
}

/** 홈·내 일정에서 쓰는 여행 요약 카드 */
export default function TripCard({ itinerary, onOpen }: TripCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="pressable relative w-full overflow-hidden rounded-2xl text-left"
    >
      <Photo seed="trip-cover" kind="beach" className="h-[132px] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <Badge className="bg-white/20 text-white backdrop-blur">
            {formatDday(itinerary.startDate)}
          </Badge>
          <p className="mt-1.5 text-[16px] font-extrabold text-white">{itinerary.title}</p>
          <p className="mt-0.5 text-[12px] font-semibold text-white/75">
            {formatShortDate(itinerary.startDate)} – {formatShortDate(itinerary.endDate)} · 장소{' '}
            {itinerary.summary.totalPlaces}곳 · 이동 {formatKm(itinerary.summary.totalDistanceKm)}
          </p>
        </div>
        <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/25 text-white backdrop-blur">
          <Icon name="chevron-right" size={18} strokeWidth={2.2} />
        </span>
      </Photo>
      <span className="sr-only">
        SNS 반영률 {formatPercent(itinerary.summary.snsPlaceRatio)}
      </span>
    </button>
  )
}
