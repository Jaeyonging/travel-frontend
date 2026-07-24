import { formatViews } from '@/lib/format'
import type { SnsContent } from '@/types'
import SnsThumbnail from './SnsThumbnail'

/** 분석 결과 화면 상단의 원본 콘텐츠 요약 */
export default function SnsSourceCard({ content }: { content: SnsContent }) {
  return (
    <div className="flex gap-3 px-5 pb-4 pt-3">
      <SnsThumbnail content={content} className="h-[76px] w-[110px] shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[14px] font-bold leading-snug">{content.title}</p>
        <p className="mt-1 text-[11.5px] text-ink-500">
          {content.channel} · 조회 {formatViews(content.views)}
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {content.hashtags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[11px] font-semibold text-brand-500">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
