/* 강원 플랜잇 서비스 워커 — 앱 셸 캐싱 + 오프라인 폴백 */
const VERSION = 'v1'
const SHELL = `shell-${VERSION}`
const RUNTIME = `runtime-${VERSION}`
const SHELL_FILES = ['/', '/index.html', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => ![SHELL, RUNTIME].includes(k)).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  if (request.method !== 'GET') return

  // SPA 라우팅: 네트워크 우선, 실패 시 캐시된 index.html
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).catch(() => caches.match('/index.html').then((r) => r || caches.match('/'))),
    )
    return
  }

  // 정적 자산: 캐시 우선 + 백그라운드 갱신
  e.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          if (res.ok && new URL(request.url).origin === self.location.origin) {
            const copy = res.clone()
            caches.open(RUNTIME).then((c) => c.put(request, copy))
          }
          return res
        }),
    ),
  )
})
