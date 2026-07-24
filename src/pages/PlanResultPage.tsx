import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MockMap from '@/components/map'
import { Button, Sheet, StatRow } from '@/components/ui'
import { useToast } from '@/components/feedback'
import {
  AlternativePlaces,
  DayTabs,
  ExcludedPlaces,
  ItineraryWarnings,
  MoveBadge,
  TimelineItem,
  TripHero,
  findAlternatives,
  summarizeDay,
} from '@/features/itinerary'
import { PlaceDetailSheet } from '@/features/places'
import { DAY_COLORS } from '@/lib/constants'
import { formatKm, formatMinutes, formatPercent } from '@/lib/format'
import { useCatalog, useTrip } from '@/store'
import { ROUTES } from '@/app/routes'
import type { Place } from '@/types'

export default function PlanResultPage() {
  const navigate = useNavigate()
  const toast = useToast()

  const { places, getPlace } = useCatalog()
  const { itinerary, excludedPlaceIds, toggleExcluded } = useTrip()

  const [dayIndex, setDayIndex] = useState(0)
  const [detail, setDetail] = useState<Place | null>(null)
  const [mapOpen, setMapOpen] = useState(false)

  const day = itinerary.days[dayIndex]
  const dayColor = DAY_COLORS[dayIndex % DAY_COLORS.length]

  const items = day.items.filter((item) => !excludedPlaceIds.includes(item.placeId))
  const stats = useMemo(() => summarizeDay(items), [items])

  const markers = items.map((item, i) => ({
    place: getPlace(item.placeId)!,
    index: i + 1,
    color: dayColor,
  }))

  const alternatives = useMemo(
    () =>
      findAlternatives(getPlace(excludedPlaceIds[excludedPlaceIds.length - 1]), places, day),
    [excludedPlaceIds, places, day, getPlace],
  )

  const excludedPlaces = excludedPlaceIds
    .map((id) => getPlace(id))
    .filter((p): p is Place => Boolean(p))

  const share = () => toast('공유 링크를 복사했어요 (목업)')

  return (
    <div className="pb-2">
      <TripHero itinerary={itinerary} onShare={share} />

      <div className="px-5 py-4">
        <StatRow
          stats={[
            { label: '장소', value: `${itinerary.summary.totalPlaces}곳` },
            { label: '이동', value: formatKm(itinerary.summary.totalDistanceKm) },
            { label: '이동시간', value: formatMinutes(itinerary.summary.totalMoveMinutes) },
            { label: 'SNS 반영', value: formatPercent(itinerary.summary.snsPlaceRatio) },
          ]}
        />
      </div>

      <ItineraryWarnings
        warnings={itinerary.warnings}
        onSplit={() => toast('권역별 일정 분리는 준비 중이에요', 'default')}
      />

      <DayTabs days={itinerary.days} activeIndex={dayIndex} onChange={setDayIndex} />

      <button type="button" onClick={() => setMapOpen(true)} className="relative block w-full">
        <MockMap markers={markers} route height={180} showLabels={false} />
        <span className="absolute bottom-3 right-3 rounded-full bg-white px-3 py-1.5 text-[11.5px] font-bold text-ink-700 shadow-sm">
          전체 동선 크게 보기
        </span>
      </button>

      <div className="flex items-center gap-3 px-5 pb-1 pt-4 text-[12px] text-ink-500">
        <span className="font-extrabold text-ink-900">{day.label}</span>
        <span>장소 {stats.placeCount}곳</span>
        <span>
          이동 {formatKm(stats.distanceKm)} · {formatMinutes(stats.moveMinutes)}
        </span>
      </div>

      <ol className="px-5">
        {items.map((item, i) => {
          const place = getPlace(item.placeId)!
          return (
            <li key={item.placeId}>
              {i > 0 && item.moveFromPrev && <MoveBadge move={item.moveFromPrev} />}
              <TimelineItem
                item={item}
                place={place}
                index={i + 1}
                color={dayColor}
                onOpen={() => setDetail(place)}
                onExclude={() => {
                  toggleExcluded(place.id)
                  toast('일정에서 뺐어요', 'remove')
                }}
              />
            </li>
          )
        })}
      </ol>

      <ExcludedPlaces places={excludedPlaces} onRestore={toggleExcluded} />
      <AlternativePlaces
        places={alternatives}
        onAdd={() => toast('일정 재구성은 백엔드 연동 후 제공돼요', 'default')}
      />

      <div className="sticky bottom-[62px] z-30 flex gap-2 border-t border-ink-100 bg-white/95 px-5 py-3 backdrop-blur">
        <Button
          variant="outline"
          size="lg"
          className="shrink-0 whitespace-nowrap px-4"
          onClick={() => navigate(ROUTES.planNew)}
        >
          다시 만들기
        </Button>
        <Button variant="kakao" size="lg" full onClick={share}>
          카카오톡으로 공유
        </Button>
      </div>

      <Sheet open={mapOpen} onClose={() => setMapOpen(false)} title={`DAY ${day.day} 전체 동선`}>
        <MockMap markers={markers} route height={380} />
        <ol className="mt-3 px-5">
          {markers.map((marker, i) => (
            <li key={marker.place.id} className="flex items-center gap-2.5 py-2">
              <span
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-extrabold text-white"
                style={{ background: marker.color }}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold">
                {marker.place.name}
              </span>
              <span className="text-[11.5px] text-ink-500">{items[i].startTime}</span>
            </li>
          ))}
        </ol>
      </Sheet>

      <PlaceDetailSheet place={detail} onClose={() => setDetail(null)} />
    </div>
  )
}
