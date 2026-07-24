import { useNavigate } from 'react-router-dom'
import Photo from '@/components/photo'
import Icon from '@/components/icon'
import { Badge } from '@/components/ui'
import { COMPANION_LABEL, TRANSPORT_LABEL } from '@/lib/constants'
import { formatDateRange } from '@/lib/format'
import type { CompanionType, Itinerary, TransportMode } from '@/types'

export interface TripHeroProps {
  itinerary: Itinerary
  onShare: () => void
}

/** 일정 상세 상단 히어로 */
export default function TripHero({ itinerary, onShare }: TripHeroProps) {
  const navigate = useNavigate()

  return (
    <div className="relative">
      <Photo seed="trip-cover" kind="beach" className="h-[200px] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/25 to-ink-900/25" />

        <div className="absolute inset-x-0 top-0 flex h-14 items-center justify-between px-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="pressable-sm grid h-9 w-9 place-items-center rounded-full bg-ink-900/35 text-white backdrop-blur"
            aria-label="뒤로"
          >
            <Icon name="chevron-left" size={20} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={onShare}
            className="pressable-sm grid h-9 w-9 place-items-center rounded-full bg-ink-900/35 text-white backdrop-blur"
            aria-label="공유"
          >
            <Icon name="share" size={17} />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <Badge className="bg-white/20 text-white backdrop-blur">AI가 만든 일정</Badge>
          <h1 className="mt-2 text-[21px] font-extrabold tracking-tight text-white">
            {itinerary.title}
          </h1>
          <p className="mt-1 text-[12.5px] font-semibold text-white/75">
            {formatDateRange(itinerary.startDate, itinerary.endDate)} ·{' '}
            {TRANSPORT_LABEL[itinerary.transport as TransportMode] ?? itinerary.transport} ·{' '}
            {COMPANION_LABEL[itinerary.companion as CompanionType] ?? itinerary.companion}
          </p>
        </div>
      </Photo>
    </div>
  )
}
