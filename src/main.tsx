import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/app/App'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('#root 엘리먼트를 찾을 수 없습니다.')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// PWA: 빌드된 앱에서만 서비스 워커를 등록합니다 (개발 중 캐시 혼선 방지)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* 등록 실패는 앱 동작에 영향을 주지 않습니다 */
    })
  })
}
