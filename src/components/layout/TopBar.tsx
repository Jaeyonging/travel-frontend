import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '@/components/icon'
import { cn } from '@/lib/cn'

export interface TopBarProps {
  title?: string
  back?: boolean
  right?: ReactNode
  transparent?: boolean
}

/** 상세 화면 공통 상단바 */
export default function TopBar({ title, back, right, transparent = false }: TopBarProps) {
  const navigate = useNavigate()

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-14 items-center gap-2 px-4',
        transparent ? 'bg-transparent' : 'border-b border-ink-100 bg-white/92 backdrop-blur-md',
      )}
    >
      {back && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="pressable-sm -ml-2 grid h-9 w-9 place-items-center rounded-full text-ink-900 active:bg-ink-50"
          aria-label="뒤로"
        >
          <Icon name="chevron-left" size={22} strokeWidth={2} />
        </button>
      )}
      {title && <h1 className="truncate text-[16px] font-extrabold tracking-tight">{title}</h1>}
      <div className="ml-auto flex items-center gap-1">{right}</div>
    </header>
  )
}
