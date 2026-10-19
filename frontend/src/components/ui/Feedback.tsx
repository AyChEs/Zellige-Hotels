import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { problemMessage } from '../../api/client'
import { Button } from './Button'
import { IconAlerta } from './icons'

export function ErrorNote({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const { t } = useTranslation()
  return (
    <div
      role="alert"
      className="flex flex-wrap items-start gap-3 rounded-(--radius-card) border border-error-700/30 bg-error-50 px-4 py-3 text-sm text-error-ink"
    >
      <IconAlerta size={20} className="mt-px shrink-0" />
      <p className="min-w-0 flex-1 pt-px">{problemMessage(error)}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-(--radius-card) border border-cal-200 bg-white px-6 py-12 text-center">
      <span aria-hidden className="text-xl text-granate-700">
        ◆
      </span>
      <p className="font-semibold text-tinta-900">{title}</p>
      {hint && <p className="max-w-md text-sm text-tinta-600">{hint}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-20 w-full" />
      ))}
    </div>
  )
}
