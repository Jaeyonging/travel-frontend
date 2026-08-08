import type {
  AppNotification,
  Festival,
  Itinerary,
  Place,
  Region,
  SnsContent,
  TripCondition,
} from './domain'

/** GET /api/bootstrap — 앱 첫 로딩 데이터 일괄 응답 */
export interface BootstrapData {
  places: Place[]
  regions: Region[]
  festivals: Festival[]
  snsContents: SnsContent[]
  /** 홈과 MY에서 대표로 보여주는 여행 */
  itinerary: Itinerary
  itineraries: Itinerary[]
  notifications: AppNotification[]
}

/** 로그인 사용자 */
export interface AuthUser {
  id: number
  nickname: string
  profileImage: string | null
  isGuest?: boolean
}

/** POST /api/auth/kakao · /api/auth/guest 응답 */
export interface AuthResponse {
  token: string
  user: AuthUser
}

/** SNS URL 분석 응답 */
export interface SnsAnalysisResult {
  content: SnsContent
  places: Place[]
}

/** 일정 생성 요청 */
export interface GenerateItineraryInput {
  placeIds: string[]
  condition: TripCondition
}
export type GenerateItineraryResult = Itinerary
