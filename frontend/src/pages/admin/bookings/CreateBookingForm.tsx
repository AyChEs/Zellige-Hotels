import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCreateBooking } from '../../../api/hooks/useBookings'
import { useClientList } from '../../../api/hooks/useClients'
import { useHotelOptions } from '../../../api/hooks/useHotels'
import { useAvailability } from '../../../api/hooks/useRooms'
import type { BoardType } from '../../../api/types'
import { Button } from '../../../components/ui/Button'
import { DateRangeField } from '../../../components/ui/DateRangeField'
import { ErrorNote } from '../../../components/ui/Feedback'
import { Field, Input, Select } from '../../../components/ui/Field'
import { useToast } from '../../../components/ui/toast-context'
import { money, plusDaysIso, todayIso } from '../../../lib/format'
import { useLabels } from '../../../lib/labels'

const BOARDS: BoardType[] = ['ROOM_ONLY', 'BED_AND_BREAKFAST', 'HALF_BOARD', 'FULL_BOARD']

/** Front desk booking: hotel, dates, an available room and the client. */
export function CreateBookingForm({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  const toast = useToast()
  const [hotelId, setHotelId] = useState<number | ''>('')
  const [checkIn, setCheckIn] = useState(plusDaysIso(1))
  const [checkOut, setCheckOut] = useState(plusDaysIso(3))
  const [guests, setGuests] = useState(2)
  const [roomId, setRoomId] = useState<number | ''>('')
  const [clientSearch, setClientSearch] = useState('')
  const [clientId, setClientId] = useState<number | ''>('')
  const [board, setBoard] = useState<BoardType>('BED_AND_BREAKFAST')

  const hotels = useHotelOptions()
  const rooms = useAvailability(Number(hotelId), checkIn, checkOut, guests, hotelId !== '' && checkIn < checkOut)
  const clients = useClientList({ search: clientSearch || undefined, size: 8 })

  const create = useCreateBooking((booking) => {
    toast.success(t('booking.created', { code: booking.code }))
    onDone()
  })

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (roomId && clientId)
          create.mutate({ roomId, clientId, checkInDate: checkIn, checkOutDate: checkOut, guests, boardType: board })
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="nb-hotel" label={t('booking.hotel')}>
          <Select
            required
            value={hotelId}
            onChange={(e) => {
              setHotelId(Number(e.target.value))
              setRoomId('')
            }}
          >
            <option value="" disabled>
              {t('admin.bookings.pickHotel')}
            </option>
            {hotels.data?.content.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field id="nb-guests" label={t('public.landing.guests')}>
          <Input type="number" min={1} max={10} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
        </Field>
      </div>

      <DateRangeField
        checkIn={checkIn}
        checkOut={checkOut}
        min={todayIso()}
        onChange={(a, b) => {
          setCheckIn(a)
          setCheckOut(b)
          setRoomId('')
        }}
      />

      <Field
        id="nb-room"
        label={`${t('admin.bookings.availableRoom')}${rooms.data ? ` (${rooms.data.length})` : ''}`}
      >
        <Select
          required
          value={roomId}
          onChange={(e) => setRoomId(Number(e.target.value))}
          disabled={!rooms.data || rooms.data.length === 0}
        >
          <option value="" disabled>
            {hotelId === '' ? t('admin.bookings.pickHotelFirst') : t('admin.bookings.pickRoom')}
          </option>
          {rooms.data?.map((r) => (
            <option key={r.id} value={r.id}>
              {r.number} · {tLabel('roomType', r.type)} · {money(r.pricePerNight)}
              {t('public.hotelDetail.perNight')}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Field id="nb-client-search" label={t('account.myInvoices.client')}>
            <Input
              type="search"
              placeholder={t('admin.bookings.clientSearchPlaceholder')}
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
            />
          </Field>
          <Select
            required
            value={clientId}
            size={4}
            className="py-1"
            onChange={(e) => setClientId(Number(e.target.value))}
            aria-label={t('admin.bookings.clientResults')}
          >
            {clients.data?.content.map((c) => (
              <option key={c.id} value={c.id}>
                {c.lastName}, {c.firstName} · {c.documentId}
              </option>
            ))}
          </Select>
        </div>
        <Field id="nb-board" label={t('public.hotelDetail.board')}>
          <Select value={board} onChange={(e) => setBoard(e.target.value as BoardType)}>
            {BOARDS.map((v) => (
              <option key={v} value={v}>
                {tLabel('boardType', v)}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {create.error && <ErrorNote error={create.error} />}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onDone}>
          {t('common.close')}
        </Button>
        <Button type="submit" loading={create.isPending} disabled={!roomId || !clientId}>
          {create.isPending ? t('admin.bookings.creating') : t('admin.bookings.create')}
        </Button>
      </div>
    </form>
  )
}
