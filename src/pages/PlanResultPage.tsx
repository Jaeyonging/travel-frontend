import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '@/components/icon'
import MockMap from '@/components/map'
import { Button, Sheet, StatRow } from '@/components/ui'
import { useToast } from '@/components/feedback'
import {
  AlternativePlaces,
  DayReorderList,
  DaySummary,
  DayTabs,
  ExcludedPlaces,
  ItineraryWarnings,
  MoveBadge,
  TimelineItem,
  TripHero,
  applyOrder,
  findAlternatives,
  moveItem,
  recalculateSchedule,
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
  const { itinerary, excludedPlaceIds, toggleExcluded, dayOrders, setDayOrder, resetDayOrder } =
    useTrip()

  const [dayIndex, setDayIndex] = useState(0)
  const [detail, setDetail] = useState<Place | null>(null)
  const [mapOpen, setMapOpen] = useState(false)
  const [reordering, setReordering] = useState(false)

  const day = itinerary.days[dayIndex]
  const dayColor = DAY_COLORS[dayIndex % DAY_COLORS.length]

  const customOrder = dayOrders[day.day]

  // 제외한 장소를 빼고, 사용자가 바꾼 순서를 적용한 뒤, 시각과 이동 시간을 다시 계산합니다
  const items = useMemo(() => {
    const visible = day.items.filter((item) => !excludedPlaceIds.includes(item.placeId))
    const ordered = applyOrder(visible, customOrder)
    return customOrder ? recalculateSchedule(ordered, getPlace) : ordered
  }, [day, excludedPlaceIds, customOrder, getPlace])

  const stats = useMemo(() => summarizeDay(items, getPlace), [items, getPlace])

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

  const handleReorder = (from: number, to: number) => {
    const ids = moveItem(items.map((item) => item.placeId), from, to)
    setDayOrder(day.day, ids)
  }

  return (
    <div className="pb-2">
      <TripHero itinerary={itinerary} onShare={share} />

      <div className="px-5 pb-4 pt-5">
        <p className="mb-2 text-[11.5px] font-bold text-ink-300">
          여행 전체 · DAY 1 + DAY 2 합계
        </p>
        <StatRow
          stats={[
            { label: '들르는 곳', value: `${itinerary.summary.totalPlaces}곳` },
            { label: '이동 거리', value: formatKm(itinerary.summary.totalDistanceKm) },
            { label: '이동 시간', value: formatMinutes(itinerary.summary.totalMoveMinutes) },
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

      <DaySummary
        day={day}
        stats={stats}
        reordering={reordering}
        onToggleReorder={() => setReordering((v) => !v)}
      />

      {customOrder && (
        <div className="mx-5 mt-3 flex items-center gap-2 rounded-xl bg-sand-100 px-3 py-2.5">
          <Icon name="alert" size={14} className="shrink-0 text-sand-700" />
          <p className="min-w-0 flex-1 text-[11.5px] leading-relaxed text-sand-700">
            순서를 직접 바꿔서 이동 시간을 다시 계산했어요
          </p>
          <button
            type="button"
            onClick={() => {
              resetDayOrder(day.day)
              toast('AI 추천 순서로 되돌렸어요')
            }}
            className="pressable shrink-0 whitespace-nowrap rounded-lg bg-white px-2.5 py-1.5 text-[11.5px] font-extrabold text-ink-700"
          >
            되돌리기
          </button>
        </div>
      )}

      {reordering ? (
        <div className="pt-3">
          <p className="px-5 pb-2 text-[11.5px] text-ink-500">
            오른쪽 손잡이를 끌어서 순서를 바꾸세요. 놓으면 이동 시간이 다시 계산됩니다.
          </p>
          <DayReorderList
            places={items.map((item) => getPlace(item.placeId)!)}
            onReorder={handleReorder}
          />
        </div>
      ) : (
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
      )}

      <ExcludedPlaces places={excludedPlaces} onRestore={toggleExcluded} />
      <AlternativePlaces
        places={alternatives}
        onAdd={() => toast('일정 재구성은 백엔드 연동 후 제공돼요', 'default')}
      />

      <div className="sticky bottom-[68px] z-30 flex gap-2 border-t border-ink-100 bg-white/95 px-5 py-3 backdrop-blur">
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
