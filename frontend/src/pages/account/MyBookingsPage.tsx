import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCancelMyBooking, useMyBookings } from '../../api/hooks/useMe'
import { problemMessage } from '../../api/client'
import type { BookingDto } from '../../api/types'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState, ErrorNote, ListSkeleton } from '../../components/ui/Feedback'
import { Modal } from '../../components/ui/Modal'
import { BookingBadge } from '../../components/ui/StatusBadge'
import { useToast } from '../../components/ui/toast-context'
import { date, money } from '../../lib/format'
import { useLabels } from '../../lib/labels'

export default function MyBookingsPage() {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  const toast = useToast()
  const [toCancel, setToCancel] = useState<BookingDto | null>(null)
  const { data, isPending, error, refetch } = useMyBookings()
  const cancel = useCancelMyBooking((booking) => {
    setToCancel(null)
    toast.success(t('account.cancelledToast', { code: booking.code }))
  })

  if (isPending) return <ListSkeleton />
  if (error) return <ErrorNote error={error} onRetry={() => refetch()} />
  if (data.content.length === 0) {
    return (
      <EmptyState
        title={t('account.myBookings.title')}
        hint={t('account.myBookings.emptyHint')}
        action={<ButtonLink to="/hotels">{t('account.myBookings.emptyLink')}</ButtonLink>}
      />
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="sr-only">{t('account.myBookings.title')}</h2>
      {data.content.map((booking) => {
        const cancellable = booking.status === 'PENDING' || booking.status === 'CONFIRMED'
        return (
          <Card as="article" key={booking.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-xl text-tinta-900">{booking.hotelName}</h3>
                <BookingBadge status={booking.status} />
              </div>
              <p className="cifras mt-1 text-sm text-tinta-600">
                {date(booking.checkInDate)} - {date(booking.checkOutDate)} ·{' '}
                {t('account.myBookings.room', { n: booking.roomNumber })} ·{' '}
                {t('public.hotelDetail.guests', { count: booking.guests })} · {tLabel('boardType', booking.boardType)}
              </p>
              <p className="cifras mt-1 text-sm text-tinta-600">
                {booking.code}
                {booking.invoiceId && (
                  <>
                    {' · '}
                    <Link to="/account/invoices" className="font-semibold text-fez-700 underline underline-offset-2">
                      {t('account.myBookings.invoiceAvailable')}
                    </Link>
                  </>
                )}
              </p>
            </div>
            <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
              <p className="cifras text-xl font-semibold text-tinta-900">{money(booking.totalPrice)}</p>
              {cancellable && (
                <Button variant="secondary" onClick={() => setToCancel(booking)}>
                  {t('account.myBookings.cancel')}
                </Button>
              )}
            </div>
          </Card>
        )
      })}

      <Modal
        open={toCancel !== null}
        title={t('account.cancelConfirm', { code: toCancel?.code ?? '' })}
        onClose={() => setToCancel(null)}
      >
        <p className="text-sm text-tinta-600">
          {toCancel && `${toCancel.hotelName} · ${date(toCancel.checkInDate)} - ${date(toCancel.checkOutDate)}`}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => setToCancel(null)}>
            {t('account.keep')}
          </Button>
          <Button variant="danger" loading={cancel.isPending} onClick={() => toCancel && cancel.mutate(toCancel, { onError: (e) => toast.error(problemMessage(e)) })}>
            {t('account.myBookings.cancel')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
