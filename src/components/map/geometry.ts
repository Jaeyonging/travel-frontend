import type { Point } from './projection'

/** 점들을 지나는 부드러운 곡선 (중점 기준 이차 베지어) */
export function smoothPath(points: Point[]): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0][0]},${points[0][1]}`
  if (points.length === 2)
    return `M ${points[0][0]},${points[0][1]} L ${points[1][0]},${points[1][1]}`

  let d = `M ${points[0][0]},${points[0][1]}`
  for (let i = 1; i < points.length - 1; i++) {
    const [cx, cy] = points[i]
    const [nx, ny] = points[i + 1]
    d += ` Q ${cx},${cy} ${(cx + nx) / 2},${(cy + ny) / 2}`
  }
  const last = points[points.length - 1]
  return `${d} L ${last[0]},${last[1]}`
}

const GOLDEN_ANGLE = 2.39996

/**
 * 가까운 장소끼리 마커가 완전히 겹치지 않도록 화면 좌표를 살짝 벌립니다.
 * (실제 지도 연동 시에는 클러스터링으로 대체될 부분)
 */
export function spreadOverlapping(
  points: Point[],
  width: number,
  height: number,
  minDistance = 30,
): Point[] {
  const placed: Point[] = []
  const clamp = (v: number, max: number) => Math.max(20, Math.min(max - 20, v))

  points.forEach((p, i) => {
    let [x, y] = p
    let step = 0
    while (
      placed.some(([ox, oy]) => Math.hypot(ox - x, oy - y) < minDistance) &&
      step < 24
    ) {
      step++
      const angle = GOLDEN_ANGLE * (i + step)
      const radius = minDistance * (0.75 + step * 0.2)
      x = clamp(p[0] + Math.cos(angle) * radius, width)
      y = clamp(p[1] + Math.sin(angle) * radius, height)
    }
    placed.push([x, y])
  })

  return placed
}
