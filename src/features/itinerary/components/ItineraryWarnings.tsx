import Icon from '@/components/icon'
import { cn } from '@/lib/cn'
import type { ItineraryWarning } from '@/types'

/** 권역 이탈·과밀 일정 등 AI가 감지한 경고 목록 */
export default function ItineraryWarnings({
  warnings,
  onSplit,
}: {
  warnings: ItineraryWarning[]
  onSplit?: () => void
}) {
  if (warnings.length === 0) return null

  return (
    <div className="space-y-2 px-5">
      {warnings.map((warning) => (
        <div
          key={warning.title}
          className={cn(
            'flex gap-2.5 rounded-2xl px-3.5 py-3',
            warning.level === 'warn' ? 'bg-sand-100' : 'bg-ink-50',
          )}
        >
          <Icon
            name={warning.level === 'warn' ? 'alert' : 'sparkle'}
            size={16}
            className={cn(
              'mt-0.5 shrink-0',
              warning.level === 'warn' ? 'text-sand-700' : 'text-brand-500',
            )}
          />
          <div className="min-w-0">
            <p className="text-[12.5px] font-extrabold text-ink-900">{warning.title}</p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-ink-500">{warning.detail}</p>
            {warning.level === 'warn' && (
              <button
                type="button"
                onClick={onSplit}
                className="pressable mt-2 rounded-lg bg-white px-2.5 py-1.5 text-[11.5px] font-bold text-ink-700"
              >
                일정 나누기
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
