import Icon, { type IconName } from '@/components/icon'
import { cn } from '@/lib/cn'
import { formatKm, formatMinutes } from '@/lib/format'
import type { ItineraryDay } from '@/types'
import type { DayStats } from '../utils/stats'

export interface DaySummaryProps {
  day: ItineraryDay
  stats: DayStats
  reordering: boolean
  onToggleReorder: () => void
}

interface Cell {
  label: string
  value: string
  icon: IconName
  /** 머무는 것과 이동하는 것을 색으로 나눕니다 */
  tone: 'stay' | 'move'
}

/** 하루 일정 요약 */
export default function DaySummary({
  day,
  stats,
  reordering,
  onToggleReorder,
}: DaySummaryProps) {
  const cells: Cell[] = [
    { label: '들르는 곳', value: `${stats.placeCount}곳`, icon: 'pin', tone: 'stay' },
    { label: '머무는 시간', value: formatMinutes(stats.stayMinutes), icon: 'clock', tone: 'stay' },
    { label: '이동 거리', value: formatKm(stats.distanceKm), icon: 'car', tone: 'move' },
    { label: '이동 시간', value: formatMinutes(stats.moveMinutes), icon: 'route', tone: 'move' },
  ]

  return (
    <section className="px-5 pt-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11.5px] font-bold text-ink-300">
            DAY {day.day} · 이 날 하루만
          </p>
          <h2 className="mt-0.5 truncate text-[18px] font-extrabold tracking-tight">
            {day.label}
          </h2>
        </div>
        <button
          type="button"
          onClick={onToggleReorder}
          className={cn(
            'pressable flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[12.5px] font-extrabold transition',
            reordering ? 'bg-brand-500 text-white' : 'bg-ink-50 text-ink-700',
          )}
        >
          <Icon name={reordering ? 'check' : 'grip'} size={15} strokeWidth={2.3} />
          {reordering ? '완료' : '순서 변경'}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className={cn(
              'rounded-2xl px-4 py-3.5',
              cell.tone === 'move' ? 'bg-brand-50' : 'bg-ink-50',
            )}
          >
            <p
              className={cn(
                'flex items-center gap-1 text-[11.5px] font-semibold',
                cell.tone === 'move' ? 'text-brand-600' : 'text-ink-500',
              )}
            >
              <Icon name={cell.icon} size={13} strokeWidth={2} />
              {cell.label}
            </p>
            <p
              className={cn(
                'mt-1.5 text-[20px] font-extrabold leading-none tracking-tight',
                cell.tone === 'move' ? 'text-brand-700' : 'text-ink-900',
              )}
            >
              {cell.value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-2.5 px-1 text-[11.5px] leading-relaxed text-ink-500">
        아래 두 칸은 장소 사이를 옮겨다니는 데 쓰는 시간이에요. 머무는 시간과 따로 계산했습니다.
      </p>
    </section>
  )
}
