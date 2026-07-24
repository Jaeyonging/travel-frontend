export type Verification = 'confirmed' | 'likely' | 'needs_check'
export type PlaceCategory = 'attraction' | 'food' | 'cafe' | 'culture' | 'stay'
export type PlaceSource = 'sns' | 'recommend' | 'manual'
export type SnsPlatform = 'youtube' | 'instagram'
export type TransportMode = 'car' | 'transit'
export type CompanionType = 'solo' | 'couple' | 'family' | 'friends'
export type TripPace = 'relaxed' | 'normal' | 'packed'
export type SlotType = 'meal' | 'activity' | 'stay'

export interface Place {
  id: string
  name: string
  category: PlaceCategory
  city: string
  regionId: string
  address: string
  lat: number
  lng: number
  verification: Verification
  contentTypeName: string | null
  contentId: string | null
  rating: number
  reviewCount: number
  stayMinutes: number
  openHours: string
  tags: string[]
  summary: string
  image: string
  source: PlaceSource
  sourceContentId?: string
  indoor: boolean
}

export interface Region {
  id: string
  name: string
  emoji: string
  color: string
  cities: string[]
  description: string
  avgMoveMinutes: number
}

export interface SnsContent {
  id: string
  platform: SnsPlatform
  url: string
  title: string
  channel: string
  thumbnail: string
  publishedAt: string
  views: number
  hashtags: string[]
  analyzedAt: string
  extractedPlaceIds: string[]
  signals: string[]
}

export interface MoveInfo {
  distanceKm: number
  minutes: number
  mode: 'car' | 'walk' | 'transit'
}

export interface ItineraryItem {
  placeId: string
  startTime: string
  endTime: string
  slot: SlotType
  note: string
  moveFromPrev: MoveInfo | null
}

export interface ItineraryDay {
  day: number
  date: string
  label: string
  items: ItineraryItem[]
}

export interface ItineraryWarning {
  level: 'info' | 'warn'
  title: string
  detail: string
}

export interface ItinerarySummary {
  totalPlaces: number
  totalDistanceKm: number
  totalMoveMinutes: number
  snsPlaceRatio: number
}

export interface Itinerary {
  id: string
  title: string
  startDate: string
  endDate: string
  regionId: string
  transport: string
  companion: string
  themes: string[]
  createdAt: string
  summary: ItinerarySummary
  warnings: ItineraryWarning[]
  days: ItineraryDay[]
}

export interface Festival {
  id: string
  title: string
  city: string
  period: string
  place: string
  image: string
  matchedDate: boolean
}

export interface TripCondition {
  cities: string[]
  startDate: string
  endDate: string
  transport: TransportMode
  companion: CompanionType
  themes: string[]
  pace: TripPace
}
