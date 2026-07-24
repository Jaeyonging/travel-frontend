import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import Button from './Button'
import Calendar from './Calendar'
import Sheet from './Sheet'
import { diffDays, formatDayLabel, fromISO, startOfDay, toISO } from './calendar-utils'

export interface DateRangeSheetProps {
  open: boolean
  onClose: () => void
  startDate: string
  endDate: string
  onApply: (startDate: string, endDate: string) => void
  title?: string
}

/** 여행 기간을 고르는 달력 바텀시트 */
export default function DateRangeSheet({
  open,
  onClose,
  startDate,
  endDate,
  onApply,
  title = '언제 떠나세요?',
}: DateRangeSheetProps) {
  const [start, setStart] = useState<Date | null>(null)
  const [end, setEnd] = useState<Date | null>(null)
  const [month, setMonth] = useState<Date>(new Date())

  // 시트를 열 때마다 현재 값으로 초기화합니다.
  useEffect(() => {
    if (!open) return
    const s = startDate ? fromISO(startDate) : null
    const e = endDate ? fromISO(endDate) : null
    setStart(s)
    setEnd(e)
    setMonth(s ? new Date(s.getFullYear(), s.getMonth(), 1) : new Date())
  }, [open, startDate, endDate])

  const handleSelect = (date: Date) => {
    // 시작일만 있는 상태에서 이후 날짜를 고르면 기간이 완성됩니다.
    if (!start || end || date < start) {
      setStart(date)
      setEnd(null)
      return
    }
    setEnd(date)
  }

  const nights = start && end ? diffDays(start, end) : 0
  const complete = Boolean(start && end)

  return (
    <Sheet open={open} onClose={onClose} title={title}>
      {/* 선택 상태 요약 */}
      <div className="mx-5 mb-1 flex items-center gap-2 rounded-2xl bg-ink-50 p-2">
        <SummarySlot label="가는 날" date={start} active={!start || Boolean(end)} />
        <span className="text-ink-300">~</span>
        <SummarySlot label="오는 날" date={end} active={Boolean(start) && !end} />
      </div>

      <p className="px-5 pb-2 pt-2 text-[11.5px] text-ink-500">
        {complete
          ? `${nights}박 ${nights + 1}일 일정으로 만들어 드릴게요`
          : start
            ? '돌아오는 날을 골라주세요'
            : '떠나는 날을 먼저 골라주세요'}
      </p>

      <Calendar
        month={month}
        onMonthChange={setMonth}
        start={start}
        end={end}
        onSelect={handleSelect}
        minDate={startOfDay(new Date())}
      />

      <div className="sticky bottom-0 mt-3 border-t border-ink-100 bg-white px-5 py-3">
        <Button
          size="lg"
          full
          disabled={!complete}
          onClick={() => {
            if (!start || !end) return
            onApply(toISO(start), toISO(end))
            onClose()
          }}
        >
          {complete ? `${nights}박 ${nights + 1}일로 정하기` : '날짜를 골라주세요'}
        </Button>
      </div>
    </Sheet>
  )
}

function SummarySlot({
  label,
  date,
  active,
}: {
  label: string
  date: Date | null
  active: boolean
}) {
  return (
    <div
      className={cn(
        'flex-1 rounded-xl px-3 py-2 transition-colors',
        active ? 'bg-white shadow-sm ring-1 ring-brand-200' : 'bg-transparent',
      )}
    >
      <p className="text-[10.5px] font-semibold text-ink-300">{label}</p>
      <p
        className={cn(
          'mt-0.5 text-[13.5px] font-extrabold',
          date ? 'text-ink-900' : 'text-ink-300',
        )}
      >
        {date ? formatDayLabel(date) : '선택 전'}
      </p>
    </div>
  )
}
