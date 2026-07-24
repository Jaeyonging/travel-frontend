export type ApiErrorKind =
  | 'offline'
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'rateLimit'
  | 'server'
  | 'parse'
  | 'unknown'

export interface ApiErrorOptions {
  status?: number
  cause?: unknown
  retryable?: boolean
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status?: number
  readonly retryable: boolean

  constructor(kind: ApiErrorKind, message: string, options: ApiErrorOptions = {}) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = options.status
    this.retryable = options.retryable ?? DEFAULT_RETRYABLE.has(kind)
    if (options.cause !== undefined) this.cause = options.cause
  }
}

const DEFAULT_RETRYABLE = new Set<ApiErrorKind>([
  'offline',
  'network',
  'timeout',
  'rateLimit',
  'server',
])

export function kindFromStatus(status: number): ApiErrorKind {
  if (status === 401) return 'unauthorized'
  if (status === 403) return 'forbidden'
  if (status === 404) return 'notFound'
  if (status === 408) return 'timeout'
  if (status === 429) return 'rateLimit'
  if (status >= 500) return 'server'
  return 'unknown'
}

/** 어떤 예외든 ApiError로 정규화 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return new ApiError('offline', '인터넷 연결이 끊겼습니다.', { cause: error })
  }
  if (error instanceof DOMException && error.name === 'AbortError') {
    return new ApiError('timeout', '요청 시간이 초과되었습니다.', { cause: error })
  }
  if (error instanceof TypeError) {
    // fetch 실패(네트워크 레벨)는 TypeError로 올라옵니다.
    return new ApiError('network', '서버에 연결하지 못했습니다.', { cause: error })
  }
  if (error instanceof SyntaxError) {
    return new ApiError('parse', '응답을 해석하지 못했습니다.', { cause: error })
  }
  const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
  return new ApiError('unknown', message, { cause: error })
}

interface ErrorCopy {
  title: string
  description: string
  action: string
}

const COPY: Record<ApiErrorKind, ErrorCopy> = {
  offline: {
    title: '인터넷이 연결되어 있지 않아요',
    description: 'Wi‑Fi나 데이터 연결을 확인한 뒤 다시 시도해 주세요.',
    action: '다시 시도',
  },
  network: {
    title: '서버에 연결하지 못했어요',
    description: '잠시 후 다시 시도해 주세요. 계속 안 되면 네트워크 상태를 확인해 주세요.',
    action: '다시 시도',
  },
  timeout: {
    title: '응답이 너무 오래 걸려요',
    description: '분석이 지연되고 있어요. 잠시 후 다시 시도해 주세요.',
    action: '다시 시도',
  },
  unauthorized: {
    title: '로그인이 필요해요',
    description: '카카오 계정으로 다시 로그인한 뒤 이용해 주세요.',
    action: '로그인하기',
  },
  forbidden: {
    title: '접근 권한이 없어요',
    description:
      '비공개 콘텐츠이거나 데이터 이용 권한이 만료됐을 수 있어요. 다른 링크로 시도해 보세요.',
    action: '돌아가기',
  },
  notFound: {
    title: '내용을 찾을 수 없어요',
    description: '삭제되었거나 주소가 바뀐 콘텐츠일 수 있어요.',
    action: '돌아가기',
  },
  rateLimit: {
    title: '요청이 너무 많아요',
    description: '공공데이터 조회 한도를 넘었어요. 잠시 후 다시 시도해 주세요.',
    action: '다시 시도',
  },
  server: {
    title: '서버에 문제가 생겼어요',
    description: '잠시 후 다시 시도해 주세요. 문제가 계속되면 문의해 주세요.',
    action: '다시 시도',
  },
  parse: {
    title: '데이터를 읽지 못했어요',
    description: '응답 형식이 예상과 달라요. 잠시 후 다시 시도해 주세요.',
    action: '다시 시도',
  },
  unknown: {
    title: '문제가 발생했어요',
    description: '예상치 못한 오류예요. 다시 시도해 주세요.',
    action: '다시 시도',
  },
}

export function describeApiError(error: unknown): ErrorCopy & { kind: ApiErrorKind } {
  const e = toApiError(error)
  return { ...COPY[e.kind], kind: e.kind }
}
