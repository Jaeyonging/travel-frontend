import { useNavigate } from 'react-router-dom'
import Photo from '@/components/photo'
import Icon from '@/components/icon'
import { Button } from '@/components/ui'
import { TopBar } from '@/components/layout'
import { TripCard } from '@/features/itinerary'
import { formatDateRange, formatKm, formatPercent } from '@/lib/format'
import { sceneOfPlace } from '@/lib/scene'
import { useCandidates, useCatalog, useTrip } from '@/store'
import { ROUTES } from '@/app/routes'

const TIPS = [
  '같은 권역(동해안권 등) 안에서 장소를 고르면 이동 시간이 확 줄어요.',
  '숙소를 하나 담아두면 1일차 마지막·2일차 시작이 자연스러워져요.',
  '확인필요로 표시된 장소는 담기 전에 한 번 확인해 주세요.',
]

export default function TripsPage() {
  const navigate = useNavigate()
  const { itinerary } = useTrip()
  const { getPlace } = useCatalog()
  const { candidates } = useCandidates()

  const previewPlaces = itinerary.days
    .flatMap((day) => day.items)
    .slice(0, 7)
    .map((item) => getPlace(item.placeId))
    .filter(Boolean)

  return (
    <div className="pb-8">
      <TopBar title="내 일정" />

      <div className="px-5 pt-4">
        <div className="overflow-hidden rounded-2xl border border-ink-100">
          <TripCard itinerary={itinerary} onOpen={() => navigate(ROUTES.plan(itinerary.id))} />
          <div className="p-4">
            <p className="text-[12.5px] font-semibold text-ink-700">
              {formatDateRange(itinerary.startDate, itinerary.endDate)}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-ink-500">
              <span>장소 {itinerary.summary.totalPlaces}곳</span>
              <span>이동 {formatKm(itinerary.summary.totalDistanceKm)}</span>
              <span>SNS 반영 {formatPercent(itinerary.summary.snsPlaceRatio)}</span>
            </div>
            <div className="mt-3 flex -space-x-2">
              {previewPlaces.map(
                (place) =>
                  place && (
                    <Photo
                      key={place.id}
                      seed={place.id}
                      kind={sceneOfPlace(place)}
                      className="h-8 w-8 rounded-full ring-2 ring-white"
                    />
                  ),
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <button
          type="button"
          onClick={() => navigate(ROUTES.planNew)}
          className="pressable flex w-full items-center gap-3 rounded-2xl border border-dashed border-brand-200 bg-brand-50 p-4 text-left"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-500 text-white">
            <Icon name="sparkle" size={20} strokeWidth={2.1} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-extrabold text-brand-600">새 일정 만들기</p>
            <p className="mt-0.5 text-[12px] text-ink-500">
              담아둔 {candidates.length}곳으로 바로 시작할 수 있어요
            </p>
          </div>
          <Icon name="chevron-right" size={18} className="text-brand-400" />
        </button>
      </div>

      <section className="mt-8 px-5">
        <h2 className="text-[15px] font-extrabold tracking-tight">지난 여행</h2>
        <div className="mt-3 rounded-2xl bg-ink-50 py-10 text-center">
          <p className="text-[13px] font-semibold text-ink-500">아직 지난 여행이 없어요</p>
          <p className="mt-1 text-[12px] text-ink-300">
            여행이 끝나면 다녀온 장소가 여기에 모여요
          </p>
        </div>
      </section>

      <section className="mt-8 px-5">
        <div className="rounded-2xl border border-ink-100 p-4">
          <p className="text-[13px] font-extrabold">일정을 더 잘 만드는 법</p>
          <ul className="mt-2.5 space-y-2 text-[12.5px] leading-relaxed text-ink-500">
            {TIPS.map((tip) => (
              <li key={tip} className="flex gap-2">
                <Icon name="check" size={14} className="mt-0.5 shrink-0 text-brand-500" />
                {tip}
              </li>
            ))}
          </ul>
          <Button
            variant="soft"
            size="md"
            full
            className="mt-3"
            onClick={() => navigate(ROUTES.home)}
          >
            SNS 링크로 장소 더 담기
          </Button>
        </div>
      </section>
    </div>
  )
}
