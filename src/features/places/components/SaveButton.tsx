import type { MouseEvent } from 'react'
import Icon from '@/components/icon'
import { cn } from '@/lib/cn'

export interface SaveButtonProps {
  saved: boolean
  onToggle: () => void
  tone?: 'light' | 'dark'
}

/** 후보함 담기/빼기 토글 버튼 */
export default function SaveButton({ saved, onToggle, tone = 'light' }: SaveButtonProps) {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    onToggle()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? '담기 취소' : '담기'}
      aria-pressed={saved}
      className={cn(
        'pressable-sm grid h-8 w-8 place-items-center rounded-full transition',
        saved
          ? 'bg-brand-500 text-white'
          : tone === 'dark'
            ? 'bg-ink-900/40 text-white backdrop-blur active:bg-ink-900/60'
            : 'bg-white/90 text-ink-700 backdrop-blur active:bg-white',
      )}
    >
      <Icon name={saved ? 'check' : 'plus'} size={17} strokeWidth={2.4} />
    </button>
  )
}
