import { useLayoutEffect, useRef, useState } from 'react'

const FALLBACK_WIDTH = 480

/** 컨테이너 실제 폭을 구독해 viewBox를 픽셀과 1:1로 맞춥니다. */
export function useMapSize() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(FALLBACK_WIDTH)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => setWidth(el.clientWidth || FALLBACK_WIDTH)
    update()

    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, width }
}
