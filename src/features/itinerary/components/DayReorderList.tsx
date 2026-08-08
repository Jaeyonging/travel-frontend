import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import Photo from '@/components/photo'
import Icon from '@/components/icon'
import { cn } from '@/lib/cn'
import { CATEGORY_META } from '@/lib/constants'
import { formatMinutes } from '@/lib/format'
import { sceneOfPlace } from '@/lib/scene'
import { moveItem } from '../utils/schedule'
import type { Place } from '@/types'

/** 모든 행의 높이를 같게 두어 끌어놓기 계산을 단순하게 만듭니다 */
const ROW_HEIGHT = 72

export interface DayReorderListProps {
  places: Place[]
  onReorder: (from: number, to: number) => void
}

interface DragState {
  index: number
  startY: number
  offsetY: number
  target: number
}

export default function DayReorderList({ places, onReorder }: DayReorderListProps) {
  const [drag, setDrag] = useState<DragState | null>(null)
  /** 핸들러가 항상 최신 값을 보도록 ref로도 들고 있습니다 */
  const dragRef = useRef<DragState | null>(null)
  /**
   * 놓는 순간 목록 순서가 바뀌면서 각 행의 위치도 함께 바뀝니다.
   * 이때 남아 있던 transform이 애니메이션으로 풀리면 카드가 위아래로 튑니다.
   * 한 프레임만 전환을 꺼서 새 자리에 그대로 안착시킵니다.
   */
  const [settling, setSettling] = useState(false)

  const update = useCallback((next: DragState | null) => {
    dragRef.current = next
    setDrag(next)
  }, [])

  useEffect(() => {
    if (!settling) return
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setSettling(false))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [settling])

  const handlePointerDown = (index: number) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* 포인터 캡처를 지원하지 않아도 끌기는 동작합니다 */
    }
    update({ index, startY: e.clientY, offsetY: 0, target: index })
  }

  const handlePointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const current = dragRef.current
    if (!current) return
    const offsetY = e.clientY - current.startY
    const moved = Math.round(offsetY / ROW_HEIGHT)
    const target = Math.max(0, Math.min(places.length - 1, current.index + moved))
    update({ ...current, offsetY, target })
  }

  const handlePointerUp = () => {
    const current = dragRef.current
    if (!current) return
    if (current.target !== current.index) {
      setSettling(true)
      onReorder(current.index, current.target)
    }
    update(null)
  }

  /** 끌고 있는 행을 피해 다른 행이 밀려나는 거리 */
  const shiftFor = (index: number) => {
    if (!drag || index === drag.index) return 0
    const { index: from, target } = drag
    if (from < target && index > from && index <= target) return -ROW_HEIGHT
    if (from > target && index < from && index >= target) return ROW_HEIGHT
    return 0
  }

  // 끌고 있는 동안 보여줄 번호는 옮겨진 뒤의 순서 기준입니다
  const projected = drag ? moveItem(places, drag.index, drag.target) : places
  const numberOf = (id: string) => projected.findIndex((p) => p.id === id) + 1

  return (
    <ul className="px-5">
      {places.map((place, index) => {
        const isDragging = drag?.index === index

        return (
          <li
            key={place.id}
            style={{
              height: ROW_HEIGHT,
              transform: `translateY(${isDragging ? drag.offsetY : shiftFor(index)}px)`,
              zIndex: isDragging ? 20 : 1,
              transition:
                isDragging || settling ? 'none' : 'transform .22s cubic-bezier(.22,1,.36,1)',
            }}
            className="relative"
          >
            <div
              className={cn(
                'flex h-[64px] items-center gap-3 rounded-2xl px-3 transition-shadow',
                isDragging
                  ? 'bg-white shadow-[0_12px_28px_-10px_rgba(20,23,28,.4)] ring-1 ring-brand-200'
                  : 'bg-ink-50',
              )}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-[11px] font-extrabold text-ink-500">
                {numberOf(place.id)}
              </span>

              <Photo
                seed={place.id} src={place.image}
                kind={sceneOfPlace(place)}
                className="h-10 w-10 shrink-0 rounded-lg"
              />

              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-[13.5px] font-bold tracking-tight">
                  {place.name}
                </p>
                <p className="text-[11.5px] text-ink-500">
                  {CATEGORY_META[place.category].label} · 체류 {formatMinutes(place.stayMinutes)}
                </p>
              </div>

              <button
                type="button"
                aria-label={`${place.name} 순서 옮기기`}
                onPointerDown={handlePointerDown(index)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="grid h-10 w-10 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-ink-300 active:cursor-grabbing active:bg-white"
              >
                <Icon name="grip" size={18} strokeWidth={2.2} />
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
