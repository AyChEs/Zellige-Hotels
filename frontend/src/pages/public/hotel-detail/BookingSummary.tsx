import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { meApi } from '../../../api/endpoints'
import { problemMessage } from '../../../api/client'
import type { BookingDto, HotelDto, RoomDto } from '../../../api/types'
import { date, money, nights } from '../../../lib/format'
import { roomTotal } from '../../../lib/pricing'
import { useLabels } from '../../../lib/labels'
import { Button } from '../../../components/ui/Button'
import { ErrorNote } from '../../../components/ui/Feedback'
import { Modal } from '../../../components/ui/Modal'
import type { Stay } from './types'

interface Props {
  hotel: HotelDto | undefined
  room: RoomDto | null
  stay: Stay
  onClose: () => void
  onBooked: (booking: BookingDto) => void
  /** The room was taken by someone else between listing and confirming. */
  onTaken: () => void
}

/** Confirmation step: nothing is booked until the guest presses «Confirmar reserva». */
export function BookingSummary({ hotel, room, stay, onClose, onBooked, onTaken }: Props) {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  const book = useMutation({
    mutationFn: (roomId: number) =>
      meApi.book({
        roomId,
        checkInDate: stay.checkIn,
        checkOutDate: stay.checkOut,
        guests: stay.guests,
        boardType: stay.board,
      }),
    onSuccess: onBooked,
    onError: (error) => {
      if (problemMessage(error).toLowerCase().includes('available')) onTaken()
    },
  })

  const nightCount = nights(stay.checkIn, stay.checkOut)
  const rows: [string, string][] = room
    ? [
        [t('booking.hotel'), hotel?.name ?? ''],
        [t('booking.room'), t('booking.roomLabel', { type: tLabel('roomType', room.type), number: room.number })],
        [t('booking.dates'), `${date(stay.checkIn)} - ${date(stay.checkOut)}`],
        [t('booking.nights'), String(nightCount)],
        [t('booking.guests'), String(stay.guests)],
        [t('booking.board'), tLabel('boardType', stay.board)],
      ]
    : []

  const close = () => {
    book.reset()
    onClose()
  }

  return (
    <Modal open={room !== null} title={t('booking.summaryTitle')} onClose={close}>
      {room && (
        <>
          <dl className="divide-y divide-cal-200 text-sm">
            {rows.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-2.5">
                <dt className="text-tinta-600">{label}</dt>
                <dd className="cifras text-right font-semibold text-tinta-900">{value}</dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="font-semibold text-tinta-900">{t('booking.total')}</dt>
              <dd className="cifras text-xl font-semibold text-granate-700">
                {money(roomTotal(room, stay.board, stay.guests, nightCount))}
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-sm text-tinta-600">{t('booking.pendingNote')}</p>
          {book.error && !problemMessage(book.error).toLowerCase().includes('available') && (
            <div className="mt-4">
              <ErrorNote error={book.error} />
            </div>
          )}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={close}>
              {t('booking.back')}
            </Button>
            <Button loading={book.isPending} onClick={() => book.mutate(room.id)}>
              {t('booking.confirm')}
            </Button>
          </div>
        </>
      )}
    </Modal>
  )
}
