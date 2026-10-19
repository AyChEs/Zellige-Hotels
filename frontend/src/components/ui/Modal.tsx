import { useEffect, useId, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { IconCerrar } from './icons'

interface Props {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}

const FOCUSABLE =
  'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'

/**
 * Native <dialog>: focus trap, Esc to close and backdrop for free. On open the focus goes to
 * the first field (or the title); on close it goes back to whatever opened the dialog.
 */
export function Modal({ open, title, onClose, children, wide }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const { t } = useTranslation()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      opener.current = document.activeElement as HTMLElement | null
      dialog.showModal()
      const first = bodyRef.current?.querySelector<HTMLElement>(FOCUSABLE)
      ;(first ?? titleRef.current)?.focus()
    }
    if (!open) {
      if (dialog.open) dialog.close()
      if (opener.current?.isConnected) opener.current.focus()
      opener.current = null
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose() // backdrop click
      }}
      className={`m-auto flex w-full max-h-[100dvh] flex-col ${wide ? 'sm:max-w-3xl sm:max-h-[90vh]' : 'sm:max-w-lg sm:max-h-[85vh]'}
        rounded-(--radius-card) border border-cal-200 bg-white p-0 text-tinta-900 shadow-(--shadow-card) backdrop:bg-tinta-900/40`}
    >
      <div className="overflow-y-auto p-5 sm:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} ref={titleRef} tabIndex={-1} className="pt-1.5 text-lg font-semibold text-tinta-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="-mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-(--radius-control) text-tinta-600 transition-colors duration-150 hover:bg-cal-100 hover:text-tinta-900"
          >
            <IconCerrar size={20} />
          </button>
        </div>
        <div ref={bodyRef}>{children}</div>
      </div>
    </dialog>
  )
}
