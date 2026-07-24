import Icon from '@/components/icon'
import type { MoveInfo } from '@/types'

/** 장소 사이 이동 거리·시간 표시 */
export default function MoveBadge({ move }: { move: MoveInfo }) {
  return (
    <div className="flex items-center gap-2 py-1.5 pl-[13px]">
      <span className="h-8 w-px border-l border-dashed border-ink-200" />
      <span className="flex items-center gap-1 rounded-full bg-ink-50 px-2.5 py-1 text-[11px] font-semibold text-ink-500">
        <Icon name={move.mode === 'walk' ? 'walk' : 'car'} size={12} />
        {move.distanceKm}km · {move.minutes}분
      </span>
    </div>
  )
}
