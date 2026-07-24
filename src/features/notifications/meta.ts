import type { IconName } from '@/components/icon'
import type { NotificationType } from '@/types'

/** 알림 종류별 아이콘과 색 */
export const NOTIFICATION_META: Record<
  NotificationType,
  { icon: IconName; className: string; label: string }
> = {
  analysis: { icon: 'sparkle', className: 'bg-brand-50 text-brand-600', label: '분석 완료' },
  verification: { icon: 'alert', className: 'bg-coral-50 text-coral-600', label: '확인 필요' },
  festival: { icon: 'pin', className: 'bg-sand-100 text-sand-700', label: '축제' },
  trip: { icon: 'route', className: 'bg-brand-50 text-brand-600', label: '내 일정' },
  recommend: { icon: 'compass', className: 'bg-ink-50 text-ink-700', label: '추천' },
  share: { icon: 'share', className: 'bg-ink-50 text-ink-700', label: '공유' },
}
