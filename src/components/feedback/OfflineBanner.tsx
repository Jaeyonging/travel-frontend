import Icon from '@/components/icon'
import { useOnlineStatus } from '@/hooks'

/** 네트워크가 끊기면 상단에 상시 노출되는 배너 */
export default function OfflineBanner() {
  const online = useOnlineStatus()
  if (online) return null

  return (
    <div className="sticky top-0 z-[60] flex items-center justify-center gap-1.5 bg-ink-900 px-4 py-2 text-[12px] font-bold text-white">
      <Icon name="alert" size={14} strokeWidth={2.2} className="text-coral-300" />
      오프라인 상태예요. 담아둔 곳은 계속 볼 수 있어요.
    </div>
  )
}
