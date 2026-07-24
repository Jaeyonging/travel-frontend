import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary, ToastProvider } from '@/components/feedback'
import { AppStoreProvider } from '@/store'

/** 앱 전역 Provider 구성 — 최상단 ErrorBoundary가 마지막 방어선입니다. */
export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <AppStoreProvider>
        <ToastProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </ToastProvider>
      </AppStoreProvider>
    </ErrorBoundary>
  )
}
