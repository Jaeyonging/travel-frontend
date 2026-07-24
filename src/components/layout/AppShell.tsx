import { Outlet, useLocation } from 'react-router-dom'
import { ErrorBoundary, OfflineBanner } from '@/components/feedback'
import { useCandidates } from '@/store'
import { cn } from '@/lib/cn'
import BottomTabBar from './BottomTabBar'
import PageTransition from './PageTransition'
import { isFullscreenRoute } from './navigation'

/**
 * 앱 셸 — 데스크톱에서도 480px 모바일 앱 화면으로 중앙 정렬됩니다.
 * 라우트마다 ErrorBoundary를 두어 한 화면의 오류가 앱 전체를 죽이지 않게 합니다.
 */
export default function AppShell() {
  const { pathname } = useLocation()
  const { candidateIds } = useCandidates()
  const fullscreen = isFullscreenRoute(pathname)

  return (
    <div className="flex min-h-screen justify-center bg-ink-100">
      <div className="pointer-events-none fixed inset-0 hidden bg-[radial-gradient(120%_80%_at_50%_-10%,#cdeaea_0%,#e9ebef_45%,#e9ebef_100%)] lg:block" />

      <div className="relative flex w-full max-w-[480px] flex-col bg-white shadow-app">
        <OfflineBanner />

        <PageTransition
          pathname={pathname}
          className={cn('flex-1', fullscreen ? 'pb-6' : 'pb-[82px]')}
        >
          <ErrorBoundary resetKey={pathname}>
            <Outlet />
          </ErrorBoundary>
        </PageTransition>

        <BottomTabBar hidden={fullscreen} savedCount={candidateIds.length} />
      </div>
    </div>
  )
}
