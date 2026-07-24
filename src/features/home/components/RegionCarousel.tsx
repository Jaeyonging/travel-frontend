import Photo from '@/components/photo'
import { HScroll } from '@/components/ui'
import type { Region } from '@/types'

const MOUNTAIN_REGIONS = new Set(['mountain', 'dmz'])

/** 권역별 탐색 진입 캐러셀 */
export default function RegionCarousel({
  regions,
  onSelect,
}: {
  regions: Region[]
  onSelect: (regionId: string) => void
}) {
  return (
    <HScroll>
      {regions.map((region) => (
        <button
          key={region.id}
          type="button"
          onClick={() => onSelect(region.id)}
          className="pressable w-[150px] shrink-0 text-left"
        >
          <Photo
            seed={region.id}
            kind={MOUNTAIN_REGIONS.has(region.id) ? 'mountain' : 'beach'}
            className="h-[96px] w-full rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-2.5">
              <p className="text-[13.5px] font-extrabold text-white">{region.name}</p>
              <p className="line-clamp-1 text-[11px] text-white/70">
                {region.cities.join(' · ')}
              </p>
            </div>
            {region.id === 'east-coast' && (
              <span className="absolute right-2 top-2 rounded-md bg-brand-500 px-1.5 py-0.5 text-[9.5px] font-bold text-white">
                일정 생성 지원
              </span>
            )}
          </Photo>
        </button>
      ))}
    </HScroll>
  )
}
