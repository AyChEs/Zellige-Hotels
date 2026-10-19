import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { PageResponse } from '../../api/types'
import { Button } from './Button'
import { EmptyState, ErrorNote } from './Feedback'

export interface Column<T> {
  header: string
  cell: (row: T) => ReactNode
  align?: 'left' | 'right'
}

interface Props<T> {
  /** What the table lists, for screen readers (visually hidden). */
  caption: string
  columns: Column<T>[]
  data: PageResponse<T> | undefined
  isPending: boolean
  error?: unknown
  onRetry?: () => void
  page: number
  onPageChange: (page: number) => void
  emptyTitle: string
  emptyHint?: string
  rowKey: (row: T) => string | number
}

/** True while the element is wider inside than outside (the table needs a horizontal scroll). */
function useOverflows<E extends HTMLElement>() {
  const ref = useRef<E>(null)
  const [overflows, setOverflows] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const check = () => setOverflows(el.scrollWidth > el.clientWidth + 1)
    check()
    const observer = new ResizeObserver(check)
    observer.observe(el)
    return () => observer.disconnect()
  })
  return [ref, overflows] as const
}

/** Server-paginated table: the workhorse of every staff list screen. */
export function DataTable<T>({
  caption, columns, data, isPending, error, onRetry, page, onPageChange, emptyTitle, emptyHint, rowKey,
}: Props<T>) {
  const { t } = useTranslation()
  const [scrollRef, overflows] = useOverflows<HTMLDivElement>()

  if (error) return <ErrorNote error={error} onRetry={onRetry} />

  if (isPending) {
    return (
      <div className="rounded-(--radius-card) border border-cal-200 bg-white p-4" aria-hidden>
        <div className="skeleton mb-3 h-8 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton mb-2 h-12 w-full" />
        ))}
      </div>
    )
  }

  if (!data || data.content.length === 0) {
    return <EmptyState title={emptyTitle} hint={emptyHint} />
  }

  return (
    <div className="relative">
      {overflows && (
        <p className="mb-2 flex items-center justify-end gap-1 text-xs text-tinta-600">
          <span aria-hidden>←</span>
          <span>{t('dataTable.scroll')}</span>
          <span aria-hidden>→</span>
        </p>
      )}
      <div className="overflow-hidden rounded-(--radius-card) border border-cal-200 bg-white shadow-(--shadow-card)">
        <div
          ref={scrollRef}
          className="relative overflow-x-auto"
          // A scrollable region must be reachable by keyboard (WCAG 2.1.1).
          {...(overflows ? { tabIndex: 0, role: 'region', 'aria-label': caption } : {})}
        >
          <table className="w-full min-w-[640px] text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead>
              <tr className="border-b border-cal-200 bg-cal-50 text-left text-xs text-tinta-600">
                {columns.map((col) => (
                  <th
                    key={col.header}
                    scope="col"
                    className={`px-4 py-3 font-semibold whitespace-nowrap ${col.align === 'right' ? 'text-right' : ''}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.content.map((row) => (
                <tr key={rowKey(row)} className="h-12 border-b border-cal-200 last:border-0 hover:bg-cal-100/60">
                  {columns.map((col) => (
                    <td
                      key={col.header}
                      className={`px-4 py-2 whitespace-nowrap ${col.align === 'right' ? 'cifras text-right' : ''}`}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.totalPages > 1 && (
          <nav
            aria-label={t('dataTable.ariaLabel')}
            className="flex flex-wrap items-center justify-between gap-2 border-t border-cal-200 px-4 py-3 text-sm"
          >
            <span className="cifras text-tinta-600">
              {t('dataTable.page', { page: data.page + 1, total: data.totalPages, count: data.totalElements })}
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
                {t('common.previous')}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page + 1 >= data.totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                {t('common.next')}
              </Button>
            </div>
          </nav>
        )}
      </div>
    </div>
  )
}
