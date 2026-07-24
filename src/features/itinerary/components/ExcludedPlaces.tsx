import Icon from '@/components/icon'
import type { Place } from '@/types'

export interface ExcludedPlacesProps {
  places: Place[]
  onRestore: (id: string) => void
}

/** 일정에서 뺀 장소 되돌리기 */
export default function ExcludedPlaces({ places, onRestore }: ExcludedPlacesProps) {
  if (places.length === 0) return null

  return (
    <div className="mx-5 mt-4 rounded-2xl bg-ink-50 p-4">
      <p className="text-[12.5px] font-extrabold">일정에서 뺀 장소</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {places.map((place) => (
          <button
            key={place.id}
            type="button"
            onClick={() => onRestore(place.id)}
            className="pressable flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[11.5px] font-semibold text-ink-700"
          >
            {place.name}
            <Icon name="plus" size={12} strokeWidth={2.5} />
          </button>
        ))}
      </div>
    </div>
  )
}
