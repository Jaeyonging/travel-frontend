import type { ReactNode } from 'react'
import Icon from '@/components/icon'
import { cn } from '@/lib/cn'

export interface SectionProps {
  title: string
  desc?: string
  action?: string
  onAction?: () => void
  children: ReactNode
  className?: string
}

/** 피드 섹션 헤더 + 본문 */
export default function Section({
  title,
  desc,
  action,
  onAction,
  children,
  className,
}: SectionProps) {
  return (
    <section className={cn('py-6', className)}>
      <div className="mb-3 flex items-end justify-between gap-3 px-5">
        <div>
          <h2 className="text-[17px] font-extrabold leading-tight tracking-tight">{title}</h2>
          {desc && <p className="mt-1 text-[12.5px] leading-snug text-ink-500">{desc}</p>}
        </div>
        {action && (
          <button
            type="button"
            onClick={onAction}
            className="pressable flex shrink-0 items-center gap-0.5 text-[12.5px] font-bold text-ink-500"
          >
            {action}
            <Icon name="chevron-right" size={14} strokeWidth={2.2} />
          </button>
        )}
      </div>
      {children}
    </section>
  )
}
