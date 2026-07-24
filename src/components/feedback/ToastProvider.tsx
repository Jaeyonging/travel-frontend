import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import Icon, { type IconName } from '@/components/icon'

type ToastTone = 'default' | 'success' | 'remove' | 'warn'

interface ToastItem {
  id: number
  message: string
  tone: ToastTone
  leaving: boolean
}

const TONE: Record<ToastTone, { icon: IconName; className: string; iconClass: string }> = {
  default: { icon: 'sparkle', className: 'bg-ink-900', iconClass: 'text-brand-300' },
  success: { icon: 'check', className: 'bg-brand-500', iconClass: 'text-white' },
  remove: { icon: 'trash', className: 'bg-ink-900', iconClass: 'text-ink-300' },
  warn: { icon: 'alert', className: 'bg-coral-500', iconClass: 'text-white' },
}

type ShowToast = (message: string, tone?: ToastTone) => void

const Ctx = createContext<ShowToast>(() => {})

const SHOW_MS = 1900
const EXIT_MS = 260

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastItem | null>(null)
  const timers = useRef<number[]>([])
  const seq = useRef(0)

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const show = useCallback<ShowToast>((message, tone = 'success') => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    const id = ++seq.current
    setToast({ id, message, tone, leaving: false })
    timers.current.push(
      window.setTimeout(
        () => setToast((t) => (t && t.id === id ? { ...t, leaving: true } : t)),
        SHOW_MS,
      ),
      window.setTimeout(
        () => setToast((t) => (t && t.id === id ? null : t)),
        SHOW_MS + EXIT_MS,
      ),
    )
  }, [])

  const t = toast ? TONE[toast.tone] : null

  return (
    <Ctx.Provider value={show}>
      {children}

      {/* 상단 토스트 — 앱 셸 폭에 맞춰 중앙 정렬 */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] mx-auto flex w-full max-w-[480px] justify-center px-4"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)' }}
      >
        {toast && t && (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`gpu flex items-center gap-2 rounded-full px-4 py-3 text-[13.5px] font-bold text-white ring-1 ring-white/15 ${
              t.className
            } ${toast.leaving ? 'animate-toast-out' : 'animate-toast-in'}`}
            style={{ boxShadow: '0 12px 32px -8px rgba(20,23,28,.45)' }}
          >
            <Icon name={t.icon} size={16} strokeWidth={2.6} className={t.iconClass} />
            {toast.message}
          </div>
        )}
      </div>
    </Ctx.Provider>
  )
}

export function useToast() {
  return useContext(Ctx)
}
