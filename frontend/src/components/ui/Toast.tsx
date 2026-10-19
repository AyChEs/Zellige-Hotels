import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { IconAlerta, IconCerrar, IconHecho } from './icons'
import { ToastContext, type ToastApi } from './toast-context'

type Kind = 'success' | 'error'
interface Item {
  id: number
  kind: Kind
  text: string
}

const AUTO_CLOSE_MS = 6000

function ToastCard({ item, onClose }: { item: Item; onClose: (id: number) => void }) {
  const { t } = useTranslation()
  useEffect(() => {
    if (item.kind !== 'success') return // errors stay until the user closes them
    const timer = setTimeout(() => onClose(item.id), AUTO_CLOSE_MS)
    return () => clearTimeout(timer)
  }, [item, onClose])

  const Icon = item.kind === 'success' ? IconHecho : IconAlerta
  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-(--radius-card) border bg-white p-4 text-sm text-tinta-900 shadow-(--shadow-card) ${
        item.kind === 'success' ? 'border-cal-200' : 'border-error-700'
      }`}
    >
      <Icon size={20} className={`mt-0.5 shrink-0 ${item.kind === 'success' ? 'text-fez-700' : 'text-error-ink'}`} />
      <p className="flex-1 pt-0.5">{item.text}</p>
      <button
        type="button"
        onClick={() => onClose(item.id)}
        aria-label={t('common.close')}
        className="-m-2 inline-flex size-10 shrink-0 items-center justify-center rounded-(--radius-control) text-tinta-600 hover:bg-cal-100"
      >
        <IconCerrar size={18} />
      </button>
    </div>
  )
}

/**
 * Toast stack, bottom right (full width at 390 px). The two live regions are always in the
 * DOM so screen readers announce what is added: polite status for successes, assertive
 * alert for errors.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  const nextId = useRef(1)

  const close = useCallback((id: number) => setItems((all) => all.filter((i) => i.id !== id)), [])
  const push = useCallback((kind: Kind, text: string) => {
    const id = nextId.current++
    setItems((all) => [...all.slice(-3), { id, kind, text }])
  }, [])

  const api = useMemo<ToastApi>(
    () => ({ success: (text) => push('success', text), error: (text) => push('error', text) }),
    [push],
  )

  const list = (kind: Kind) =>
    items.filter((i) => i.kind === kind).map((i) => <ToastCard key={i.id} item={i} onClose={close} />)

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96 print:hidden">
        <div role="status" aria-live="polite" className="flex flex-col gap-2">
          {list('success')}
        </div>
        <div role="alert" aria-live="assertive" className="flex flex-col gap-2">
          {list('error')}
        </div>
      </div>
    </ToastContext.Provider>
  )
}
