import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, EmptyState, MockNotice } from '@/components/ui'
import { TopBar } from '@/components/layout'
import { useToast } from '@/components/feedback'
import { NotificationRow } from '@/features/notifications'
import { relativeGroup } from '@/lib/format'
import { useNotifications } from '@/store'
import { ROUTES } from '@/app/routes'
import type { AppNotification } from '@/types'

const GROUP_ORDER = ['오늘', '어제', '지난 알림']

export default function NotificationsPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } =
    useNotifications()

  // 날짜별로 묶어서 보여줍니다
  const groups = useMemo(() => {
    const map = new Map<string, AppNotification[]>()
    for (const item of notifications) {
      const key = relativeGroup(item.createdAt)
      const list = map.get(key) ?? []
      list.push(item)
      map.set(key, list)
    }
    return GROUP_ORDER.filter((key) => map.has(key)).map((key) => ({
      title: key,
      items: map.get(key)!,
    }))
  }, [notifications])

  const open = (notification: AppNotification) => {
    markNotificationRead(notification.id)
    if (notification.snsUrl) {
      navigate(notification.to, { state: { url: notification.snsUrl } })
      return
    }
    navigate(notification.to)
  }

  if (notifications.length === 0) {
    return (
      <div>
        <TopBar title="알림" back />
        <EmptyState
          icon="bell"
          title="새로운 알림이 없어요"
          description="장소를 담아두면 축제나 날씨 소식을 알려드릴게요."
          action={<Button onClick={() => navigate(ROUTES.home)}>홈으로</Button>}
        />
      </div>
    )
  }

  return (
    <div className="pb-6">
      <TopBar
        title="알림"
        back
        right={
          unreadCount > 0 && (
            <button
              type="button"
              onClick={() => {
                markAllNotificationsRead()
                toast('모두 읽음으로 표시했어요')
              }}
              className="pressable rounded-lg px-2 py-1.5 text-[12.5px] font-bold text-brand-600"
            >
              모두 읽음
            </button>
          )
        }
      />

      {unreadCount > 0 && (
        <p className="px-5 pb-1 pt-3 text-[12.5px] font-semibold text-ink-500">
          읽지 않은 알림 {unreadCount}개
        </p>
      )}

      {groups.map((group) => (
        <section key={group.title} className="pt-3">
          <h2 className="px-5 pb-1 text-[12px] font-extrabold text-ink-300">{group.title}</h2>
          <ul className="divide-y divide-ink-100 border-y border-ink-100">
            {group.items.map((item) => (
              <li key={item.id}>
                <NotificationRow notification={item} onOpen={open} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="pt-6">
        <MockNotice>
          알림 목록과 읽음 상태는 서버와 연동됩니다. 실제 푸시 발송은 준비 중입니다.
        </MockNotice>
      </div>
    </div>
  )
}
