import type { ReactNode } from 'react'

/** 목업 데이터임을 알리는 안내 박스 */
export default function MockNotice({ children }: { children: ReactNode }) {
  return (
    <div className="mx-5 flex items-start gap-2 rounded-xl bg-ink-50 px-3 py-2.5 text-[11.5px] leading-relaxed text-ink-500">
      <span className="mt-px shrink-0 font-bold text-ink-300">DEMO</span>
      <span>{children}</span>
    </div>
  )
}
