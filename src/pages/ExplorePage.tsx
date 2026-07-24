import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Icon from '@/components/icon'
import { Button, Chip, EmptyState } from '@/components/ui'
import { useToast } from '@/components/feedback'
import { PlaceDetailSheet, PlaceRow, usePlaceFilter, type CategoryFilter } from '@/features/places'
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/constants'
import { cn } from '@/lib/cn'
import { useCandidates, useCatalog } from '@/store'
import { ROUTES } from '@/app/routes'
import type { Place } from '@/types'

const CATEGORY_FILTERS: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: '전체' },
  ...CATEGORY_ORDER.map((id) => ({ id, label: CATEGORY_META[id].label })),
]

const SORTS = [
  { id: 'rating', label: '평점순' },
  { id: 'review', label: '리뷰순' },
  { id: 'sns', label: 'SNS 언급순' },
] as const

export default function ExplorePage() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: { regionId?: string } }
  const toast = useToast()

  const { places, regions } = useCatalog()
  const { isCandidate, toggleCandidate } = useCandidates()
  const filter = usePlaceFilter(places, state?.regionId ?? 'east-coast')
  const [detail, setDetail] = useState<Place | null>(null)

  const handleToggle = (place: Place) => {
    const wasSaved = isCandidate(place.id)
    toggleCandidate(place.id)
    toast(wasSaved ? '담은 곳에서 뺐어요' : '담은 곳에 추가했어요', wasSaved ? 'remove' : 'success')
  }

  return (
    <div>
      <header className="sticky top-0 z-30 bg-white/95 pt-3 backdrop-blur-md">
        <div className="px-5">
          <div className="flex items-center gap-2 rounded-2xl bg-ink-50 px-3.5">
            <Icon name="search" size={18} className="text-ink-300" />
            <input
              value={filter.query}
              onChange={(e) => filter.setQuery(e.target.value)}
              placeholder="장소, 시군, 키워드 검색"
              aria-label="장소 검색"
              className="h-11 w-full bg-transparent text-[14px] outline-none placeholder:text-ink-300"
            />
            {filter.query && (
              <button type="button" onClick={() => filter.setQuery('')} aria-label="지우기">
                <Icon name="close" size={16} className="text-ink-300" />
              </button>
            )}
          </div>
        </div>

        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto px-5">
          <Chip
            size="sm"
            active={filter.regionId === 'all'}
            onClick={() => filter.setRegionId('all')}
          >
            전체 권역
          </Chip>
          {regions.map((region) => (
            <Chip
              key={region.id}
              size="sm"
              active={filter.regionId === region.id}
              onClick={() => filter.setRegionId(region.id)}
            >
              {region.name}
            </Chip>
          ))}
        </div>

        <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto px-5 pb-3">
          {CATEGORY_FILTERS.map((c) => (
            <Chip
              key={c.id}
              size="sm"
              active={filter.category === c.id}
              onClick={() => filter.setCategory(c.id)}
            >
              {c.label}
            </Chip>
          ))}
        </div>
        <div className="h-px bg-ink-100" />
      </header>

      <div className="flex items-center justify-between px-5 py-3">
        <p className="text-[12.5px] font-semibold text-ink-500">
          {filter.result.length}곳
          {filter.regionId !== 'all' &&
            ` · ${regions.find((r) => r.id === filter.regionId)?.name ?? ''}`}
        </p>
        <div className="flex gap-1">
          {SORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => filter.setSort(s.id)}
              className={cn(
                'rounded-lg px-2 py-1 text-[12px] font-bold',
                filter.sort === s.id ? 'text-ink-900' : 'text-ink-300',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {filter.result.length > 0 ? (
        <ul className="divide-y divide-ink-100">
          {filter.result.map((place) => (
            <li key={place.id}>
              <PlaceRow
                place={place}
                saved={isCandidate(place.id)}
                onToggle={() => handleToggle(place)}
                onOpen={() => setDetail(place)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="찾는 장소가 없어요"
          description="SNS 링크를 등록하면 새로운 장소를 추가할 수 있어요."
          action={
            <Button onClick={() => navigate(ROUTES.home)}>SNS 링크 등록하기</Button>
          }
        />
      )}

      <div className="px-5 pb-6 pt-4">
        <p className="text-[11.5px] leading-relaxed text-ink-300">
          목록은 한국관광공사 지역기반 관광정보 조회 API 결과를 가정한 목업 데이터입니다.
        </p>
      </div>

      <PlaceDetailSheet place={detail} onClose={() => setDetail(null)} />
    </div>
  )
}
