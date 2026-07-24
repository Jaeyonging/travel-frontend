import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { routeDepth } from './navigation'

type TransitionName = 'animate-page-push' | 'animate-page-pop' | 'animate-page-fade'

export interface PageTransitionProps {
  pathname: string
  className?: string
  children: ReactNode
}

/**
 * 이동 방향(더 깊이 들어감 / 뒤로 나옴 / 같은 레벨)에 따라
 * 밀어넣기·되돌아오기·페이드 모션을 선택합니다.
 */
export default function PageTransition({
  pathname,
  className,
  children,
}: PageTransitionProps) {
  const prevDepth = useRef(routeDepth(pathname))
  const [animation, setAnimation] = useState<TransitionName>('animate-page-fade')

  useLayoutEffect(() => {
    const depth = routeDepth(pathname)
    setAnimation(
      depth > prevDepth.current
        ? 'animate-page-push'
        : depth < prevDepth.current
          ? 'animate-page-pop'
          : 'animate-page-fade',
    )
    prevDepth.current = depth
  }, [pathname])

  return (
    <div key={pathname} className={cn('gpu', animation, className)}>
      {children}
    </div>
  )
}
