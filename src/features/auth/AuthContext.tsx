import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api } from '@/lib/api'
import type { AuthResponse, AuthUser } from '@/types'

const STORAGE_KEY = 'gp:auth'

/** 카카오 REST API 키 — 미설정이면 카카오 로그인은 "준비 중" 상태 */
const KAKAO_REST_KEY = import.meta.env.VITE_KAKAO_REST_KEY as string | undefined

interface StoredSession {
  token: string
  user: AuthUser
}

export interface AuthValue {
  user: AuthUser | null
  isLoggedIn: boolean
  /** 카카오 키가 설정돼 있어 실제 카카오 로그인이 가능한지 */
  kakaoReady: boolean
  /** 카카오 로그인 페이지로 이동 (kakaoReady가 false면 false 반환) */
  startKakaoLogin: () => boolean
  loginGuest: () => Promise<AuthUser>
  loginKakao: (code: string) => Promise<AuthUser>
  logout: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

function readSession(): StoredSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredSession) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(() => readSession())

  const save = useCallback((next: StoredSession | null) => {
    setSession(next)
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else window.localStorage.removeItem(STORAGE_KEY)
  }, [])

  // 앱 시작 시 토큰 유효성 확인 — 만료(게스트 24시간)면 조용히 로그아웃
  useEffect(() => {
    const current = readSession()
    if (!current) return
    api.me(current.token).catch(() => save(null))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const applyLogin = useCallback(
    (res: AuthResponse) => {
      save({ token: res.token, user: res.user })
      return res.user
    },
    [save],
  )

  const loginGuest = useCallback(async () => applyLogin(await api.loginGuest()), [applyLogin])
  const loginKakao = useCallback(
    async (code: string) => applyLogin(await api.loginKakao(code)),
    [applyLogin],
  )

  const startKakaoLogin = useCallback(() => {
    if (!KAKAO_REST_KEY) return false
    const redirectUri = `${window.location.origin}/auth/kakao`
    window.location.href =
      'https://kauth.kakao.com/oauth/authorize' +
      `?client_id=${KAKAO_REST_KEY}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`
    return true
  }, [])

  const logout = useCallback(() => save(null), [save])

  const value = useMemo<AuthValue>(
    () => ({
      user: session?.user ?? null,
      isLoggedIn: Boolean(session),
      kakaoReady: Boolean(KAKAO_REST_KEY),
      startKakaoLogin,
      loginGuest,
      loginKakao,
      logout,
    }),
    [session, startKakaoLogin, loginGuest, loginKakao, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.')
  return value
}
