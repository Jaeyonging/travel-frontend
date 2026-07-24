import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '@/components/icon'
import MockMap from '@/components/map'
import { Button, Chip, EmptyState, StatRow } from '@/components/ui'
import { TopBar } from '@/components/layout'
import { useToast } from '@/components/feedback'
import { PlaceDetailSheet, PlaceRow } from '@/features/places'
import { CATEGORY_META, DAY_COLORS } from '@/lib/constants'
import { formatMinutes } from '@/lib/format'
import { useCandidates } from '@/store'
import { ROUTES } from '@/app/routes'
import type { Place, PlaceCategory } from '@/types'

type SavedFilter = PlaceCategory | 'all' | 'sns'

const FILTERS: { id: SavedFilter; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'sns', label: 'SNS에서 담은 곳' },
  { id: 'attraction', label: CATEGORY_META.attraction.label },
  { id: 'food', label: CATEGORY_META.food.label },
  { id: 'cafe', label: CATEGORY_META.cafe.label },
  { id: 'stay', label: CATEGORY_META.stay.label },
]

export default function SavedPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { candidates, toggleCandidate } = useCandidates()

  const [filter, setFilter] = useState<SavedFilter>('all')
  const [detail, setDetail] = useState<Place | null>(null)
  const [showMap, setShowMap] = useState(true)

  const list = candidates.filter((p) =>
    filter === 'all' ? true : filter === 'sns' ? p.source === 'sns' : p.category === filter,
  )

  const stats = useMemo(() => {
    const stayMinutes = candidates.reduce((sum, p) => sum + p.stayMinutes, 0)
    return {
      stayMinutes,
      snsCount: candidates.filter((p) => p.source === 'sns').length,
      needsCheck: candidates.filter((p) => p.verification === 'needs_check').length,
    }
  }, [candidates])

  if (candidates.length === 0) {
    return (
      <div>
        <TopBar title="담은 곳" />
        <EmptyState
          icon="bookmark"
          title="아직 담은 곳이 없어요"
          description={
            <>
              SNS에서 본 영상 링크를 붙여넣으면
              <br />
              장소를 자동으로 담아드려요.
            </>
          }
          action={
            <Button size="lg" onClick={() => navigate(ROUTES.home)}>
              링크 붙여넣으러 가기
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="pb-2">
      <TopBar
        title="담은 곳"
        right={
          <button
            type="button"
            onClick={() => setShowMap((v) => !v)}
            className="pressable flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12.5px] font-bold text-ink-700"
          >
            <Icon name="pin" size={15} />
            {showMap ? '지도 접기' : '지도 보기'}
          </button>
        }
      />

      {showMap && (
        <div className="relative">
          <MockMap
            markers={candidates.map((place, i) => ({
              place,
              index: i + 1,
              color: place.city === '속초' ? DAY_COLORS[1] : DAY_COLORS[0],
              active: detail?.id === place.id,
            }))}
            height={260}
            showLabels={false}
            onSelect={(id) => setDetail(candidates.find((p) => p.id === id) ?? null)}
          />
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {[
              [DAY_COLORS[0], '강릉 권역'],
              [DAY_COLORS[1], '속초 권역'],
            ].map(([color, label]) => (
              <span
                key={label}
                className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10.5px] font-bold text-ink-700 backdrop-blur"
              >
                <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 py-4">
        <StatRow
          stats={[
            { label: '담은 곳', value: `${candidates.length}곳` },
            { label: 'SNS 발견', value: `${stats.snsCount}곳` },
            { label: '예상 체류', value: formatMinutes(stats.stayMinutes) },
          ]}
        />
      </div>

      {stats.needsCheck > 0 && (
        <div className="mx-5 mb-3 flex items-start gap-2 rounded-xl bg-coral-50 px-3 py-2.5">
          <Icon name="alert" size={15} className="mt-0.5 shrink-0 text-coral-500" />
          <p className="text-[11.5px] leading-relaxed text-coral-600">
            공공데이터에서 확인되지 않은 장소가 {stats.needsCheck}곳 있어요. 일정에 넣기 전에 한
            번 확인해 주세요.
          </p>
        </div>
      )}

      <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-5 pb-3">
        {FILTERS.map((f) => (
          <Chip key={f.id} size="sm" active={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </Chip>
        ))}
      </div>

      <ul className="divide-y divide-ink-100 border-t border-ink-100">
        {list.map((place, i) => (
          <li key={place.id}>
            <PlaceRow
              place={place}
              rank={i + 1}
              saved
              onToggle={() => {
                toggleCandidate(place.id)
                toast('담은 곳에서 뺐어요', 'remove')
              }}
              onOpen={() => setDetail(place)}
            />
          </li>
        ))}
      </ul>

      <div className="px-5 py-5">
        <button
          type="button"
          onClick={() => navigate(ROUTES.explore)}
          className="pressable flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-ink-200 py-4 text-[13.5px] font-bold text-ink-500"
        >
          <Icon name="plus" size={16} strokeWidth={2.2} />
          장소 더 찾아보기
        </button>
      </div>

      <div className="sticky bottom-[62px] z-30 border-t border-ink-100 bg-white/95 px-5 py-3 backdrop-blur">
        <Button
          size="lg"
          full
          onClick={() => navigate(ROUTES.planNew)}
          disabled={candidates.length < 2}
        >
          <Icon name="sparkle" size={18} strokeWidth={2.2} />
          {candidates.length}곳으로 일정 만들기
        </Button>
      </div>

      <PlaceDetailSheet place={detail} onClose={() => setDetail(null)} />
    </div>
  )
}
