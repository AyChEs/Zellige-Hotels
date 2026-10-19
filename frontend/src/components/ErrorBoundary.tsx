import { Component, Suspense, type ErrorInfo, type ReactNode } from 'react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

interface Props {
  children: ReactNode
  onReset?: () => void
  /** When this value changes (the route), a crashed screen gets a fresh try. */
  resetKey?: unknown
}

interface State {
  error: Error | null
}

/** Catches a page that throws so the layout and navigation keep working. */
class Boundary extends Component<Props & { fallback: (reset: () => void) => ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Page crashed', error, info.componentStack)
  }

  componentDidUpdate(prev: Props) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null })
  }

  reset = () => {
    this.props.onReset?.()
    this.setState({ error: null })
  }

  render() {
    return this.state.error ? this.props.fallback(this.reset) : this.props.children
  }
}

function PageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-10" aria-hidden>
      <div className="skeleton h-8 w-64" />
      <div className="skeleton h-40 w-full" />
      <div className="skeleton h-40 w-full" />
    </div>
  )
}

function Fallback({ onRetry, nested }: { onRetry: () => void; nested?: boolean }) {
  const Heading = nested ? 'h2' : 'h1'
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Card variant="brand" className="p-6 text-center">
        <Heading className="font-display text-2xl text-tinta-900">{t('errors.pageTitle')}</Heading>
        <p className="mt-2 text-tinta-600">{t('errors.pageBody')}</p>
        <Button className="mt-6" onClick={onRetry}>
          {t('errors.tryAgain')}
        </Button>
      </Card>
    </div>
  )
}

export function ErrorBoundary({
  children,
  resetKey,
  nested,
}: {
  children: ReactNode
  resetKey?: unknown
  /** Inside a layout that already has the page <h1> (the client area). */
  nested?: boolean
}) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <Boundary onReset={reset} resetKey={resetKey} fallback={(retry) => <Fallback onRetry={retry} nested={nested} />}>
          {/* Lazy pages load here, inside the layout, so the header never blinks. */}
          <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
        </Boundary>
      )}
    </QueryErrorResetBoundary>
  )
}
