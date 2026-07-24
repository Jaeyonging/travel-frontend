import type { ReactNode } from 'react'
import Icon, { type IconName } from '@/components/icon'
import { Button } from '@/components/ui'
import { describeApiError, type ApiErrorKind } from '@/lib/api'

const ICON_BY_KIND: Partial<Record<ApiErrorKind, IconName>> = {
  offline: 'alert',
  network: 'alert',
  timeout: 'clock',
  unauthorized: 'user',
  forbidden: 'shield',
  notFound: 'search',
  rateLimit: 'clock',
  server: 'alert',
}

export interface ErrorStateProps {
  error: unknown
  onRetry?: () => void
  onSecondary?: () => void
  secondaryLabel?: string
  /** 화면 전체를 채우는 형태로 표시 */
  full?: boolean
  extra?: ReactNode
}

/** API 실패를 사용자 언어로 보여주는 공통 화면 */
export default function ErrorState({
  error,
  onRetry,
  onSecondary,
  secondaryLabel = '홈으로',
  full = false,
  extra,
}: ErrorStateProps) {
  const { title, description, action, kind } = describeApiError(error)
  const icon = ICON_BY_KIND[kind] ?? 'alert'
  const retryable = kind !== 'forbidden' && kind !== 'notFound' && kind !== 'unauthorized'

  return (
    <div
      className={
        full
          ? 'flex min-h-[70vh] flex-col items-center justify-center px-8 text-center'
          : 'px-8 py-16 text-center'
      }
    >
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-coral-50 text-coral-500">
        <Icon name={icon} size={28} strokeWidth={1.9} />
      </span>
      <h2 className="mt-5 text-[17px] font-extrabold tracking-tight">{title}</h2>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-500">{description}</p>

      {extra}

      <div className="mt-6 flex w-full flex-col gap-2">
        {onRetry && retryable && (
          <Button size="lg" full onClick={onRetry}>
            {action}
          </Button>
        )}
        {onSecondary && (
          <Button variant="outline" size="lg" full onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        )}
      </div>

      <p className="mt-4 text-[11px] text-ink-300">오류 코드: {kind}</p>
    </div>
  )
}
