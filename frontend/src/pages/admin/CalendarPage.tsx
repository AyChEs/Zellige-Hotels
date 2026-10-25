import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCalendarBookings } from '../../api/hooks/useBookings'
import { useHotelOptions } from '../../api/hooks/useHotels'
import { useRoomList } from '../../api/hooks/useRooms'
import type { BookingStatus } from '../../api/types'
import { Card } from '../../components/ui/Card'
import { Input, Select } from '../../components/ui/Field'
import { PageHeader } from '../../components/ui/PageHeader'
import { ErrorNote, ListSkeleton } from '../../components/ui/Feedback'
import { plusDaysIso, todayIso } from '../../lib/format'
import { useLabels } from '../../lib/labels'

// Same tones as the status badges; every occupied cell also carries text.
const CELL_TONE: Record<BookingStatus, string> = {
  PENDING: 'bg-aviso-50 text-aviso-ink',
  CONFIRMED: 'bg-info-50 text-info-ink',
  CHECKED_IN: 'bg-fez-700 text-white',
  CHECKED_OUT: 'bg-cal-200 text-tinta-900',
  CANCELLED: '',
}

const initials = (fullName: string) =>
  fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

export default function CalendarPage() {
  const { t, i18n } = useTranslation()
  const { tLabel } = useLabels()
  const locale = i18n.resolvedLanguage?.slice(0, 2) || 'es'
  const [hotelId, setHotelId] = useState<number>(1)
  const [start, setStart] = useState(todayIso())
  const [daysToShow, setDaysToShow] = useState<7 | 14>(() =>
    typeof window !== 'undefined' && window.innerWidth < 640 ? 7 : 14,
  )

  const days = Array.from({ length: daysToShow }, (_, i) =>
    plusDaysIso(i, new Date(start + 'T00:00:00')),
  )
  const end = plusDaysIso(daysToShow, new Date(start + 'T00:00:00'))

  const hotels = useHotelOptions()
  const rooms = useRoomList({ hotelId, size: 100 })
  const bookings = useCalendarBookings(hotelId, start, end, daysToShow)

  if (rooms.error || bookings.error)
    return (
      <ErrorNote
        error={rooms.error ?? bookings.error}
        onRetry={() => {
          rooms.refetch()
          bookings.refetch()
        }}
      />
    )

  const bookingAt = (roomId: number, day: string) =>
    bookings.data?.content.find(
      (b) =>
        b.roomId === roomId &&
        b.status !== 'CANCELLED' &&
        b.checkInDate <= day &&
        b.checkOutDate > day,
    )

  const formatDayHeader = (d: string) => {
    const date = new Date(`${d}T00:00:00`)
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-GB', { day: '2-digit', month: '2-digit' })
  }

  return (
    <>
      <PageHeader
        title={t('admin.calendar.title')}
        subtitle={t('admin.calendar.subtitle', { days: daysToShow })}
        actions={
          <>
            <Select
              className="sm:w-56"
              value={hotelId}
              aria-label={t('booking.hotel')}
              onChange={(e) => setHotelId(Number(e.target.value))}
            >
              {hotels.data?.content.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </Select>
            <Input
              type="date"
              className="sm:w-44"
              value={start}
              aria-label={t('admin.calendar.startDate')}
              onChange={(e) => setStart(e.target.value)}
            />
            <div role="group" aria-label={t('admin.calendar.range')} className="flex items-center gap-1 rounded-(--radius-pill) border border-cal-200 bg-white p-1">
              {([7, 14] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDaysToShow(n)}
                  aria-pressed={daysToShow === n}
                  className={`inline-flex min-h-9 min-w-12 items-center justify-center rounded-(--radius-pill) px-3 text-sm font-semibold ${
                    daysToShow === n ? 'bg-fez-700 text-white' : 'text-tinta-600 hover:text-tinta-900'
                  }`}
                >
                  {t('admin.calendar.days', { count: n })}
                </button>
              ))}
            </div>
          </>
        }
      />

      {/* Legend: colour and text, never colour alone */}
      <ul className="mb-4 flex flex-wrap gap-4 text-sm text-tinta-600">
        {(['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] as BookingStatus[]).map((s) => (
          <li key={s} className="flex items-center gap-2">
            <span aria-hidden className={`inline-block size-4 rounded-(--radius-control) border border-cal-200 ${CELL_TONE[s]}`} />
            {tLabel('bookingStatus', s)}
          </li>
        ))}
      </ul>

      {rooms.isPending || bookings.isPending ? (
        <ListSkeleton rows={5} />
      ) : (
        <Card className="relative overflow-x-auto" tabIndex={0} role="region" aria-label={t('admin.calendar.title')}>
          <table className="w-full min-w-[560px] border-collapse text-xs">
            <caption className="sr-only">{t('admin.calendar.caption', { hotel: hotels.data?.content.find((h) => h.id === hotelId)?.name ?? '' })}</caption>
            <thead>
              <tr>
                <th scope="col" className="sticky left-0 z-10 bg-white px-3 py-2 text-left font-semibold text-tinta-600">
                  {t('admin.calendar.room')}
                </th>
                {days.map((d) => (
                  <th
                    key={d}
                    scope="col"
                    className={`cifras min-w-11 px-1 py-2 text-center font-semibold ${
                      d === todayIso() ? 'text-granate-700 underline decoration-2 underline-offset-4' : 'text-tinta-600'
                    }`}
                  >
                    {formatDayHeader(d)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.data?.content.map((room) => (
                <tr key={room.id} className="border-t border-cal-200">
                  <th scope="row" className="sticky left-0 z-10 bg-white px-3 py-1.5 text-left font-semibold text-tinta-900">
                    {room.number}
                  </th>
                  {days.map((d) => {
                    const b = bookingAt(room.id, d)
                    const label = b
                      ? `${b.code} · ${b.clientFullName} · ${tLabel('bookingStatus', b.status)}`
                      : `${room.number} · ${t('admin.calendar.free')} · ${d}`
                    return (
                      <td key={d} className="p-0.5">
                        {b ? (
                          <div
                            title={label}
                            className={`flex h-7 items-center justify-center rounded-(--radius-control) font-semibold ${CELL_TONE[b.status]}`}
                          >
                            <span aria-hidden>{initials(b.clientFullName)}</span>
                            <span className="sr-only">{label}</span>
                          </div>
                        ) : (
                          <div title={label} className="h-7 rounded-(--radius-control) bg-cal-50">
                            <span className="sr-only">{t('admin.calendar.free')}</span>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  )
}
