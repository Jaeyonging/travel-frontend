import { cn } from '@/lib/cn'
import type { ItineraryDay } from '@/types'

export interface DayTabsProps {
  days: ItineraryDay[]
  activeIndex: number
  onChange: (index: number) => void
}

export default function DayTabs({ days, activeIndex, onChange }: DayTabsProps) {
  return (
    <div className="sticky top-0 z-30 mt-5 border-b border-ink-100 bg-white/95 backdrop-blur">
      <div className="flex px-5" role="tablist">
        {days.map((day, i) => (
          <button
            key={day.day}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            onClick={() => onChange(i)}
            className={cn(
              'pressable relative flex-1 py-3 text-left transition-colors duration-200',
              i === activeIndex ? 'text-ink-900' : 'text-ink-300',
            )}
          >
            <p className="text-[14px] font-extrabold">DAY {day.day}</p>
            <p className="mt-0.5 text-[11px] font-semibold">
              {day.date.slice(5).replace('-', '.')} · {day.label}
            </p>
            <span
              className={cn(
                'absolute inset-x-0 -bottom-px h-0.5 origin-left rounded-full bg-ink-900 transition-transform duration-300 ease-spring',
                i === activeIndex ? 'scale-x-100' : 'scale-x-0',
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
