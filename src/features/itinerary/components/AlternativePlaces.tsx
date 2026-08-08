import Photo from '@/components/photo'
import Icon from '@/components/icon'
import { CATEGORY_META } from '@/lib/constants'
import { sceneOfPlace } from '@/lib/scene'
import type { Place } from '@/types'

export interface AlternativePlacesProps {
  places: Place[]
  onAdd: (place: Place) => void
}

/** 제외한 장소 주변의 대체 후보 추천 */
export default function AlternativePlaces({ places, onAdd }: AlternativePlacesProps) {
  if (places.length === 0) return null

  return (
    <div className="mx-5 mt-3 rounded-2xl bg-brand-50 p-4">
      <p className="flex items-center gap-1.5 text-[12.5px] font-extrabold text-brand-600">
        <Icon name="pin" size={14} />
        빠진 자리에 이건 어때요?
      </p>
      <p className="mt-1 text-[11.5px] text-ink-500">
        관광공사 위치기반 조회로 근처 장소를 찾았어요.
      </p>

      <div className="mt-3 space-y-2">
        {places.map((place) => (
          <div key={place.id} className="flex items-center gap-2.5 rounded-xl bg-white p-2.5">
            <Photo
              seed={place.id} src={place.image}
              kind={sceneOfPlace(place)}
              className="h-11 w-11 shrink-0 rounded-lg"
            />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-[13px] font-bold">{place.name}</p>
              <p className="text-[11.5px] text-ink-500">
                {place.city} · {CATEGORY_META[place.category].label} · ★{' '}
                {place.rating.toFixed(1)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onAdd(place)}
              className="pressable h-8 shrink-0 rounded-lg bg-brand-500 px-3 text-[12px] font-bold text-white"
            >
              넣기
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
