import { cn } from '@/lib/cn'
import Icon from '@/components/icon'
import {
  WEEKDAY_LABELS,
  buildMonthGrid,
  formatMonthTitle,
  isBetween,
  isSameDate,
  startOfDay,
} from './calendar-utils'

export interface CalendarProps {
  /** 화면에 보이는 달 */
  month: Date
  onMonthChange: (next: Date) => void
  start: Date | null
  end: Date | null
  onSelect: (date: Date) => void
  /** 이 날짜 이전은 고를 수 없습니다 */
  minDate?: Date
}

/** 기간 선택용 월 달력 */
export default function Calendar({
  month,
  onMonthChange,
  start,
  end,
  onSelect,
  minDate,
}: CalendarProps) {
  const weeks = buildMonthGrid(month)
  const today = startOfDay(new Date())
  const min = minDate ? startOfDay(minDate) : null

  const canGoPrev =
    !min || month.getFullYear() * 12 + month.getMonth() > min.getFullYear() * 12 + min.getMonth()

  return (
    <div className="px-5">
      {/* 월 이동 */}
      <div className="flex items-center justify-between py-2">
        <button
          type="button"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          disabled={!canGoPrev}
          aria-label="이전 달"
          className="pressable-sm grid h-9 w-9 place-items-center rounded-full text-ink-700 disabled:text-ink-200"
        >
          <Icon name="chevron-left" size={20} strokeWidth={2.2} />
        </button>
        <p className="text-[15px] font-extrabold tracking-tight">{formatMonthTitle(month)}</p>
        <button
          type="button"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          aria-label="다음 달"
          className="pressable-sm grid h-9 w-9 place-items-center rounded-full text-ink-700"
        >
          <Icon name="chevron-right" size={20} strokeWidth={2.2} />
        </button>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 pb-1">
        {WEEKDAY_LABELS.map((label, i) => (
          <span
            key={label}
            className={cn(
              'py-1.5 text-center text-[11.5px] font-bold',
              i === 0 ? 'text-coral-500' : 'text-ink-300',
            )}
          >
            {label}
          </span>
        ))}
      </div>

      {/* 날짜 */}
      <div className="space-y-0.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((date, di) => {
              if (!date) return <span key={di} />

              const disabled = min ? date < min : false
              const isStart = isSameDate(date, start)
              const isEnd = isSameDate(date, end)
              const inRange = isBetween(date, start, end)
              const isEdge = isStart || isEnd
              const isToday = isSameDate(date, today)
              const hasRange = Boolean(start && end)

              return (
                <button
                  key={di}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelect(date)}
                  aria-pressed={isEdge}
                  className="relative h-11 disabled:cursor-not-allowed"
                >
                  {/* 기간 배경 */}
                  {(inRange || (isEdge && hasRange && !isSameDate(start, end))) && (
                    <span
                      className={cn(
                        'absolute inset-y-1 bg-brand-50',
                        inRange && 'inset-x-0',
                        isStart && !inRange && 'left-1/2 right-0',
                        isEnd && !inRange && 'left-0 right-1/2',
                      )}
                    />
                  )}

                  {/* 날짜 */}
                  <span
                    className={cn(
                      'relative mx-auto grid h-9 w-9 place-items-center rounded-full text-[13.5px] transition-colors',
                      isEdge && 'bg-brand-500 font-extrabold text-white shadow-sm',
                      !isEdge && inRange && 'font-bold text-brand-600',
                      !isEdge && !inRange && !disabled && 'font-semibold text-ink-700',
                      disabled && 'font-medium text-ink-200',
                      !isEdge && !disabled && di === 0 && 'text-coral-500',
                    )}
                  >
                    {date.getDate()}
                  </span>

                  {isToday && !isEdge && (
                    <span className="absolute inset-x-0 bottom-0.5 mx-auto h-1 w-1 rounded-full bg-brand-500" />
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
