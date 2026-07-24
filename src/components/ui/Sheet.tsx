import { useEffect, useState, type ReactNode } from 'react'
import Icon from '@/components/icon'
import { cn } from '@/lib/cn'

const EXIT_MS = 260

export interface SheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

/** 하단에서 올라오는 바텀시트 (닫힘 애니메이션 포함) */
export default function Sheet({ open, onClose, title, children }: SheetProps) {
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      setClosing(false)
      return
    }
    if (!mounted) return
    setClosing(true)
    const timer = window.setTimeout(() => {
      setMounted(false)
      setClosing(false)
    }, EXIT_MS)
    return () => clearTimeout(timer)
  }, [open, mounted])

  // 시트가 열려 있는 동안 배경 스크롤 잠금
  useEffect(() => {
    if (!mounted) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mounted, onClose])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-center" role="dialog" aria-modal="true">
      <div
        className={cn(
          'absolute inset-0 bg-ink-900/45',
          closing ? 'animate-backdrop-out' : 'animate-backdrop-in',
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'gpu relative mt-auto w-full max-w-[480px] rounded-t-3xl bg-white shadow-sheet',
          closing ? 'animate-sheet-down' : 'animate-sheet-up',
        )}
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-3">
          <span className="mx-auto h-1 w-10 rounded-full bg-ink-200" />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 pb-2">
            <h3 className="text-[17px] font-extrabold tracking-tight">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full text-ink-500 active:bg-ink-50"
              aria-label="닫기"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        )}
        <div className="max-h-[76vh] overflow-y-auto overscroll-contain pb-8">{children}</div>
      </div>
    </div>
  )
}
