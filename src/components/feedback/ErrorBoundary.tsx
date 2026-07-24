import { Component, type ErrorInfo, type ReactNode } from 'react'
import ErrorState from './ErrorState'

interface Props {
  children: ReactNode
  /** 이 값이 바뀌면 에러 상태를 자동으로 초기화합니다 (라우트 변경 등) */
  resetKey?: unknown
  fallback?: (error: Error, reset: () => void) => ReactNode
  onError?: (error: Error, info: ErrorInfo) => void
}

interface State {
  error: Error | null
}

/**
 * 렌더링 중 발생한 예외를 잡아 앱 전체가 흰 화면이 되는 것을 막습니다.
 * 라우트 단위와 앱 최상단에 각각 배치합니다.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // 실제 운영에서는 Sentry 등 리포팅 도구로 전송합니다.
    console.error('[ErrorBoundary]', error, info.componentStack)
    this.props.onError?.(error, info)
  }

  componentDidUpdate(prev: Props) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) {
      this.reset()
    }
  }

  reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    if (this.props.fallback) return this.props.fallback(error, this.reset)

    return (
      <ErrorState
        full
        error={error}
        onRetry={this.reset}
        onSecondary={() => {
          this.reset()
          window.location.assign('/')
        }}
      />
    )
  }
}
