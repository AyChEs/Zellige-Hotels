import { useTranslation } from 'react-i18next'
import type { BookingDto } from '../../../api/types'
import { date } from '../../../lib/format'
import { ButtonLink } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'

/** Shown above the rooms once the booking exists: the code is what the guest keeps. */
export function BookingCreated({ booking }: { booking: BookingDto }) {
  const { t } = useTranslation()
  return (
    <Card as="section" variant="brand" aria-labelledby="reserva-creada" className="p-5">
      <h2 id="reserva-creada" className="text-lg font-semibold text-tinta-900">
        {t('booking.createdTitle')}
      </h2>
      <p className="mt-1 text-sm text-tinta-600">
        {t('booking.code')}: <span className="cifras text-xl font-semibold text-granate-700">{booking.code}</span>
      </p>
      <p className="mt-1 text-sm text-tinta-600">
        {booking.hotelName} · {date(booking.checkInDate)} - {date(booking.checkOutDate)}. {t('booking.createdBody')}
      </p>
      <ButtonLink to="/account" variant="secondary" className="mt-4">
        {t('booking.seeMyBookings')}
      </ButtonLink>
    </Card>
  )
}
