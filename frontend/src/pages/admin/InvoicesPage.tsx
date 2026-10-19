import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { invoiceApi } from '../../api/endpoints'
import type { InvoiceDto, InvoiceStatus } from '../../api/types'
import { problemMessage } from '../../api/client'
import { Button } from '../../components/ui/Button'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { FilterChips } from '../../components/ui/FilterChips'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { InvoiceBadge } from '../../components/ui/StatusBadge'
import { useToast } from '../../components/ui/toast-context'
import { dateTime, money } from '../../lib/format'
import { useLabels } from '../../lib/labels'
import { GenerateInvoiceForm } from './invoices/GenerateInvoiceForm'
import { InvoiceDetailModal } from './invoices/InvoiceDetailModal'

const STATUSES: InvoiceStatus[] = ['ISSUED', 'PAID', 'CANCELLED']

export default function InvoicesPage() {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  const toast = useToast()
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState<InvoiceStatus | ''>('')
  const [generating, setGenerating] = useState(false)
  const [selected, setSelected] = useState<InvoiceDto | null>(null)
  const queryClient = useQueryClient()

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['invoices', page, status],
    queryFn: () => invoiceApi.search({ page, status: status || undefined }),
  })

  const pay = useMutation({
    mutationFn: (invoice: InvoiceDto) => invoiceApi.markPaid(invoice.id),
    onSuccess: (_, invoice) => {
      toast.success(t('admin.invoices.paidToast', { number: invoice.invoiceNumber }))
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
    onError: (e) => toast.error(problemMessage(e)),
  })

  const columns: Column<InvoiceDto>[] = [
    {
      header: t('admin.invoices.number'),
      cell: (i) => <span className="cifras font-semibold text-tinta-900">{i.invoiceNumber}</span>,
    },
    { header: t('account.myInvoices.client'), cell: (i) => i.clientFullName },
    {
      header: t('account.myInvoices.booking'),
      cell: (i) => <span className="cifras text-tinta-600">{i.bookingCode}</span>,
    },
    {
      header: t('admin.invoices.issuedAt'),
      cell: (i) => <span className="cifras text-tinta-600">{dateTime(i.issuedAt)}</span>,
    },
    { header: t('admin.invoices.status'), cell: (i) => <InvoiceBadge status={i.status} /> },
    {
      header: t('admin.invoices.total'),
      align: 'right',
      cell: (i) => <span className="font-semibold">{money(i.total)}</span>,
    },
    {
      header: t('common.actions'),
      align: 'right',
      cell: (i) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelected(i)}
            aria-label={`${t('admin.invoices.view')} ${i.invoiceNumber}`}
          >
            {t('admin.invoices.view')}
          </Button>
          {i.status === 'ISSUED' && (
            <Button
              size="sm"
              disabled={pay.isPending}
              onClick={() => pay.mutate(i)}
              aria-label={`${t('admin.invoices.markPaid')} ${i.invoiceNumber}`}
            >
              {t('admin.invoices.markPaid')}
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title={t('admin.invoices.title')}
        subtitle={t('admin.invoices.subtitle')}
        actions={<Button onClick={() => setGenerating(true)}>{t('admin.invoices.new')}</Button>}
      />

      <FilterChips
        label={t('admin.invoices.status')}
        value={status}
        onChange={(s) => {
          setStatus(s)
          setPage(0)
        }}
        options={[
          { value: '', label: t('admin.bookings.allStatuses') },
          ...STATUSES.map((s) => ({ value: s, label: tLabel('invoiceStatus', s) })),
        ]}
      />

      <DataTable
        caption={t('admin.invoices.caption')}
        columns={columns}
        data={data}
        isPending={isPending}
        error={error}
        onRetry={() => refetch()}
        page={page}
        onPageChange={setPage}
        emptyTitle={t('admin.invoices.emptyTitle')}
        emptyHint={t('admin.invoices.emptyHint')}
        rowKey={(i) => i.id}
      />

      <Modal open={generating} title={t('admin.invoices.new')} onClose={() => setGenerating(false)}>
        <GenerateInvoiceForm onDone={() => setGenerating(false)} />
      </Modal>
      <InvoiceDetailModal invoice={selected} onClose={() => setSelected(null)} />
    </>
  )
}
