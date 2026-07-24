import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Divider, HScroll, Section } from '@/components/ui'
import { useToast } from '@/components/feedback'
import Icon from '@/components/icon'
import {
  CollectionGrid,
  FestivalCarousel,
  HomeHeader,
  LinkInputCard,
  RegionCarousel,
} from '@/features/home'
import { PlaceCard, PlaceDetailSheet } from '@/features/places'
import { SnsContentRow } from '@/features/sns'
import { TripCard } from '@/features/itinerary'
import { useCandidates, useCatalog, useTrip } from '@/store'
import { ROUTES } from '@/app/routes'
import type { Place } from '@/types'

export default function HomePage() {
  const navigate = useNavigate()
  const toast = useToast()

  const { places, regions, festivals, snsContents } = useCatalog()
  const { candidates, isCandidate, toggleCandidate } = useCandidates()
  const { itinerary } = useTrip()

  const [detail, setDetail] = useState<Place | null>(null)

  const trending = places.filter((p) => p.source === 'sns')
  const recommended = places.filter((p) => p.source === 'recommend').slice(0, 8)

  const analyze = (url: string) => {
    const target = url.trim() || snsContents[0].url
    navigate(ROUTES.extractResult, { state: { url: target } })
  }

  const handleToggle = (place: Place) => {
    const wasSaved = isCandidate(place.id)
    toggleCandidate(place.id)
    toast(wasSaved ? '담은 곳에서 뺐어요' : '담은 곳에 추가했어요', wasSaved ? 'remove' : 'success')
  }

  return (
    <div>
      <HomeHeader onSearch={() => navigate(ROUTES.explore)} />

      <LinkInputCard
        samples={snsContents}
        onAnalyze={analyze}
        onPasteFallback={() => snsContents[0].url}
        onToast={(message) => toast(message, 'default')}
      />

      <section className="px-5 py-5">
        <TripCard itinerary={itinerary} onOpen={() => navigate(ROUTES.plan(itinerary.id))} />
      </section>

      <Divider />

      <Section
        title="담아둔 곳"
        desc={`${candidates.length}곳을 모았어요. 2곳 이상이면 일정을 만들 수 있어요.`}
        action="전체보기"
        onAction={() => navigate(ROUTES.saved)}
      >
        <HScroll>
          {candidates.slice(0, 8).map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              saved
              onToggle={() => handleToggle(place)}
              onOpen={() => setDetail(place)}
            />
          ))}
          <button
            type="button"
            onClick={() => navigate(ROUTES.planNew)}
            className="pressable flex w-[132px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-brand-200 bg-brand-50 text-brand-600"
          >
            <Icon name="sparkle" size={22} strokeWidth={2} />
            <span className="text-[12.5px] font-extrabold">AI 일정 만들기</span>
          </button>
        </HScroll>
      </Section>

      <Divider />

      <Section
        title="요즘 SNS에서 자주 나오는 곳"
        desc="등록된 콘텐츠에서 가장 많이 언급된 강원 여행지예요."
        action="더보기"
        onAction={() => navigate(ROUTES.explore)}
      >
        <HScroll>
          {trending.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              saved={isCandidate(place.id)}
              onToggle={() => handleToggle(place)}
              onOpen={() => setDetail(place)}
            />
          ))}
        </HScroll>
      </Section>

      <Section
        title="이 영상에서 찾은 여행지"
        desc="영상 속 장소를 그대로 후보함에 담을 수 있어요."
      >
        <div className="space-y-2.5 px-5">
          {snsContents.map((content) => (
            <SnsContentRow
              key={content.id}
              content={content}
              onClick={() => analyze(content.url)}
            />
          ))}
        </div>
      </Section>

      <Divider />

      <Section
        title="여행 날짜에 열리는 축제"
        desc="한국관광공사 행사정보로 기간이 겹치는 행사를 골라뒀어요."
      >
        <FestivalCarousel festivals={festivals} />
      </Section>

      <Section
        title="권역으로 골라보기"
        desc="강원도는 넓어요. 같은 권역 안에서 고르면 이동이 편해요."
      >
        <RegionCarousel
          regions={regions}
          onSelect={(regionId) => navigate(ROUTES.explore, { state: { regionId } })}
        />
      </Section>

      <Section title="이런 여행은 어때요?" desc="테마별로 묶어둔 강원 코스 모음">
        <CollectionGrid onSelect={() => navigate(ROUTES.explore)} />
      </Section>

      <Section
        title="이런 곳도 함께 담아보세요"
        desc="담은 장소 주변에서 공공데이터로 찾은 곳이에요."
        action="더보기"
        onAction={() => navigate(ROUTES.explore)}
      >
        <HScroll>
          {recommended.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              saved={isCandidate(place.id)}
              onToggle={() => handleToggle(place)}
              onOpen={() => setDetail(place)}
            />
          ))}
        </HScroll>
      </Section>

      <footer className="mt-4 bg-ink-50 px-5 py-8 text-[11.5px] leading-relaxed text-ink-500">
        <p className="text-[12.5px] font-extrabold text-ink-700">강원 플랜잇</p>
        <p className="mt-1.5">
          2026 관광데이터 활용 공모전 웹앱 개발 부문 · 한국관광공사 국문관광정보 서비스 OpenAPI /
          카카오 API 활용
        </p>
        <p className="mt-1 text-ink-300">
          프론트엔드 프로토타입 — 화면의 모든 데이터는 목업(JSON)입니다.
        </p>
      </footer>

      <PlaceDetailSheet place={detail} onClose={() => setDetail(null)} />
    </div>
  )
}
