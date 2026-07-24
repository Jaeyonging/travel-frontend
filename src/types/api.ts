import type { Itinerary, Place, SnsContent, TripCondition } from './domain'

/** SNS URL 분석 응답 */
export interface SnsAnalysisResult {
  content: SnsContent
  places: Place[]
}

/** 일정 생성 요청 */
export interface GenerateItineraryInput {
  placeIds: string[]
  condition: TripCondition
}
export type GenerateItineraryResult = Itinerary
