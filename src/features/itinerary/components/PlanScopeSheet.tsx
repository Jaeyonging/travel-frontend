import Icon from '@/components/icon'
import { Sheet } from '@/components/ui'
import { cn } from '@/lib/cn'

export interface PlanScopeSheetProps {
  open: boolean
  onClose: () => void
  /** 이번에 분석해서 찾은 장소 수 */
  foundCount: number
  /** 후보함에 담긴 전체 장소 수 */
  savedCount: number
  onPick: (scope: 'found' | 'all') => void
}

/** 어떤 장소로 일정을 만들지 고르는 시트 */
export default function PlanScopeSheet({
  open,
  onClose,
  foundCount,
  savedCount,
  onPick,
}: PlanScopeSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title="어떤 장소로 만들까요?">
      <div className="space-y-2.5 px-5 pt-1">
        <Option
          highlighted
          icon="play"
          title={`이 영상에서 찾은 ${foundCount}곳만`}
          desc="지금 분석한 장소로만 일정을 만듭니다"
          onClick={() => onPick('found')}
        />
        <Option
          icon="bookmark"
          title={`담아둔 ${savedCount}곳 전체`}
          desc="전에 담아둔 장소까지 함께 넣습니다"
          onClick={() => onPick('all')}
        />
      </div>

      <p className="px-5 pb-2 pt-4 text-[11.5px] leading-relaxed text-ink-500">
        어느 쪽을 고르든 찾은 장소는 담은 곳에 그대로 남아 있어요. 다음 화면에서 빼고 싶은
        장소를 다시 고를 수 있습니다.
      </p>
    </Sheet>
  )
}

function Option({
  icon,
  title,
  desc,
  onClick,
  highlighted = false,
}: {
  icon: 'play' | 'bookmark'
  title: string
  desc: string
  onClick: () => void
  highlighted?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'pressable flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition',
        highlighted ? 'border-brand-300 bg-brand-50' : 'border-ink-200 bg-white',
      )}
    >
      <span
        className={cn(
          'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
          highlighted ? 'bg-brand-500 text-white' : 'bg-ink-50 text-ink-500',
        )}
      >
        <Icon name={icon} size={18} strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'block text-[14.5px] font-extrabold',
            highlighted ? 'text-brand-700' : 'text-ink-900',
          )}
        >
          {title}
        </span>
        <span className="mt-0.5 block text-[12px] text-ink-500">{desc}</span>
      </span>
      <Icon name="chevron-right" size={18} className="shrink-0 text-ink-300" />
    </button>
  )
}
