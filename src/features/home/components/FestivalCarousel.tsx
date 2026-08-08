import Photo from '@/components/photo'
import { HScroll } from '@/components/ui'
import { FESTIVAL_SCENES } from '../constants'
import type { Festival } from '@/types'

/** 여행 기간과 겹치는 축제 캐러셀 */
export default function FestivalCarousel({ festivals }: { festivals: Festival[] }) {
  return (
    <HScroll>
      {festivals.map((festival, i) => (
        <div key={festival.id} className="w-[220px] shrink-0">
          <Photo
            seed={festival.id} src={festival.image}
            kind={FESTIVAL_SCENES[i % FESTIVAL_SCENES.length]}
            className="h-[120px] w-full rounded-2xl"
          >
            {festival.matchedDate && (
              <span className="absolute left-2 top-2 rounded-md bg-coral-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                여행 기간과 겹쳐요
              </span>
            )}
          </Photo>
          <p className="mt-2 line-clamp-1 text-[14px] font-bold">{festival.title}</p>
          <p className="mt-0.5 text-[12px] text-ink-500">{festival.period}</p>
          <p className="text-[12px] text-ink-500">
            {festival.city} · {festival.place}
          </p>
        </div>
      ))}
    </HScroll>
  )
}
