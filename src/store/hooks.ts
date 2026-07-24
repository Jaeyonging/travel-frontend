import { useContext } from 'react'
import { AppStoreContext, type AppStoreValue } from './AppStoreContext'

export function useStore(): AppStoreValue {
  const store = useContext(AppStoreContext)
  if (!store) throw new Error('useStore는 AppStoreProvider 안에서만 사용할 수 있습니다.')
  return store
}

/** 담은 곳 관련 상태만 필요한 화면용 셀렉터 */
export function useCandidates() {
  const { candidateIds, candidates, isCandidate, toggleCandidate, removeCandidate, addCandidates } =
    useStore()
  return { candidateIds, candidates, isCandidate, toggleCandidate, removeCandidate, addCandidates }
}

/** 카탈로그(장소·권역·축제·SNS) 셀렉터 */
export function useCatalog() {
  const { places, regions, festivals, snsContents, getPlace } = useStore()
  return { places, regions, festivals, snsContents, getPlace }
}

/** 일정 관련 셀렉터 */
export function useTrip() {
  const { itinerary, condition, setCondition, excludedPlaceIds, toggleExcluded, getPlace } =
    useStore()
  return { itinerary, condition, setCondition, excludedPlaceIds, toggleExcluded, getPlace }
}

/** 알림 셀렉터 */
export function useNotifications() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useStore()
  return { notifications, unreadCount, markNotificationRead, markAllNotificationsRead }
}
