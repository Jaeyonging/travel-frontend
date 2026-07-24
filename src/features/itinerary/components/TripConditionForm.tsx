import type { ReactNode } from 'react'
import Icon from '@/components/icon'
import { Chip } from '@/components/ui'
import { cn } from '@/lib/cn'
import { COMPANION_OPTIONS, PACE_OPTIONS, THEME_OPTIONS, TRANSPORT_OPTIONS } from '@/lib/constants'
import { nightsBetween } from '@/lib/format'
import type { TripCondition } from '@/types'

export interface TripConditionFormProps {
  value: TripCondition
  onChange: (next: TripCondition) => void
}

/** 일정 생성 조건 입력 폼 (한 화면에 모두 노출) */
export default function TripConditionForm({ value, onChange }: TripConditionFormProps) {
  const patch = (partial: Partial<TripCondition>) => onChange({ ...value, ...partial })
  const nights = nightsBetween(value.startDate, value.endDate)

  const toggleTheme = (theme: string) =>
    patch({
      themes: value.themes.includes(theme)
        ? value.themes.filter((t) => t !== theme)
        : [...value.themes, theme],
    })

  return (
    <>
      <Block title="언제 가시나요?">
        <div className="flex items-center gap-2">
          <DateInput
            value={value.startDate}
            onChange={(v) => patch({ startDate: v })}
            label="출발일"
          />
          <span className="text-ink-300">–</span>
          <DateInput
            value={value.endDate}
            onChange={(v) => patch({ endDate: v })}
            label="도착일"
          />
          <span className="shrink-0 whitespace-nowrap rounded-lg bg-ink-50 px-2.5 py-1.5 text-[12.5px] font-bold text-ink-700">
            {nights}박 {nights + 1}일
          </span>
        </div>
      </Block>

      <Block title="어떻게 이동하세요?">
        <div className="flex gap-2">
          {TRANSPORT_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => patch({ transport: option.id })}
              className={cn(
                'pressable flex flex-1 items-center justify-center gap-1.5 rounded-2xl border py-3.5 text-[13.5px] font-bold transition',
                value.transport === option.id
                  ? 'border-brand-500 bg-brand-50 text-brand-600'
                  : 'border-ink-200 text-ink-500',
              )}
            >
              <Icon name={option.icon} size={17} />
              {option.label}
            </button>
          ))}
        </div>
        {value.transport === 'transit' && (
          <p className="mt-2 text-[11.5px] text-ink-500">
            대중교통 기반 일정은 3단계에서 제공 예정이에요. 지금은 자차 기준으로 계산돼요.
          </p>
        )}
      </Block>

      <Block title="누구와 함께 가세요?">
        <div className="flex flex-wrap gap-1.5">
          {COMPANION_OPTIONS.map((option) => (
            <Chip
              key={option.id}
              active={value.companion === option.id}
              onClick={() => patch({ companion: option.id })}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </Block>

      <Block title="어떤 걸 더 넣을까요?" desc="고른 취향에 맞는 장소를 빈 시간에 채워드려요">
        <div className="flex flex-wrap gap-1.5">
          {THEME_OPTIONS.map((theme) => (
            <Chip
              key={theme}
              size="sm"
              active={value.themes.includes(theme)}
              onClick={() => toggleTheme(theme)}
            >
              {theme}
            </Chip>
          ))}
        </div>
      </Block>

      <Block title="하루 일정은 얼마나 빡빡하게?">
        <div className="flex gap-2">
          {PACE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => patch({ pace: option.id })}
              className={cn(
                'pressable flex-1 rounded-2xl border py-3 transition',
                value.pace === option.id ? 'border-brand-500 bg-brand-50' : 'border-ink-200',
              )}
            >
              <p
                className={cn(
                  'text-[13px] font-extrabold',
                  value.pace === option.id ? 'text-brand-600' : 'text-ink-700',
                )}
              >
                {option.label}
              </p>
              <p className="mt-0.5 text-[11px] text-ink-500">{option.sub}</p>
            </button>
          ))}
        </div>
      </Block>
    </>
  )
}

function Block({
  title,
  desc,
  children,
}: {
  title: string
  desc?: string
  children: ReactNode
}) {
  return (
    <section className="px-5 pt-6">
      <h2 className="text-[15px] font-extrabold tracking-tight">{title}</h2>
      {desc && <p className="mt-1 text-[12px] text-ink-500">{desc}</p>}
      <div className="mt-3">{children}</div>
    </section>
  )
}

function DateInput({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (v: string) => void
  label: string
}) {
  return (
    <input
      type="date"
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full min-w-0 flex-1 rounded-xl border border-ink-200 px-2.5 text-[13px] font-semibold outline-none focus:border-brand-400"
    />
  )
}
