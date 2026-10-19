import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { bookingApi } from '../endpoints'
import type { BookingDto, BookingStatus } from '../types'
import { qk } from '../queryKeys'
import { useInvalidate } from './invalidate'

export type BookingAction = 'confirm' | 'checkIn' | 'checkOut' | 'cancel'

export function useBookingList(params: { page: number; status?: BookingStatus }) {
  return useQuery({
    queryKey: qk.bookings.list(params),
    queryFn: () => bookingApi.search(params),
    placeholderData: keepPreviousData,
  })
}

export function useCalendarBookings(hotelId: number, start: string, end: string, days: number) {
  return useQuery({
    queryKey: qk.bookings.calendar(hotelId, start, days),
    queryFn: () => bookingApi.search({ hotelId, from: start, to: end, size: 200 }),
  })
}

/** Confirmed, checked-in or checked-out bookings that still have no invoice. */
export function useInvoiceableBookings() {
  return useQuery({
    queryKey: qk.bookings.invoiceable,
    queryFn: async () => {
      const [confirmed, checkedIn, checkedOut] = await Promise.all([
        bookingApi.search({ status: 'CONFIRMED', size: 50 }),
        bookingApi.search({ status: 'CHECKED_IN', size: 50 }),
        bookingApi.search({ status: 'CHECKED_OUT', size: 50 }),
      ])
      return [...confirmed.content, ...checkedIn.content, ...checkedOut.content].filter((b) => !b.invoiceId)
    },
  })
}

/**
 * What each transition really changes on the server:
 * confirm and cancel move the booking and free or hold the room; check-in occupies the
 * room; check-out frees it and creates a cleaning task. All of them move the dashboard.
 */
const AFFECTS = {
  confirm: [qk.bookings.all, qk.dashboard.all, qk.availability.all],
  cancel: [qk.bookings.all, qk.dashboard.all, qk.availability.all],
  checkIn: [qk.bookings.all, qk.dashboard.all, qk.availability.all, qk.rooms.all],
  checkOut: [qk.bookings.all, qk.dashboard.all, qk.availability.all, qk.rooms.all, qk.tasks.all],
} as const

export function useBookingAction(onSuccess?: (booking: BookingDto, action: BookingAction) => void) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ booking, action }: { booking: BookingDto; action: BookingAction }) => bookingApi[action](booking.id),
    onSuccess: (_, { booking, action }) => {
      invalidate(...AFFECTS[action])
      onSuccess?.(booking, action)
    },
  })
}

export function useCreateBooking(onSuccess?: (booking: BookingDto) => void) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (body: unknown) => bookingApi.create(body),
    onSuccess: (booking) => {
      invalidate(qk.bookings.all, qk.availability.all, qk.dashboard.all)
      onSuccess?.(booking)
    },
  })
}
