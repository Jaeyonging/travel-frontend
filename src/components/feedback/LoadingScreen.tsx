import type { ReactNode } from 'react'
import Icon from '@/components/icon'
import { cn } from '@/lib/cn'

export interface LoadingScreenProps {
  title: ReactNode
  steps: string[]
  /** 현재 진행 중인 단계 index */
  current: number
  icon?: 'sparkle' | 'search'
}

/** 분석·생성처럼 시간이 걸리는 작업의 진행 화면 */
export default function LoadingScreen({
  title,
  steps,
  current,
  icon = 'sparkle',
}: LoadingScreenProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-10 pb-16 text-center">
      <div className="relative grid h-24 w-24 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-100" />
        <span className="relative grid h-[76px] w-[76px] place-items-center rounded-full bg-brand-500 text-white">
          <Icon name={icon} size={30} strokeWidth={2} />
        </span>
      </div>

      <h2 className="mt-8 text-[20px] font-extrabold leading-snug tracking-tight">{title}</h2>

      <ol className="mt-7 w-full space-y-2.5 text-left">
        {steps.map((step, i) => {
          const done = current > i
          const active = current === i
          return (
            <li key={step} className="flex items-center gap-2.5">
              <span
                className={cn(
                  'grid h-5 w-5 shrink-0 place-items-center rounded-full',
                  done && 'bg-brand-500 text-white',
                  active && 'animate-spin border-2 border-brand-300 border-t-brand-500',
                  !done && !active && 'bg-ink-100',
                )}
              >
                {done && <Icon name="check" size={12} strokeWidth={3} />}
              </span>
              <span
                className={cn(
                  'text-[13.5px] font-semibold',
                  done || active ? 'text-ink-900' : 'text-ink-300',
                )}
              >
                {step}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
