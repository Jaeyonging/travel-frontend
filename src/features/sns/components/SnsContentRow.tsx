import Icon from '@/components/icon'
import { formatViews } from '@/lib/format'
import type { SnsContent } from '@/types'
import SnsThumbnail from './SnsThumbnail'

export interface SnsContentRowProps {
  content: SnsContent
  onClick: () => void
  /** 하단 보조 문구 (기본: 발견 장소 수) */
  subline?: string
}

/** 등록된 SNS 콘텐츠 목록 행 */
export default function SnsContentRow({ content, onClick, subline }: SnsContentRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="pressable flex w-full gap-3 rounded-2xl border border-ink-100 p-2.5 text-left active:bg-ink-50"
    >
      <SnsThumbnail content={content} className="h-[68px] w-[100px] shrink-0 rounded-xl" />

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[13.5px] font-bold leading-snug">{content.title}</p>
        <p className="mt-1 text-[11.5px] text-ink-500">
          {content.channel} · 조회 {formatViews(content.views)}
        </p>
        <p className="mt-1 text-[11.5px] font-bold text-brand-500">
          {subline ?? `장소 ${content.extractedPlaceIds.length}곳 발견`}
        </p>
      </div>

      <Icon name="chevron-right" size={18} className="self-center text-ink-300" />
    </button>
  )
}
