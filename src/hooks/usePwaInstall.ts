import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export type InstallOutcome = 'accepted' | 'dismissed' | 'unavailable'

/** 홈 화면 추가(A2HS) — 스토어 배포 전 웹앱 설치 경로 */
export function usePwaInstall() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(
    typeof window !== 'undefined' &&
      window.matchMedia('(display-mode: standalone)').matches,
  )

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const install = async (): Promise<InstallOutcome> => {
    if (!deferred) return 'unavailable'
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setDeferred(null)
    return outcome
  }

  return { canInstall: !!deferred, installed, install }
}
