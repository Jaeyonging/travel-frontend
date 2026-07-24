import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface ChipProps {
  children: ReactNode
  active?: boolean
  size?: 'sm' | 'md'
  onClick?: () => void
}

export default function Chip({ children, active, size = 'md', onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'pressable shrink-0 rounded-full border font-semibold transition',
        size === 'sm' ? 'px-3 py-1.5 text-[12.5px]' : 'px-3.5 py-2 text-[13.5px]',
        active
          ? 'border-brand-500 bg-brand-500 text-white'
          : 'border-ink-200 bg-white text-ink-700 active:bg-ink-50',
      )}
    >
      {children}
    </button>
  )
}
