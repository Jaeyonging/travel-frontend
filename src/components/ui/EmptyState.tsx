import type { ReactNode } from 'react'
import Icon, { type IconName } from '@/components/icon'

export interface EmptyStateProps {
  icon?: IconName
  title: string
  description?: ReactNode
  action?: ReactNode
}

export default function EmptyState({ icon = 'search', title, description, action }: EmptyStateProps) {
  return (
    <div className="px-8 py-20 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-ink-50 text-ink-300">
        <Icon name={icon} size={28} />
      </span>
      <p className="mt-5 text-[16px] font-extrabold">{title}</p>
      {description && (
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">{description}</p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}
