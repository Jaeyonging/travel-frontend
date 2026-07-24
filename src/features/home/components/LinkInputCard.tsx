import { useState } from 'react'
import Icon from '@/components/icon'
import { Button } from '@/components/ui'
import type { SnsContent } from '@/types'

export interface LinkInputCardProps {
  samples: SnsContent[]
  onAnalyze: (url: string) => void
  onPasteFallback: () => string
  onToast: (message: string) => void
}

/** 홈 최상단 — SNS 링크 입력 히어로 */
export default function LinkInputCard({
  samples,
  onAnalyze,
  onPasteFallback,
  onToast,
}: LinkInputCardProps) {
  const [url, setUrl] = useState('')

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setUrl(text)
        return
      }
    } catch {
      /* 클립보드 권한 없음 — 예시 링크로 대체 */
    }
    setUrl(onPasteFallback())
    onToast('예시 링크를 넣었어요')
  }

  return (
    <section className="relative overflow-hidden bg-brand-600 px-5 pb-6 pt-6 text-white">
      <div className="pointer-events-none absolute -right-16 -top-10 h-48 w-48 rounded-full bg-brand-400/40 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 left-4 h-40 w-40 rounded-full bg-coral-500/25 blur-2xl" />

      <div className="relative">
        <p className="text-[12.5px] font-bold text-brand-100">2025~2026 강원 방문의 해</p>
        <h1 className="mt-1.5 text-[24px] font-extrabold leading-[1.32] tracking-tight">
          SNS에서 본 그곳,
          <br />
          링크만 붙여넣으면 일정이 돼요
        </h1>

        <div className="mt-4 rounded-2xl bg-white p-2 shadow-lg">
          <div className="flex items-center gap-2 px-2">
            <Icon name="link" size={18} className="shrink-0 text-ink-300" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAnalyze(url)}
              placeholder="유튜브 · 인스타 링크 붙여넣기"
              aria-label="SNS 링크"
              className="h-11 w-full bg-transparent text-[14px] text-ink-900 outline-none placeholder:text-ink-300"
            />
            {url ? (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink-50 text-ink-500"
                aria-label="지우기"
              >
                <Icon name="close" size={14} strokeWidth={2.4} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePaste}
                className="pressable shrink-0 rounded-lg bg-ink-50 px-2.5 py-1.5 text-[12px] font-bold text-ink-700"
              >
                붙여넣기
              </button>
            )}
          </div>

          <Button size="lg" full className="mt-2" onClick={() => onAnalyze(url)}>
            <Icon name="sparkle" size={17} strokeWidth={2.2} />
            여행지 찾아내기
          </Button>
        </div>

        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
          {samples.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onAnalyze(sample.url)}
              className="pressable flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-semibold backdrop-blur"
            >
              <Icon name={sample.platform === 'youtube' ? 'play' : 'instagram'} size={12} />
              {sample.title.slice(0, 12)}…
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
