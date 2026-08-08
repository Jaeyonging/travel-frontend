import type {
  AuthResponse,
  BootstrapData,
  GenerateItineraryInput,
  GenerateItineraryResult,
  SnsAnalysisResult,
} from '@/types'
import { request } from './http'
import { throwIfSimulated } from './simulate'

function post<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/**
 * 실제 백엔드 API. 시그니처는 목업(mockApi)과 동일 — 명세는 .claude/api.md.
 * throwIfSimulated는 MY 탭 개발자 설정의 에러 화면 확인용 스위치입니다.
 */
export const api = {
  getBootstrap: (): Promise<BootstrapData> => {
    throwIfSimulated()
    return request('/api/bootstrap')
  },

  analyzeSnsUrl: (url: string): Promise<SnsAnalysisResult> => {
    throwIfSimulated()
    return post('/api/sns/analyze', { url })
  },

  generateItinerary: (input: GenerateItineraryInput): Promise<GenerateItineraryResult> => {
    throwIfSimulated()
    return post('/api/itinerary/generate', input)
  },

  /** 읽음 처리 — 화면은 낙관적으로 먼저 갱신하고 서버에는 비동기로 반영 */
  markNotificationRead: (id: string): Promise<{ ok: boolean }> =>
    post(`/api/notifications/${id}/read`, {}),

  markAllNotificationsRead: (): Promise<{ ok: boolean }> =>
    post('/api/notifications/read-all', {}),

  /** 게스트(체험) 계정 — 24시간 유효 */
  loginGuest: (): Promise<AuthResponse> => post('/api/auth/guest', {}),

  /** 카카오 인가코드 → JWT */
  loginKakao: (code: string): Promise<AuthResponse> => post('/api/auth/kakao', { code }),

  /** 세션 유효성 확인 (토큰 만료 시 401) */
  me: (token: string): Promise<{ id: number; nickname: string; profile_image: string | null }> =>
    request('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
}
