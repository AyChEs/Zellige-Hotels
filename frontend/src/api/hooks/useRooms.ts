import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { roomApi } from '../endpoints'
import { qk } from '../queryKeys'
import { useInvalidate } from './invalidate'

export function useRoomList(params: { page?: number; hotelId?: number; size?: number }, enabled = true) {
  return useQuery({
    queryKey: qk.rooms.list(params),
    queryFn: () => roomApi.search(params),
    placeholderData: keepPreviousData,
    enabled,
  })
}

/** Free rooms for a stay. The same key for the public page and the front desk form. */
export function useAvailability(hotelId: number, checkIn: string, checkOut: string, guests: number, enabled = true) {
  return useQuery({
    queryKey: qk.availability.search(hotelId, checkIn, checkOut, guests),
    queryFn: () => roomApi.available(hotelId, checkIn, checkOut, guests),
    enabled,
  })
}

export function useSaveRoom(onSuccess?: () => void) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, body }: { id: number | null; body: unknown }) =>
      id == null ? roomApi.create(body) : roomApi.update(id, body),
    onSuccess: () => {
      invalidate(qk.rooms.all, qk.availability.all)
      onSuccess?.()
    },
  })
}

export function useRemoveRoom() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (id: number) => roomApi.remove(id),
    onSuccess: () => invalidate(qk.rooms.all, qk.availability.all),
  })
}
