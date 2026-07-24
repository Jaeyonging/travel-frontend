import Icon from '@/components/icon'
import { IconButton } from '@/components/ui'

export interface HomeHeaderProps {
  onSearch: () => void
  onNotifications: () => void
  unreadCount?: number
}

/** 홈 전용 상단바 (로고 + 검색/알림) */
export default function HomeHeader({
  onSearch,
  onNotifications,
  unreadCount = 0,
}: HomeHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-ink-100 bg-white/92 px-5 backdrop-blur-md">
      <span className="flex items-center gap-1.5">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-500 text-white">
          <Icon name="pin" size={16} strokeWidth={2.2} />
        </span>
        <span className="text-[16px] font-extrabold tracking-tight">강원 플랜잇</span>
      </span>
      <div className="ml-auto flex items-center">
        <IconButton name="search" label="검색" onClick={onSearch} />
        <IconButton name="bell" label="알림" badge={unreadCount} onClick={onNotifications} />
      </div>
    </header>
  )
}
