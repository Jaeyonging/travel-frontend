import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'dark' | 'soft' | 'outline' | 'ghost' | 'kakao'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-500 text-white active:bg-brand-600 disabled:bg-ink-200 disabled:text-ink-300',
  dark: 'bg-ink-900 text-white active:bg-ink-800 disabled:bg-ink-200',
  soft: 'bg-brand-50 text-brand-600 active:bg-brand-100',
  outline: 'border border-ink-200 bg-white text-ink-700 active:bg-ink-50',
  ghost: 'text-ink-500 active:bg-ink-50',
  kakao: 'bg-[#FEE500] text-[#191600] active:brightness-95',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[12.5px] rounded-lg',
  md: 'h-11 px-4 text-[14px] rounded-xl',
  lg: 'h-[52px] px-5 text-[15px] rounded-2xl',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  full?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  full = false,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'pressable inline-flex items-center justify-center gap-1.5 font-bold transition disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        full && 'w-full',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
