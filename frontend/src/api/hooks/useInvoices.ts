import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { invoiceApi } from '../endpoints'
import type { InvoiceDto, InvoiceStatus, PaymentMethod } from '../types'
import { qk } from '../queryKeys'
import { useInvalidate } from './invalidate'

export function useInvoiceList(params: { page: number; status?: InvoiceStatus }) {
  return useQuery({
    queryKey: qk.invoices.list(params),
    queryFn: () => invoiceApi.search(params),
    placeholderData: keepPreviousData,
  })
}

/** An invoice links to its booking (invoiceId) and counts as revenue. */
export function useGenerateInvoice(onSuccess?: (invoice: InvoiceDto) => void) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ bookingId, method }: { bookingId: number; method: PaymentMethod }) =>
      invoiceApi.generate(bookingId, method),
    onSuccess: (invoice) => {
      invalidate(qk.invoices.all, qk.bookings.all, qk.dashboard.all)
      onSuccess?.(invoice)
    },
  })
}

export function useMarkInvoicePaid(onSuccess?: (invoice: InvoiceDto) => void) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (invoice: InvoiceDto) => invoiceApi.markPaid(invoice.id),
    onSuccess: (_, invoice) => {
      invalidate(qk.invoices.all, qk.dashboard.all)
      onSuccess?.(invoice)
    },
  })
}
