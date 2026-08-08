import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react'
import { ErrorState, LoadingScreen } from '@/components/feedback'
import { api } from '@/lib/api'
import { useAsync } from '@/hooks/useAsync'
import type {
  AppNotification,
  BootstrapData,
  Festival,
  Itinerary,
  Place,
  Region,
  SnsContent,
  TripCondition,
} from '@/types'
import { DEFAULT_CONDITION, INITIAL_ANALYZED_IDS, INITIAL_CANDIDATE_IDS } from './defaults'

export interface AppStoreValue {
  /** 카탈로그 (서버 /api/bootstrap 응답) */
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

const BOOT_STEPS = ['서버에 연결하는 중', '장소와 일정 불러오는 중']

/** 부트스트랩이 끝나야 앱을 그린다 — 로딩/실패 화면을 여기서 처리 */
export function AppStoreProvider({ children }: { children: ReactNode }) {
  const boot = useAsync<BootstrapData>(() => api.getBootstrap(), [])

  if (boot.isError) {
    return <ErrorState error={boot.error} onRetry={boot.retry} full />
  }
  if (!boot.data) {
    return <LoadingScreen title="여행 데이터를 불러오고 있어요" steps={BOOT_STEPS} current={1} />
  }
  return <LoadedStoreProvider data={boot.data}>{children}</LoadedStoreProvider>
}

function LoadedStoreProvider({ data, children }: { data: BootstrapData; children: ReactNode }) {
  const [candidateIds, setCandidateIds] = useState<string[]>(INITIAL_CANDIDATE_IDS)
  const [analyzedIds, setAnalyzedIds] = useState<string[]>(INITIAL_ANALYZED_IDS)
  const [condition, setCondition] = useState<TripCondition>(DEFAULT_CONDITION)
  const [excludedPlaceIds, setExcludedPlaceIds] = useState<string[]>([])
  const [notifications, setNotifications] = useState<AppNotification[]>(data.notifications)
  const [dayOrders, setDayOrders] = useState<Record<string, string[]>>({})
  const [savedTripIds, setSavedTripIds] = useState<string[]>(
    data.itinerary ? [data.itinerary.id] : [],
  )

  const placeMap = useMemo(() => new Map(data.places.map((p) => [p.id, p])), [data.places])

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
    void api.markNotificationRead(id).catch(() => {}) // 실패해도 화면 상태는 유지
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    void api.markAllNotificationsRead().catch(() => {})
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
      places: data.places,
      regions: data.regions,
      festivals: data.festivals,
      snsContents: data.snsContents,
      itineraries: data.itineraries,
      itinerary: data.itinerary,

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
      getItinerary: (id) => data.itineraries.find((it) => it.id === id),

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
      data,
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
