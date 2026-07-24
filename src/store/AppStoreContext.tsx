import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react'
import { FESTIVALS, PLACES, REGIONS, SAMPLE_ITINERARY, SNS_CONTENTS } from '@/lib/api'
import type { Festival, Itinerary, Place, Region, SnsContent, TripCondition } from '@/types'
import { DEFAULT_CONDITION, INITIAL_ANALYZED_IDS, INITIAL_CANDIDATE_IDS } from './defaults'

export interface AppStoreValue {
  /** 카탈로그 (백엔드 연동 시 서버 응답으로 대체) */
  places: Place[]
  regions: Region[]
  festivals: Festival[]
  snsContents: SnsContent[]
  itinerary: Itinerary

  /** 사용자 상태 */
  candidateIds: string[]
  candidates: Place[]
  analyzedIds: string[]
  condition: TripCondition
  excludedPlaceIds: string[]

  getPlace: (id: string) => Place | undefined
  isCandidate: (id: string) => boolean
  toggleCandidate: (id: string) => void
  removeCandidate: (id: string) => void
  addCandidates: (ids: string[]) => void
  markAnalyzed: (id: string) => void
  setCondition: (condition: TripCondition) => void
  toggleExcluded: (id: string) => void
}

export const AppStoreContext = createContext<AppStoreValue | null>(null)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [candidateIds, setCandidateIds] = useState<string[]>(INITIAL_CANDIDATE_IDS)
  const [analyzedIds, setAnalyzedIds] = useState<string[]>(INITIAL_ANALYZED_IDS)
  const [condition, setCondition] = useState<TripCondition>(DEFAULT_CONDITION)
  const [excludedPlaceIds, setExcludedPlaceIds] = useState<string[]>([])

  const placeMap = useMemo(() => new Map(PLACES.map((p) => [p.id, p])), [])

  const getPlace = useCallback((id: string) => placeMap.get(id), [placeMap])

  const toggleCandidate = useCallback((id: string) => {
    setCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }, [])

  const removeCandidate = useCallback((id: string) => {
    setCandidateIds((prev) => prev.filter((x) => x !== id))
  }, [])

  const addCandidates = useCallback((ids: string[]) => {
    setCandidateIds((prev) => Array.from(new Set([...prev, ...ids])))
  }, [])

  const markAnalyzed = useCallback((id: string) => {
    setAnalyzedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const toggleExcluded = useCallback((id: string) => {
    setExcludedPlaceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }, [])

  const value = useMemo<AppStoreValue>(
    () => ({
      places: PLACES,
      regions: REGIONS,
      festivals: FESTIVALS,
      snsContents: SNS_CONTENTS,
      itinerary: SAMPLE_ITINERARY,

      candidateIds,
      candidates: candidateIds
        .map((id) => placeMap.get(id))
        .filter((p): p is Place => Boolean(p)),
      analyzedIds,
      condition,
      excludedPlaceIds,

      getPlace,
      isCandidate: (id) => candidateIds.includes(id),
      toggleCandidate,
      removeCandidate,
      addCandidates,
      markAnalyzed,
      setCondition,
      toggleExcluded,
    }),
    [
      candidateIds,
      analyzedIds,
      condition,
      excludedPlaceIds,
      placeMap,
      getPlace,
      toggleCandidate,
      removeCandidate,
      addCandidates,
      markAnalyzed,
      toggleExcluded,
    ],
  )

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}
