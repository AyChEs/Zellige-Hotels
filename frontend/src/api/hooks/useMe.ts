import { useMutation, useQuery } from '@tanstack/react-query'
import { meApi } from '../endpoints'
import type { BookingDto, BoardType } from '../types'
import { qk } from '../queryKeys'
import { useInvalidate } from './invalidate'

export const useMyBookings = () => useQuery({ queryKey: qk.me.bookings, queryFn: () => meApi.bookings({ size: 20 }) })
export const useMyInvoices = () => useQuery({ queryKey: qk.me.invoices, queryFn: () => meApi.invoices({ size: 20 }) })
export const useMyProfile = () => useQuery({ queryKey: qk.me.profile, queryFn: () => meApi.profile() })

export function useBookRoom(options: { onSuccess?: (b: BookingDto) => void; onError?: (e: unknown) => void } = {}) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (body: { roomId: number; checkInDate: string; checkOutDate: string; guests: number; boardType: BoardType }) =>
      meApi.book(body),
    onSuccess: (booking) => {
      invalidate(qk.availability.all, qk.me.bookings)
      options.onSuccess?.(booking)
    },
    onError: options.onError,
  })
}

export function useCancelMyBooking(onSuccess?: (b: BookingDto) => void) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (booking: BookingDto) => meApi.cancelBooking(booking.id),
    onSuccess: (_, booking) => {
      invalidate(qk.me.bookings, qk.availability.all)
      onSuccess?.(booking)
    },
  })
}

export function useUpdateProfile(onSuccess?: () => void) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (body: unknown) => meApi.updateProfile(body),
    onSuccess: () => {
      invalidate(qk.me.profile)
      onSuccess?.()
    },
  })
}
