import { useParams, useSearchParams } from 'react-router-dom'
import { Suspense, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHotel } from '../../api/hooks/useHotels'
import { useAvailability } from '../../api/hooks/useRooms'
import type { BoardType, BookingDto, RoomDto } from '../../api/types'
import { date, nights, plusDaysIso } from '../../lib/format'
import { Button } from '../../components/ui/Button'
import { EmptyState, ErrorNote, ListSkeleton } from '../../components/ui/Feedback'
import { useToast } from '../../components/ui/toast-context'
import { BookingCreated } from './hotel-detail/BookingCreated'
import { BookingSummary } from './hotel-detail/BookingSummary'
import { HotelHeader } from './hotel-detail/HotelHeader'
import { RoomList } from './hotel-detail/RoomList'
import { StayForm } from './hotel-detail/StayForm'
import { BOARDS, type Stay } from './hotel-detail/types'
import { useMenosMovimiento, useNavegadorLibre } from '../../motion/preferencias'
import { MovimientoFicha } from '../../motion/perezoso'

export default function HotelDetailPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const hotelId = Number(useParams().id)
  const [params, setParams] = useSearchParams()
  const checkInRef = useRef<HTMLInputElement>(null)
  const [choice, setChoice] = useState<RoomDto | null>(null)
  const [created, setCreated] = useState<BookingDto | null>(null)
  const raiz = useRef<HTMLDivElement>(null)
  const quieto = useMenosMovimiento()
  const libre = useNavegadorLibre()

  const board = params.get('board') as BoardType | null
  const stay: Stay = {
    checkIn: params.get('checkIn') ?? plusDaysIso(7),
    checkOut: params.get('checkOut') ?? plusDaysIso(10),
    guests: Number(params.get('guests') ?? 2),
    board: board && BOARDS.includes(board) ? board : 'BED_AND_BREAKFAST',
  }
  const nightCount = nights(stay.checkIn, stay.checkOut)

  const { data: hotel } = useHotel(hotelId)
  const availability = useAvailability(hotelId, stay.checkIn, stay.checkOut, stay.guests, nightCount > 0)

  // Fotos de habitaciones distintas para la galería (las de la API, sin repetir).
  const fotosHabitaciones = [...new Set((availability.data ?? []).map((r) => r.imageUrl).filter((u): u is string => !!u))]

  const updateStay = (next: Stay) => {
    setParams({ checkIn: next.checkIn, checkOut: next.checkOut, guests: String(next.guests), board: next.board })
    setCreated(null)
  }

  const onBooked = (booking: BookingDto) => {
    setChoice(null)
    setCreated(booking)
    toast.success(t('booking.created', { code: booking.code }))
  }

  const onTaken = () => {
    setChoice(null)
    toast.error(t('public.hotelDetail.roomTakenHint'))
    availability.refetch()
  }

  return (
    <div ref={raiz} className="revelar pb-16 sm:pb-24">
      <HotelHeader hotel={hotel} fotosHabitaciones={fotosHabitaciones} />

      <div className="mx-auto max-w-6xl space-y-8 px-4 pt-8 sm:pt-12">
        <StayForm key={params.toString()} stay={stay} onSubmit={updateStay} checkInRef={checkInRef} />

        {created && <BookingCreated booking={created} />}

        <section aria-labelledby="habitaciones">
          <h2 id="habitaciones" className="font-display text-2xl text-tinta-900">
            {t('public.hotelDetail.roomsTitle')}
          </h2>
          <p className="cifras mt-1 mb-5 text-sm text-tinta-600">
            {date(stay.checkIn)} - {date(stay.checkOut)} · {t('public.hotelDetail.nights', { count: nightCount })} ·{' '}
            {t('public.hotelDetail.guests', { count: stay.guests })}
          </p>
          {availability.error ? (
            <ErrorNote error={availability.error} onRetry={() => availability.refetch()} />
          ) : availability.isPending ? (
            <ListSkeleton rows={3} />
          ) : availability.data.length === 0 ? (
            <EmptyState
              title={t('public.hotelDetail.noRoomsTitle')}
              hint={t('public.hotelDetail.noRoomsHint')}
              action={
                <Button variant="secondary" onClick={() => checkInRef.current?.focus()}>
                  {t('booking.changeDates')}
                </Button>
              }
            />
          ) : (
            <RoomList rooms={availability.data} stay={stay} onChoose={setChoice} />
          )}
        </section>
      </div>

      <BookingSummary
        hotel={hotel}
        room={choice}
        stay={stay}
        onClose={() => setChoice(null)}
        onBooked={onBooked}
        onTaken={onTaken}
      />

      {!quieto && libre && (
        <Suspense fallback={null}>
          <MovimientoFicha raiz={raiz} listo={!!hotel && !availability.isPending} />
        </Suspense>
      )}
    </div>
  )
}
