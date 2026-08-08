import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ErrorState, LoadingScreen, useToast } from '@/components/feedback'
import { useAuth } from '@/features/auth'
import { ROUTES } from '@/app/routes'

/** 카카오 로그인 리다이렉트(/auth/kakao?code=...)를 받아 JWT로 교환합니다. */
export default function KakaoCallbackPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { loginKakao } = useAuth()
  const [params] = useSearchParams()
  const [error, setError] = useState<unknown>(null)
  const requested = useRef(false) // 인가코드는 1회용 — StrictMode 중복 호출 방지

  const code = params.get('code')

  useEffect(() => {
    if (!code) {
      navigate(ROUTES.my, { replace: true })
      return
    }
    if (requested.current) return
    requested.current = true

    loginKakao(code)
      .then((user) => {
        toast(`${user.nickname}님, 반가워요!`, 'success')
        navigate(ROUTES.my, { replace: true })
      })
      .catch(setError)
  }, [code, loginKakao, navigate, toast])

  if (error) {
    return (
      <ErrorState
        error={error}
        full
        onRetry={() => navigate(ROUTES.my, { replace: true })}
        onSecondary={() => navigate(ROUTES.home, { replace: true })}
      />
    )
  }
  return <LoadingScreen title="카카오 계정으로 로그인하고 있어요" steps={['계정 확인 중']} current={0} />
}
