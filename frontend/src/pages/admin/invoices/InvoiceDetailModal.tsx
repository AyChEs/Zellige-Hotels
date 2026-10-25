import { useTranslation } from 'react-i18next'
import type { InvoiceDto } from '../../../api/types'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { InvoiceBadge } from '../../../components/ui/StatusBadge'
import { dateTime, money } from '../../../lib/format'
import { useLabels } from '../../../lib/labels'

export function InvoiceDetailModal({ invoice, onClose }: { invoice: InvoiceDto | null; onClose: () => void }) {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  return (
    <Modal open={invoice !== null} title={invoice?.invoiceNumber ?? ''} onClose={onClose}>
      {invoice && (
        <>
          <dl className="mb-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {(
              [
                [t('account.myInvoices.client'), invoice.clientFullName],
                [t('account.myInvoices.hotel'), invoice.hotelName],
                [t('account.myInvoices.booking'), invoice.bookingCode],
                [t('admin.invoices.issuedAt'), dateTime(invoice.issuedAt)],
                [t('admin.invoices.method'), tLabel('paymentMethod', invoice.paymentMethod)],
              ] as const
            ).map(([label, value]) => (
              <div key={label}>
                <dt className="text-tinta-600">{label}</dt>
                <dd className="font-semibold text-tinta-900">{value}</dd>
              </div>
            ))}
            <div>
              <dt className="text-tinta-600">{t('admin.invoices.status')}</dt>
              <dd>
                <InvoiceBadge status={invoice.status} />
              </dd>
            </div>
          </dl>
          <table className="cifras w-full text-sm">
            <caption className="sr-only">{invoice.invoiceNumber}</caption>
            <tbody>
              <tr className="border-t border-cal-200">
                <th scope="row" className="py-2 text-left font-normal text-tinta-600">
                  {t('account.myInvoices.subtotal')}
                </th>
                <td className="py-2 text-right font-semibold">{money(invoice.subtotal)}</td>
              </tr>
              <tr className="border-t border-cal-200">
                <th scope="row" className="py-2 text-left font-normal text-tinta-600">
                  {t('account.myInvoices.vat', { rate: Math.round(invoice.vatRate * 100) })}
                </th>
                <td className="py-2 text-right font-semibold">{money(invoice.vatAmount)}</td>
              </tr>
              <tr className="border-t-2 border-cal-400">
                <th scope="row" className="py-2 text-left font-semibold">
                  {t('admin.invoices.total')}
                </th>
                <td className="py-2 text-right text-lg font-semibold">{money(invoice.total)}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onClose}>
              {t('common.close')}
            </Button>
            <Button onClick={() => window.print()}>{t('account.myInvoices.print')}</Button>
          </div>
        </>
      )}
    </Modal>
  )
}
