import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react'
import {
  FESTIVALS,
  ITINERARIES,
  NOTIFICATIONS,
  PLACES,
  REGIONS,
  SAMPLE_ITINERARY,
  SNS_CONTENTS,
} from '@/lib/api'
import type {
  AppNotification,
  Festival,
  Itinerary,
  Place,
  Region,
  SnsContent,
  TripCondition,
} from '@/types'
import { DEFAULT_CONDITION, INITIAL_ANALYZED_IDS, INITIAL_CANDIDATE_IDS } from './defaults'

export interface AppStoreValue {
  /** 카탈로그 (백엔드 연동 시 서버 응답으로 대체) */
  places: Place[]
  regions: Region[]
  festivals: Festival[]
  snsContents: SnsContent[]
  /** 권역별로 준비된 일정 전부 */
  itineraries: Itinerary[]
  /** 홈과 MY에서 대표로 보여주는 여행 */
  itinerary: Itinerary

  /** 사용자 상태 */
  candidateIds: string[]
  candidates: Place[]
  analyzedIds: string[]
  condition: TripCondition
  excludedPlaceIds: string[]
  notifications: AppNotification[]
  unreadCount: number
  /** 저장한 여행 id 목록 */
  savedTripIds: string[]
  /** 사용자가 직접 바꾼 Day별 장소 순서. 키는 `${일정id}-${day}` */
  dayOrders: Record<string, string[]>
  getItinerary: (id: string) => Itinerary | undefined

  getPlace: (id: string) => Place | undefined
  isCandidate: (id: string) => boolean
  toggleCandidate: (id: string) => void
  removeCandidate: (id: string) => void
  addCandidates: (ids: string[]) => void
  markAnalyzed: (id: string) => void
  setCondition: (condition: TripCondition) => void
  toggleExcluded: (id: string) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  setDayOrder: (key: string, placeIds: string[]) => void
  resetDayOrder: (key: string) => void
  addSavedTrip: (id: string) => void
}

export const AppStoreContext = createContext<AppStoreValue | null>(null)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [candidateIds, setCandidateIds] = useState<string[]>(INITIAL_CANDIDATE_IDS)
  const [analyzedIds, setAnalyzedIds] = useState<string[]>(INITIAL_ANALYZED_IDS)
  const [condition, setCondition] = useState<TripCondition>(DEFAULT_CONDITION)
  const [excludedPlaceIds, setExcludedPlaceIds] = useState<string[]>([])
  const [notifications, setNotifications] = useState<AppNotification[]>(NOTIFICATIONS)
  const [dayOrders, setDayOrders] = useState<Record<string, string[]>>({})
  const [savedTripIds, setSavedTripIds] = useState<string[]>([ITINERARIES[0].id])

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

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const setDayOrder = useCallback((key: string, placeIds: string[]) => {
    setDayOrders((prev) => ({ ...prev, [key]: placeIds }))
  }, [])

  const resetDayOrder = useCallback((key: string) => {
    setDayOrders((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const addSavedTrip = useCallback((id: string) => {
    setSavedTripIds((prev) => (prev.includes(id) ? prev : [id, ...prev]))
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
      itineraries: ITINERARIES,
      itinerary: SAMPLE_ITINERARY,

      candidateIds,
      candidates: candidateIds
        .map((id) => placeMap.get(id))
        .filter((p): p is Place => Boolean(p)),
      analyzedIds,
      condition,
      excludedPlaceIds,
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      savedTripIds,
      dayOrders,
      getItinerary: (id) => ITINERARIES.find((it) => it.id === id),

      getPlace,
      isCandidate: (id) => candidateIds.includes(id),
      toggleCandidate,
      removeCandidate,
      addCandidates,
      markAnalyzed,
      setCondition,
      toggleExcluded,
      markNotificationRead,
      markAllNotificationsRead,
      setDayOrder,
      resetDayOrder,
      addSavedTrip,
    }),
    [
      candidateIds,
      analyzedIds,
      condition,
      excludedPlaceIds,
      notifications,
      savedTripIds,
      dayOrders,
      placeMap,
      getPlace,
      toggleCandidate,
      removeCandidate,
      addCandidates,
      markAnalyzed,
      toggleExcluded,
      markNotificationRead,
      markAllNotificationsRead,
      setDayOrder,
      resetDayOrder,
      addSavedTrip,
    ],
  )

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}
