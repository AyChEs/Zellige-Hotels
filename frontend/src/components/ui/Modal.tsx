import { useEffect, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}

/** Native <dialog>: focus trap, Esc-to-close and backdrop for free. */
export function Modal({ open, title, onClose, children, wide }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose() // backdrop click
      }}
      className={`m-auto flex w-full max-h-[100dvh] flex-col ${wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'} ${wide ? 'sm:max-h-[90vh]' : 'sm:max-h-[85vh]'} rounded-(--radius-card)
        border-t-2 border-t-granate-700 bg-white p-0 shadow-(--shadow-card) backdrop:bg-noche-900/50 sm:m-auto`}
    >
      <div className="p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-tinta-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label={t('common.close')}
            className="rounded-(--radius-control) px-2 py-1 text-tinta-600 transition-colors duration-150 hover:bg-cal-100"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
