/**
 * PWA 아이콘 생성기 — 외부 이미지 라이브러리 없이 PNG를 직접 인코딩합니다.
 * 실행: node scripts/gen-icons.mjs
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let c = -1
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4)
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t))

/** 강원 플랜잇 마크: 청록 배경 + 흰 산 능선 + 파도 + 산호빛 해 */
function drawIcon(size) {
  const buf = Buffer.alloc(size * size * 4)
  const top = [16, 138, 148]
  const bottom = [8, 79, 90]
  const white = [255, 255, 255]
  const coral = [255, 107, 74]

  const put = (x, y, color, alpha = 1) => {
    const i = (y * size + x) * 4
    const src = [buf[i], buf[i + 1], buf[i + 2]]
    const out = mix(src, color, alpha)
    buf[i] = out[0]
    buf[i + 1] = out[1]
    buf[i + 2] = out[2]
    buf[i + 3] = 255
  }

  // 배경 그라디언트
  for (let y = 0; y < size; y++) {
    const c = mix(top, bottom, y / size)
    for (let x = 0; x < size; x++) put(x, y, c, 1)
  }

  const S = size
  const sunX = 0.70 * S
  const sunY = 0.30 * S
  const sunR = 0.085 * S

  // 해
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const d = Math.hypot(x - sunX, y - sunY)
      if (d < sunR + 1) put(x, y, coral, clamp(sunR + 0.5 - d))
    }
  }

  // 산 능선 (두 봉우리)
  const peaks = [
    { cx: 0.42 * S, top: 0.34 * S, half: 0.235 * S },
    { cx: 0.63 * S, top: 0.45 * S, half: 0.17 * S },
  ]
  const baseY = 0.665 * S
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (y > baseY || y < 0.3 * S) continue
      let inside = false
      for (const p of peaks) {
        const t = Math.abs(x - p.cx) / p.half
        if (t <= 1 && y >= p.top + t * (baseY - p.top)) inside = true
      }
      if (inside) put(x, y, white, 1)
    }
  }
  // 능선 아래 받침
  for (let y = Math.floor(baseY); y < Math.ceil(baseY + 0.012 * S); y++)
    for (let x = Math.floor(0.185 * S); x < Math.ceil(0.815 * S); x++) put(x, y, white, 1)

  // 파도 2줄
  const waves = [
    { y: 0.755 * S, amp: 0.028 * S, thick: 0.045 * S, alpha: 1 },
    { y: 0.855 * S, amp: 0.028 * S, thick: 0.038 * S, alpha: 0.62 },
  ]
  for (const w of waves) {
    for (let x = Math.floor(0.16 * S); x < Math.ceil(0.84 * S); x++) {
      const cy = w.y + Math.sin((x / S) * Math.PI * 3.1) * w.amp
      for (let y = Math.floor(cy - w.thick / 2); y <= Math.ceil(cy + w.thick / 2); y++) {
        if (y < 0 || y >= S) continue
        const dist = Math.abs(y - cy)
        put(x, y, white, clamp(w.thick / 2 + 0.5 - dist) * w.alpha)
      }
    }
  }

  return buf
}

const clamp = (v) => Math.max(0, Math.min(1, v))

mkdirSync(resolve(ROOT, 'public'), { recursive: true })
for (const size of [192, 512, 180]) {
  const name = size === 180 ? 'apple-touch-icon.png' : `icon-${size}.png`
  writeFileSync(resolve(ROOT, 'public', name), encodePng(size, size, drawIcon(size)))
  console.log('generated', name)
}
