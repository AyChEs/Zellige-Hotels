import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBookingAction, useBookingList, type BookingAction } from '../../api/hooks/useBookings'
import type { BookingDto, BookingStatus } from '../../api/types'
import { problemMessage } from '../../api/client'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { FilterChips } from '../../components/ui/FilterChips'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { BookingBadge } from '../../components/ui/StatusBadge'
import { useToast } from '../../components/ui/toast-context'
import { date, money } from '../../lib/format'
import { useLabels } from '../../lib/labels'
import { CreateBookingForm } from './bookings/CreateBookingForm'

type Action = BookingAction
const STATUSES: BookingStatus[] = ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED']

export default function BookingsPage() {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState<BookingStatus | ''>('')
  const [creating, setCreating] = useState(false)
  const [toCancel, setToCancel] = useState<BookingDto | null>(null)
  const toast = useToast()
  const onError = (e: unknown) => toast.error(problemMessage(e))

  const { data, isPending, isFetching, error, refetch } = useBookingList({ page, status: status || undefined })

  const act = useBookingAction((booking, action) => {
    setToCancel(null)
    toast.success(t(`admin.bookings.done.${action}`, { code: booking.code }))
  })

  const ACTION_LABELS: Record<Action, string> = {
    confirm: t('admin.bookings.confirm'),
    checkIn: t('admin.bookings.checkIn'),
    checkOut: t('admin.bookings.checkOut'),
    cancel: t('admin.bookings.cancel'),
  }
  const ACTIONS: Record<BookingStatus, Action[]> = {
    PENDING: ['confirm', 'cancel'],
    CONFIRMED: ['checkIn', 'cancel'],
    CHECKED_IN: ['checkOut'],
    CHECKED_OUT: [],
    CANCELLED: [],
  }

  const columns: Column<BookingDto>[] = [
    {
      header: t('admin.bookings.bookingCol'),
      cell: (b) => (
        <div>
          <p className="cifras font-semibold text-tinta-900">{b.code}</p>
          <p className="text-xs text-tinta-600">{b.clientFullName}</p>
        </div>
      ),
    },
    {
      header: t('admin.bookings.hotelRoomCol'),
      cell: (b) => (
        <div>
          <p className="text-tinta-900">{b.hotelName}</p>
          <p className="text-xs text-tinta-600">{t('admin.bookings.roomShort', { n: b.roomNumber })}</p>
        </div>
      ),
    },
    {
      header: t('admin.bookings.dates'),
      cell: (b) => (
        <span className="cifras text-tinta-600">
          {date(b.checkInDate)} - {date(b.checkOutDate)}
        </span>
      ),
    },
    { header: t('admin.bookings.status'), cell: (b) => <BookingBadge status={b.status} /> },
    { header: t('admin.bookings.total'), align: 'right', cell: (b) => <span className="font-semibold">{money(b.totalPrice)}</span> },
    {
      header: t('common.actions'),
      align: 'right',
      cell: (b) => (
        <div className="flex justify-end gap-2">
          {ACTIONS[b.status].map((action) => (
            <Button
              key={action}
              size="sm"
              variant={action === 'cancel' ? 'secondary' : 'primary'}
              disabled={act.isPending}
              aria-label={`${ACTION_LABELS[action]} ${b.code}`}
              onClick={() => (action === 'cancel' ? setToCancel(b) : act.mutate({ booking: b, action }, { onError }))}
            >
              {ACTION_LABELS[action]}
            </Button>
          ))}
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title={t('admin.bookings.title')}
        subtitle={t('admin.bookings.subtitle')}
        actions={
          <Button onClick={() => setCreating(true)}>{t('admin.bookings.new')}</Button>
        }
      />

      <FilterChips
        label={t('admin.bookings.status')}
        value={status}
        onChange={(s) => {
          setStatus(s)
          setPage(0)
        }}
        options={[
          { value: '', label: t('admin.bookings.allStatuses') },
          ...STATUSES.map((s) => ({ value: s, label: tLabel('bookingStatus', s) })),
        ]}
      />

      <DataTable
        caption={t('admin.bookings.caption')}
        columns={columns}
        data={data}
        isPending={isPending}
        isFetching={isFetching && !isPending}
        error={error}
        onRetry={() => refetch()}
        page={page}
        onPageChange={setPage}
        emptyTitle={t('admin.bookings.emptyTitle')}
        emptyHint={t('admin.bookings.emptyHint')}
        rowKey={(b) => b.id}
      />

      <Modal open={creating} title={t('admin.bookings.newFrontDesk')} onClose={() => setCreating(false)} wide>
        <CreateBookingForm onDone={() => setCreating(false)} />
      </Modal>

      <ConfirmDialog
        open={toCancel !== null}
        title={t('admin.bookings.cancelConfirm', { code: toCancel?.code ?? '' })}
        confirmLabel={t('admin.bookings.cancel')}
        loading={act.isPending}
        onCancel={() => setToCancel(null)}
        onConfirm={() => toCancel && act.mutate({ booking: toCancel, action: 'cancel' }, { onError })}
      >
        {toCancel && `${toCancel.clientFullName} · ${toCancel.hotelName} · ${date(toCancel.checkInDate)} - ${date(toCancel.checkOutDate)}`}
      </ConfirmDialog>
    </>
  )
}
