import type { SceneKind } from '@/components/photo'
import type { Place, SnsPlatform } from '@/types'

const MOUNTAIN_HINT = /등산|국립공원|절경|전망|단풍|케이블카/

/** 장소 성격에 맞는 일러스트 씬 선택 */
export function sceneOfPlace(place: Place): SceneKind {
  if (place.category === 'stay') return 'night'
  if (place.category === 'cafe') return 'cafe'
  if (place.category === 'culture') return 'hanok'
  if (place.category === 'food') return 'market'

  const hay = `${place.tags.join(' ')} ${place.name}`
  if (MOUNTAIN_HINT.test(hay) || place.name.includes('산')) return 'mountain'
  return 'beach'
}

/** SNS 콘텐츠 썸네일용 씬 */
export function sceneOfSns(platform: SnsPlatform): SceneKind {
  return platform === 'youtube' ? 'mountain' : 'beach'
}
