import { useCallback, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Icon from '@/components/icon'
import { Button } from '@/components/ui'
import { TopBar } from '@/components/layout'
import { ErrorState, LoadingScreen } from '@/components/feedback'
import {
  SelectedPlacesStrip,
  TripConditionForm,
  useItineraryGeneration,
} from '@/features/itinerary'
import { useCandidates, useCatalog, useTrip } from '@/store'
import { ROUTES } from '@/app/routes'
import type { Itinerary, Place, TripCondition } from '@/types'

export default function PlanNewPage() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: { placeIds?: string[] } }

  const { candidates } = useCandidates()
  const { regions, getPlace } = useCatalog()
  const { condition, setCondition } = useTrip()

  // 특정 장소만 넘겨받으면 그 장소로 시작합니다 (분석 결과에서 바로 온 경우)
  const [selectedIds, setSelectedIds] = useState<string[]>(
    () => state?.placeIds ?? candidates.map((p) => p.id),
  )
  const [subsetMode, setSubsetMode] = useState(Boolean(state?.placeIds))
  const [draft, setDraft] = useState<TripCondition>(condition)

  const selectedPlaces = useMemo(
    () => selectedIds.map((id) => getPlace(id)).filter((p): p is Place => Boolean(p)),
    [selectedIds, getPlace],
  )

  const handleSuccess = useCallback(
    (itinerary: Itinerary) => {
      setCondition(draft)
      navigate(ROUTES.plan(itinerary.id), { replace: true })
    },
    [draft, navigate, setCondition],
  )

  const generation = useItineraryGeneration(handleSuccess)

  const usedRegionIds = Array.from(new Set(selectedPlaces.map((p) => p.regionId)))
  const crossRegion = usedRegionIds.length > 1
  const usedRegionNames = usedRegionIds
    .map((id) => regions.find((r) => r.id === id)?.name)
    .filter(Boolean)
    .join(', ')

  const useAllSaved = () => {
    setSelectedIds(candidates.map((p) => p.id))
    setSubsetMode(false)
  }

  const start = () =>
    generation.generate({ placeIds: selectedIds, condition: draft })

  if (generation.isGenerating) {
    return (
      <LoadingScreen
        title={
          <>
            실제로 다닐 수 있는
            <br />
            동선으로 만들고 있어요
          </>
        }
        steps={generation.steps}
        current={generation.step}
      />
    )
  }

  if (generation.isError) {
    return (
      <div className="flex min-h-screen flex-col">
        <TopBar title="일정 만들기" back />
        <ErrorState
          full
          error={generation.error}
          onRetry={generation.retry}
          onSecondary={() => generation.reset()}
          secondaryLabel="조건 다시 고르기"
        />
      </div>
    )
  }

  const hiddenCount = candidates.length - selectedIds.length

  return (
    <div className="pb-2">
      <TopBar title="일정 만들기" back />

      {subsetMode && hiddenCount > 0 && (
        <div className="mx-5 mt-4 flex items-center gap-2.5 rounded-2xl bg-brand-50 px-4 py-3">
          <Icon name="play" size={15} className="shrink-0 text-brand-500" />
          <p className="min-w-0 flex-1 text-[12px] leading-relaxed text-brand-700">
            이 영상에서 찾은 {selectedIds.length}곳으로만 만듭니다
          </p>
          <button
            type="button"
            onClick={useAllSaved}
            className="pressable shrink-0 whitespace-nowrap rounded-lg bg-white px-2.5 py-1.5 text-[11.5px] font-extrabold text-brand-600"
          >
            {candidates.length}곳 전체로
          </button>
        </div>
      )}

      <SelectedPlacesStrip
        places={selectedPlaces}
        onRemove={(id) => setSelectedIds((prev) => prev.filter((x) => x !== id))}
        onEdit={() => navigate(ROUTES.saved)}
      />

      {crossRegion && (
        <div className="mx-5 mt-3 flex items-start gap-2 rounded-xl bg-sand-100 px-3 py-2.5">
          <Icon name="alert" size={15} className="mt-0.5 shrink-0 text-sand-700" />
          <p className="text-[11.5px] leading-relaxed text-sand-700">
            서로 다른 권역의 장소가 섞여 있어요. 이동이 길어지면 일정을 나누자고 제안드릴게요.
          </p>
        </div>
      )}

      <TripConditionForm value={draft} onChange={setDraft} />

      <div className="px-5 pb-4 pt-6">
        <p className="text-[11.5px] leading-relaxed text-ink-300">
          지역은 고른 장소를 기준으로 자동 판별해요{usedRegionNames && ` (${usedRegionNames})`}.
          백엔드 연동 전이라 조건과 무관하게 준비된 목업 일정이 생성됩니다.
        </p>
      </div>

      <div className="sticky bottom-0 z-40 border-t border-ink-100 bg-white px-5 py-3 pb-safe">
        <Button size="lg" full onClick={start} disabled={selectedIds.length < 2}>
          <Icon name="sparkle" size={18} strokeWidth={2.2} />
          {selectedIds.length}곳으로 일정 만들기
        </Button>
      </div>
    </div>
  )
}
