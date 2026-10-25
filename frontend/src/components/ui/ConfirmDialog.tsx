import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './Button'
import { Modal } from './Modal'

interface Props {
  open: boolean
  title: string
  children?: ReactNode
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

/** Replaces window.confirm: a titled dialog, the safe option first and the destructive one in red. */
export function ConfirmDialog({ open, title, children, confirmLabel, onConfirm, onCancel, loading }: Props) {
  const { t } = useTranslation()
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      {children && <div className="text-sm text-tinta-600">{children}</div>}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
