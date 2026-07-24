import placesJson from '@/data/places.json'
import snsJson from '@/data/snsContents.json'
import regionsJson from '@/data/regions.json'
import festivalsJson from '@/data/festivals.json'
import itineraryJson from '@/data/itinerary.json'
import type {
  Festival,
  GenerateItineraryInput,
  GenerateItineraryResult,
  Itinerary,
  Place,
  Region,
  SnsAnalysisResult,
  SnsContent,
} from '@/types'
import { ApiError } from './errors'
import { throwIfSimulated } from './simulate'

export const PLACES = placesJson as Place[]
export const SNS_CONTENTS = snsJson as SnsContent[]
export const REGIONS = regionsJson as Region[]
export const FESTIVALS = festivalsJson as Festival[]
export const SAMPLE_ITINERARY = itineraryJson as Itinerary

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** 목업 응답도 실제 요청과 같은 실패 경로를 타도록 공통 처리 */
async function pretendRequest<T>(value: () => T, ms: number): Promise<T> {
  await delay(ms)
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new ApiError('offline', '인터넷 연결이 끊겼습니다.')
  }
  throwIfSimulated()
  return value()
}

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return h
}

function findContentByUrl(url: string): SnsContent {
  const trimmed = url.trim()
  return (
    SNS_CONTENTS.find((c) => c.url === trimmed) ??
    SNS_CONTENTS.find((c) => trimmed.includes(c.id)) ??
    SNS_CONTENTS[Math.abs(hash(trimmed)) % SNS_CONTENTS.length]
  )
}

/**
 * 프론트엔드 프로토타입용 목업 API.
 * 시그니처는 실제 백엔드와 동일하게 두고, 내부만 http.request 호출로 바꾸면 됩니다.
 */
export const api = {
  getBootstrap: () =>
    pretendRequest(
      () => ({
        places: PLACES,
        regions: REGIONS,
        festivals: FESTIVALS,
        snsContents: SNS_CONTENTS,
        itinerary: SAMPLE_ITINERARY,
      }),
      120,
    ),

  analyzeSnsUrl: (url: string): Promise<SnsAnalysisResult> =>
    pretendRequest(() => {
      if (!url.trim()) {
        throw new ApiError('notFound', '분석할 링크가 없습니다.', { retryable: false })
      }
      const content = findContentByUrl(url)
      const places = content.extractedPlaceIds
        .map((id) => PLACES.find((p) => p.id === id))
        .filter((p): p is Place => Boolean(p))
      return { content, places }
    }, 2_600),

  generateItinerary: (input: GenerateItineraryInput): Promise<GenerateItineraryResult> =>
    pretendRequest(() => {
      if (input.placeIds.length < 2) {
        throw new ApiError('unknown', '장소를 2곳 이상 선택해 주세요.', { retryable: false })
      }
      return {
        ...SAMPLE_ITINERARY,
        startDate: input.condition.startDate,
        endDate: input.condition.endDate,
        transport: input.condition.transport,
        companion: input.condition.companion,
        themes: input.condition.themes,
      }
    }, 3_000),
}
