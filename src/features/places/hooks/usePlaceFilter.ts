import { useMemo, useState } from 'react'
import type { Place, PlaceCategory } from '@/types'

export type CategoryFilter = PlaceCategory | 'all'
export type SortKey = 'rating' | 'review' | 'sns'

export interface PlaceFilterState {
  query: string
  setQuery: (v: string) => void
  regionId: string
  setRegionId: (v: string) => void
  category: CategoryFilter
  setCategory: (v: CategoryFilter) => void
  sort: SortKey
  setSort: (v: SortKey) => void
  result: Place[]
}

const SORTERS: Record<SortKey, (a: Place, b: Place) => number> = {
  rating: (a, b) => b.rating - a.rating,
  review: (a, b) => b.reviewCount - a.reviewCount,
  sns: (a, b) =>
    (b.source === 'sns' ? 1 : 0) - (a.source === 'sns' ? 1 : 0) || b.rating - a.rating,
}

function matchesQuery(place: Place, query: string) {
  const q = query.trim()
  if (!q) return true
  return (
    place.name.includes(q) ||
    place.city.includes(q) ||
    place.tags.some((tag) => tag.includes(q))
  )
}

/** 탐색 화면의 검색·필터·정렬 상태를 캡슐화 */
export function usePlaceFilter(places: Place[], initialRegionId = 'east-coast'): PlaceFilterState {
  const [query, setQuery] = useState('')
  const [regionId, setRegionId] = useState(initialRegionId)
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [sort, setSort] = useState<SortKey>('rating')

  const result = useMemo(() => {
    const filtered = places.filter(
      (p) =>
        (regionId === 'all' || p.regionId === regionId) &&
        (category === 'all' || p.category === category) &&
        matchesQuery(p, query),
    )
    return [...filtered].sort(SORTERS[sort])
  }, [places, regionId, category, query, sort])

  return {
    query,
    setQuery,
    regionId,
    setRegionId,
    category,
    setCategory,
    sort,
    setSort,
    result,
  }
}
