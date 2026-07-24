import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Icon from '@/components/icon'
import { Badge, Button } from '@/components/ui'
import { TopBar } from '@/components/layout'
import { ErrorState, LoadingScreen, useToast } from '@/components/feedback'
import { PlaceDetailSheet } from '@/features/places'
import { PlanScopeSheet } from '@/features/itinerary'
import {
  ExtractedPlaceRow,
  SnsSourceCard,
  VerificationSummary,
  useSnsAnalysis,
} from '@/features/sns'
import { useCandidates, useCatalog } from '@/store'
import { ROUTES } from '@/app/routes'
import type { Place } from '@/types'

export default function ExtractResultPage() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: { url?: string } }
  const toast = useToast()

  const { snsContents } = useCatalog()
  const { candidateIds, isCandidate, toggleCandidate, addCandidates } = useCandidates()

  const url = state?.url ?? snsContents[0]?.url ?? ''
  const analysis = useSnsAnalysis(url)
  const [detail, setDetail] = useState<Place | null>(null)
  const [scopeOpen, setScopeOpen] = useState(false)

  if (analysis.isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <TopBar back transparent />
        <LoadingScreen
          title={
            <>
              영상 속 강원 여행지를
              <br />
              찾고 있어요
            </>
          }
          steps={analysis.steps}
          current={analysis.step}
        />
      </div>
    )
  }

  if (analysis.isError || !analysis.data) {
    return (
      <div className="flex min-h-screen flex-col">
        <TopBar title="분석 결과" back />
        <ErrorState
          full
          error={analysis.error}
          onRetry={analysis.retry}
          onSecondary={() => navigate(ROUTES.home)}
          secondaryLabel="홈으로"
        />
      </div>
    )
  }

  const { content, places } = analysis.data
  const notAdded = places.filter((p) => !isCandidate(p.id))

  const handleToggle = (place: Place) => {
    const wasSaved = isCandidate(place.id)
    toggleCandidate(place.id)
    toast(wasSaved ? '담은 곳에서 뺐어요' : '담은 곳에 추가했어요', wasSaved ? 'remove' : 'success')
  }

  // 이번에 찾은 장소 외에 후보함에 담아둔 게 더 있는지
  const foundIds = places.map((p) => p.id)
  const otherSavedCount = candidateIds.filter((id) => !foundIds.includes(id)).length

  const goToPlan = (scope: 'found' | 'all') => {
    addCandidates(foundIds)
    navigate(ROUTES.planNew, { state: scope === 'found' ? { placeIds: foundIds } : undefined })
  }

  const handlePrimary = () => {
    if (notAdded.length > 0) {
      addCandidates(foundIds)
      toast(`${notAdded.length}곳을 담았어요`)
      return
    }
    // 담아둔 장소가 더 있으면 어떤 범위로 만들지 물어봅니다
    if (otherSavedCount > 0) {
      setScopeOpen(true)
      return
    }
    goToPlan('found')
  }

  return (
    <div className="pb-2">
      <TopBar title="분석 결과" back />

      <SnsSourceCard content={content} />
      <VerificationSummary places={places} />

      <div className="mx-5 mt-3 flex items-start gap-2 rounded-xl bg-ink-50 px-3 py-2.5">
        <Icon name="shield" size={15} className="mt-0.5 shrink-0 text-brand-500" />
        <p className="text-[11.5px] leading-relaxed text-ink-500">
          AI 결과를 그대로 믿지 않도록, 관광공사 공공데이터와 맞춰본 결과를 3단계로 솔직하게
          보여드려요.
        </p>
      </div>

      <ul className="mt-4">
        {places.map((place) => (
          <li key={place.id}>
            <ExtractedPlaceRow
              place={place}
              saved={isCandidate(place.id)}
              onToggle={() => handleToggle(place)}
              onOpen={() => setDetail(place)}
            />
          </li>
        ))}
      </ul>

      <div className="mx-5 mt-4 rounded-2xl border border-ink-100 p-4">
        <p className="text-[12.5px] font-extrabold">어디서 찾았나요?</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {content.signals.map((signal) => (
            <Badge key={signal} className="bg-ink-50 text-ink-700">
              {signal}
            </Badge>
          ))}
        </div>
        <p className="mt-2.5 text-[11.5px] leading-relaxed text-ink-500">
          원본 영상과 이미지 파일은 저장하지 않고, 장소 후보 텍스트만 추출합니다.
        </p>
      </div>

      <div className="sticky bottom-0 z-40 flex gap-2 border-t border-ink-100 bg-white px-5 py-3 pb-safe">
        <Button
          variant="outline"
          size="lg"
          className="shrink-0"
          onClick={() => navigate(ROUTES.saved)}
        >
          담은 곳
        </Button>
        <Button size="lg" full onClick={handlePrimary}>
          {notAdded.length ? `${notAdded.length}곳 모두 담기` : '이 장소들로 일정 만들기'}
        </Button>
      </div>

      <PlanScopeSheet
        open={scopeOpen}
        onClose={() => setScopeOpen(false)}
        foundCount={places.length}
        savedCount={candidateIds.length}
        onPick={(scope) => {
          setScopeOpen(false)
          goToPlan(scope)
        }}
      />

      <PlaceDetailSheet place={detail} onClose={() => setDetail(null)} />
    </div>
  )
}
