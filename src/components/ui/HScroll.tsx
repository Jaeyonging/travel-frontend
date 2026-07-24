import type { ReactNode } from 'react'

/** 가로 스크롤 캐러셀 컨테이너 */
export default function HScroll({ children }: { children: ReactNode }) {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
      {children}
      <span className="w-1 shrink-0" aria-hidden="true" />
    </div>
  )
}
