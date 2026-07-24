import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface BadgeProps {
  children: ReactNode
  className?: string
}

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold',
        className,
      )}
    >
      {children}
    </span>
  )
}
