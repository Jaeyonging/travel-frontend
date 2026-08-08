import { useEffect, useState } from 'react'
import Photo from '@/components/photo'
import Icon from '@/components/icon'
import { Badge, Button, Sheet } from '@/components/ui'
import { useToast } from '@/components/feedback'
import { CATEGORY_META } from '@/lib/constants'
import { formatCount, formatMinutes } from '@/lib/format'
import { sceneOfPlace } from '@/lib/scene'
import { useCandidates, useCatalog } from '@/store'
import type { Place } from '@/types'
import PlaceVerificationCard from './PlaceVerificationCard'
import VerifyChip from './VerifyChip'

export interface PlaceDetailSheetProps {
  place: Place | null
  onClose: () => void
}

/** 장소 상세 바텀시트 */
export default function PlaceDetailSheet({ place, onClose }: PlaceDetailSheetProps) {
  const { isCandidate, toggleCandidate } = useCandidates()
  const { snsContents } = useCatalog()
  const toast = useToast()

  // 닫히는 동안에도 내용이 남아 있어야 시트가 자연스럽게 내려갑니다.
  const [shown, setShown] = useState<Place | null>(place)
  useEffect(() => {
    if (place) setShown(place)
  }, [place])

  if (!shown) return null

  const from = snsContents.find((c) => c.id === shown.sourceContentId)
  const saved = isCandidate(shown.id)

  const stats: [string, string][] = [
    ...(shown.rating > 0
      ? ([
          ['평점', shown.rating.toFixed(1)],
          ['리뷰', formatCount(shown.reviewCount)],
        ] as [string, string][])
      : []),
    ['권장 체류', formatMinutes(shown.stayMinutes)],
  ]

  const handleToggle = () => {
    toggleCandidate(shown.id)
    toast(saved ? '담은 곳에서 뺐어요' : '담은 곳에 추가했어요', saved ? 'remove' : 'success')
  }

  return (
    <Sheet open={!!place} onClose={onClose}>
      <Photo seed={shown.id} src={shown.image} kind={sceneOfPlace(shown)} className="h-48 w-full">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ink-900/40 text-white backdrop-blur"
          aria-label="닫기"
        >
          <Icon name="close" size={18} strokeWidth={2.2} />
        </button>
      </Photo>

      <div className="px-5 pt-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge className={CATEGORY_META[shown.category].className}>
            {CATEGORY_META[shown.category].label}
          </Badge>
          <Badge className="bg-ink-50 text-ink-700">{shown.city}</Badge>
          <VerifyChip level={shown.verification} />
        </div>

        <h2 className="mt-2.5 text-[21px] font-extrabold tracking-tight">{shown.name}</h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">{shown.summary}</p>

        <div className="mt-4 grid grid-cols-3 divide-x divide-ink-100 rounded-2xl border border-ink-100">
          {stats.map(([label, value]) => (
            <div key={label} className="py-3 text-center">
              <p className="text-[11px] text-ink-300">{label}</p>
              <p className="mt-0.5 text-[14px] font-extrabold">{value}</p>
            </div>
          ))}
        </div>

        {from && (
          <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-ink-900 p-3 text-white">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10">
              <Icon name={from.platform === 'youtube' ? 'play' : 'instagram'} size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-white/60">이 콘텐츠에서 발견했어요</p>
              <p className="line-clamp-1 text-[13px] font-bold">{from.title}</p>
            </div>
          </div>
        )}

        <div className="mt-4">
          <PlaceVerificationCard place={shown} />
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {shown.tags.map((tag) => (
            <span key={tag} className="rounded-lg bg-ink-50 px-2 py-1 text-[11.5px] text-ink-500">
              #{tag}
            </span>
          ))}
        </div>

        <div className="sticky bottom-0 -mx-5 mt-5 flex gap-2 border-t border-ink-100 bg-white px-5 py-3">
          <Button variant={saved ? 'outline' : 'primary'} size="lg" full onClick={handleToggle}>
            <Icon name={saved ? 'check' : 'plus'} size={18} strokeWidth={2.3} />
            {saved ? '담은 곳에 있어요' : '담기'}
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
