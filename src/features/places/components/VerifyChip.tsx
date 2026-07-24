import { cn } from '@/lib/cn'
import { VERIFICATION_META } from '@/lib/constants'
import type { Verification } from '@/types'

export interface VerifyChipProps {
  level: Verification
  onClick?: () => void
}

/** 공공데이터 검증 3단계 배지 (확정 / 유력 / 확인필요) */
export default function VerifyChip({ level, onClick }: VerifyChipProps) {
  const meta = VERIFICATION_META[level]

  return (
    <span
      onClick={onClick}
      title={meta.help}
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold',
        meta.className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} />
      {meta.label}
    </span>
  )
}
