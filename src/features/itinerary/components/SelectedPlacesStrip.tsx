import Photo from '@/components/photo'
import Icon from '@/components/icon'
import { formatMinutes } from '@/lib/format'
import { sceneOfPlace } from '@/lib/scene'
import type { Place } from '@/types'

export interface SelectedPlacesStripProps {
  places: Place[]
  onRemove: (id: string) => void
  onEdit: () => void
}

/** 일정 생성 화면 상단의 담은 장소 미리보기 */
export default function SelectedPlacesStrip({
  places,
  onRemove,
  onEdit,
}: SelectedPlacesStripProps) {
  const totalStay = places.reduce((sum, p) => sum + p.stayMinutes, 0)

  return (
    <div className="px-5 pt-4">
      <div className="rounded-2xl border border-ink-100 p-4">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-extrabold">담은 장소 {places.length}곳</p>
          <button
            type="button"
            onClick={onEdit}
            className="pressable text-[12.5px] font-bold text-brand-500"
          >
            수정
          </button>
        </div>

        {/* 썸네일 위의 제외 버튼이 잘리지 않도록 스크롤 영역에 여백을 둡니다 */}
        <div className="no-scrollbar -mx-1.5 mt-2 flex gap-2 overflow-x-auto px-1.5 pb-1 pt-2.5">
          {places.map((place) => (
            <div key={place.id} className="relative w-[68px] shrink-0">
              <Photo
                seed={place.id}
                kind={sceneOfPlace(place)}
                className="h-[68px] w-[68px] rounded-xl"
              />
              <button
                type="button"
                onClick={() => onRemove(place.id)}
                aria-label={`${place.name} 제외`}
                className="pressable-sm absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-ink-900 text-white"
              >
                <Icon name="close" size={11} strokeWidth={3} />
              </button>
              <p className="mt-1 line-clamp-1 text-[10.5px] font-semibold text-ink-700">
                {place.name}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[11.5px] text-ink-500">
          예상 체류 {formatMinutes(totalStay)} · 이동 시간은 지금 계산해 드려요
        </p>
      </div>
    </div>
  )
}
