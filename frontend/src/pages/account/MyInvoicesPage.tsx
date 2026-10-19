import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { meApi } from '../../api/endpoints'
import type { InvoiceDto } from '../../api/types'
import { InvoiceBadge } from '../../components/ui/StatusBadge'
import { EmptyState, ErrorNote, ListSkeleton } from '../../components/ui/Feedback'
import { dateTime, money } from '../../lib/format'
import { useLabels } from '../../lib/labels'

function InvoiceDetail({ invoice, onClose }: { invoice: InvoiceDto; onClose: () => void }) {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  return (
    <div className="card-tile-accent p-6 print:border-none print:shadow-none">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl text-tinta-900">{invoice.invoiceNumber}</h2>
          <p className="text-sm text-tinta-600">{dateTime(invoice.issuedAt)}</p>
        </div>
        <InvoiceBadge status={invoice.status} />
      </div>

      <dl className="mb-6 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
        <div className="flex justify-between sm:block">
          <dt className="text-tinta-600">{t('account.myInvoices.client')}</dt>
          <dd className="font-medium text-tinta-900">{invoice.clientFullName}</dd>
        </div>
        <div className="flex justify-between sm:block">
          <dt className="text-tinta-600">{t('account.myInvoices.hotel')}</dt>
          <dd className="font-medium text-tinta-900">{invoice.hotelName}</dd>
        </div>
        <div className="flex justify-between sm:block">
          <dt className="text-tinta-600">{t('account.myInvoices.booking')}</dt>
          <dd className="font-medium text-tinta-900">{invoice.bookingCode}</dd>
        </div>
        <div className="flex justify-between sm:block">
          <dt className="text-tinta-600">{t('admin.invoices.method')}</dt>
          <dd className="font-medium text-tinta-900">{tLabel('paymentMethod', invoice.paymentMethod)}</dd>
        </div>
      </dl>

      <table className="w-full text-sm">
        <tbody>
          <tr className="border-t border-cal-200">
            <td className="py-2 text-tinta-600">{t('account.myInvoices.subtotal')}</td>
            <td className="py-2 text-right font-medium text-tinta-900">
              {money(invoice.subtotal)}
            </td>
          </tr>
          <tr className="border-t border-cal-200">
            <td className="py-2 text-tinta-600">
              {t('account.myInvoices.vat', { rate: Math.round(invoice.vatRate * 100) })}
            </td>
            <td className="py-2 text-right font-medium text-tinta-900">
              {money(invoice.vatAmount)}
            </td>
          </tr>
          <tr className="border-t-2 border-cal-400">
            <td className="py-2 font-semibold text-tinta-900">{t('admin.invoices.total')}</td>
            <td className="py-2 text-right text-lg font-semibold text-tinta-900">
              {money(invoice.total)}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 flex gap-3 print:hidden">
        <button className="btn-primary" onClick={() => window.print()}>
          {t('account.myInvoices.print')}
        </button>
        <button className="btn-ghost" onClick={onClose}>
          {t('common.back')}
        </button>
      </div>
    </div>
  )
}

export default function MyInvoicesPage() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<InvoiceDto | null>(null)
  const { data, isPending, error } = useQuery({
    queryKey: ['me', 'invoices'],
    queryFn: () => meApi.invoices({ size: 20 }),
  })

  if (isPending) return <ListSkeleton />
  if (error) return <ErrorNote error={error} />
  if (selected) return <InvoiceDetail invoice={selected} onClose={() => setSelected(null)} />
  if (!data || data.content.length === 0) {
    return (
      <EmptyState
        title={t('account.myInvoices.emptyTitle')}
        hint={t('account.myInvoices.emptyHint')}
      />
    )
  }

  return (
    <div className="card-tile overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-cal-200 text-left text-xs tracking-wide text-tinta-600 uppercase">
            <th className="px-4 py-3 font-semibold">{t('account.myInvoices.number')}</th>
            <th className="px-4 py-3 font-semibold">{t('account.myInvoices.date')}</th>
            <th className="px-4 py-3 font-semibold">{t('account.myInvoices.hotel')}</th>
            <th className="px-4 py-3 font-semibold">{t('account.myInvoices.status')}</th>
            <th className="px-4 py-3 text-right font-semibold">{t('admin.invoices.total')}</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {data.content.map((invoice) => (
            <tr key={invoice.id} className="border-b border-cal-200 last:border-0 hover:bg-cal-100/60">
              <td className="px-4 py-3 font-medium text-tinta-900">{invoice.invoiceNumber}</td>
              <td className="px-4 py-3 text-tinta-600">{dateTime(invoice.issuedAt)}</td>
              <td className="px-4 py-3 text-tinta-600">{invoice.hotelName}</td>
              <td className="px-4 py-3">
                <InvoiceBadge status={invoice.status} />
              </td>
              <td className="px-4 py-3 text-right font-medium text-tinta-900">
                {money(invoice.total)}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  className="text-sm font-medium text-fez-700 hover:text-fez-700"
                  onClick={() => setSelected(invoice)}
                >
                  {t('account.myInvoices.view')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
