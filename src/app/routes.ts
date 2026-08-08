/** 앱 내 경로를 한곳에서 관리합니다. */
export const ROUTES = {
  home: '/',
  explore: '/explore',
  saved: '/saved',
  trips: '/trips',
  my: '/my',
  kakaoCallback: '/auth/kakao',
  notifications: '/notifications',
  extractResult: '/extract/result',
  planNew: '/plan/new',
  plan: (id: string) => `/plan/${id}`,
  planPattern: '/plan/:id',
} as const
