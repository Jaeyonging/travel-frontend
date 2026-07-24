import Icon from '@/components/icon'
import { cn } from '@/lib/cn'
import { formatRelativeTime } from '@/lib/format'
import type { AppNotification } from '@/types'
import { NOTIFICATION_META } from '../meta'

export interface NotificationRowProps {
  notification: AppNotification
  onOpen: (notification: AppNotification) => void
}

export default function NotificationRow({ notification, onOpen }: NotificationRowProps) {
  const meta = NOTIFICATION_META[notification.type]

  return (
    <button
      type="button"
      onClick={() => onOpen(notification)}
      className={cn(
        'pressable flex w-full gap-3 px-5 py-4 text-left transition-colors',
        notification.read ? 'bg-white' : 'bg-brand-50/50',
      )}
    >
      <span
        className={cn(
          'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
          meta.className,
        )}
      >
        <Icon name={meta.icon} size={19} strokeWidth={1.9} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-ink-300">{meta.label}</span>
          <span className="text-[11px] text-ink-300">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </span>
        <span
          className={cn(
            'mt-0.5 block text-[14px] leading-snug tracking-tight',
            notification.read ? 'font-bold text-ink-700' : 'font-extrabold text-ink-900',
          )}
        >
          {notification.title}
        </span>
        <span className="mt-1 block text-[12.5px] leading-relaxed text-ink-500">
          {notification.body}
        </span>
      </span>

      {!notification.read && (
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-coral-500" />
      )}
    </button>
  )
}
