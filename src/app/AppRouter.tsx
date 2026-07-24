import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from '@/components/layout'
import {
  ExplorePage,
  ExtractResultPage,
  HomePage,
  MyPage,
  NotFoundPage,
  NotificationsPage,
  PlanNewPage,
  PlanResultPage,
  SavedPage,
  TripsPage,
} from '@/pages'
import { ROUTES } from './routes'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<AppShell />}>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.explore} element={<ExplorePage />} />
          <Route path={ROUTES.saved} element={<SavedPage />} />
          <Route path={ROUTES.trips} element={<TripsPage />} />
          <Route path={ROUTES.my} element={<MyPage />} />
          <Route path={ROUTES.notifications} element={<NotificationsPage />} />
          <Route path={ROUTES.extractResult} element={<ExtractResultPage />} />
          <Route path={ROUTES.planNew} element={<PlanNewPage />} />
          <Route path={ROUTES.planPattern} element={<PlanResultPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </>
  )
}
