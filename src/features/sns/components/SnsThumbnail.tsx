import Photo from '@/components/photo'
import Icon from '@/components/icon'
import { sceneOfSns } from '@/lib/scene'
import type { SnsContent } from '@/types'

export interface SnsThumbnailProps {
  content: SnsContent
  className?: string
  /** 플랫폼 라벨 표기 방식 */
  labelStyle?: 'full' | 'short' | 'none'
}

export default function SnsThumbnail({
  content,
  className = 'h-[68px] w-[100px] rounded-xl',
  labelStyle = 'full',
}: SnsThumbnailProps) {
  const isYoutube = content.platform === 'youtube'

  return (
    <Photo seed={content.id} src={content.thumbnail} kind={sceneOfSns(content.platform)} className={className}>
      {labelStyle !== 'none' && (
        <span className="absolute bottom-1 left-1 flex items-center gap-1 rounded bg-ink-900/60 px-1.5 py-0.5 text-[9.5px] font-bold text-white">
          <Icon name={isYoutube ? 'play' : 'instagram'} size={9} />
          {labelStyle === 'full' ? (isYoutube ? 'YouTube' : 'Reels') : isYoutube ? 'YT' : 'IG'}
        </span>
      )}
    </Photo>
  )
}
