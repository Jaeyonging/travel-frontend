import Photo from '@/components/photo'
import { COLLECTIONS } from '../constants'

/** 테마 컬렉션 2열 그리드 */
export default function CollectionGrid({ onSelect }: { onSelect: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 px-5">
      {COLLECTIONS.map((collection) => (
        <button
          key={collection.id}
          type="button"
          onClick={onSelect}
          className="pressable overflow-hidden rounded-2xl text-left"
        >
          <Photo seed={collection.seed} kind={collection.kind} className="h-[104px] w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/75 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-2.5">
              <p className="text-[13px] font-extrabold text-white">{collection.title}</p>
              <p className="text-[11px] text-white/70">{collection.sub}</p>
            </div>
          </Photo>
        </button>
      ))}
    </div>
  )
}
