import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInvoiceableBookings } from '../../../api/hooks/useBookings'
import { useGenerateInvoice } from '../../../api/hooks/useInvoices'
import type { PaymentMethod } from '../../../api/types'
import { Button } from '../../../components/ui/Button'
import { ErrorNote } from '../../../components/ui/Feedback'
import { Field, Select } from '../../../components/ui/Field'
import { useToast } from '../../../components/ui/toast-context'
import { money } from '../../../lib/format'
import { useLabels } from '../../../lib/labels'

export function GenerateInvoiceForm({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  const toast = useToast()
  const [bookingId, setBookingId] = useState<number | ''>('')
  const [method, setMethod] = useState<PaymentMethod>('CARD')

  const candidates = useInvoiceableBookings()
  const generate = useGenerateInvoice((invoice) => {
    toast.success(t('admin.invoices.issuedToast', { number: invoice.invoiceNumber }))
    onDone()
  })

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (bookingId) generate.mutate({ bookingId: Number(bookingId), method })
      }}
    >
      <Field
        id="gi-booking"
        label={`${t('admin.invoices.invoiceableBooking')}${candidates.data ? ` (${candidates.data.length})` : ''}`}
        hint={t('admin.invoices.candidatesHint')}
      >
        <Select required value={bookingId} onChange={(e) => setBookingId(Number(e.target.value))}>
          <option value="" disabled>
            {t('admin.invoices.pickBooking')}
          </option>
          {candidates.data?.map((b) => (
            <option key={b.id} value={b.id}>
              {b.code} · {b.clientFullName} · {money(b.totalPrice)}
            </option>
          ))}
        </Select>
      </Field>

      <Field id="gi-method" label={t('admin.invoices.method')}>
        <Select value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
          {(['CARD', 'CASH', 'BANK_TRANSFER'] as PaymentMethod[]).map((v) => (
            <option key={v} value={v}>
              {tLabel('paymentMethod', v)}
            </option>
          ))}
        </Select>
      </Field>

      {generate.error && <ErrorNote error={generate.error} />}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onDone}>
          {t('common.close')}
        </Button>
        <Button type="submit" loading={generate.isPending} disabled={!bookingId}>
          {generate.isPending ? t('admin.invoices.generating') : t('admin.invoices.generate')}
        </Button>
      </div>
    </form>
  )
}
