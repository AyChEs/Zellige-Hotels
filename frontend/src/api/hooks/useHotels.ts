import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { hotelApi } from '../endpoints'
import { qk } from '../queryKeys'
import { useInvalidate } from './invalidate'

/** Hotels for the staff selects: asked once and shared by every screen for ten minutes. */
export function useHotelOptions() {
  return useQuery({
    queryKey: qk.hotels.options,
    queryFn: () => hotelApi.search({ size: 50 }),
    staleTime: 10 * 60_000,
  })
}

export function useHotelList(params: { active?: boolean; search?: string; city?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: qk.hotels.list(params),
    queryFn: () => hotelApi.search(params),
    placeholderData: keepPreviousData,
  })
}

export function useHotel(id: number) {
  return useQuery({ queryKey: qk.hotels.detail(id), queryFn: () => hotelApi.byId(id) })
}

export function useSaveHotel(onSuccess?: () => void) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, body }: { id: number | null; body: unknown }) =>
      id == null ? hotelApi.create(body) : hotelApi.update(id, body),
    onSuccess: () => {
      invalidate(qk.hotels.all)
      onSuccess?.()
    },
  })
}

export function useRemoveHotel() {
  const invalidate = useInvalidate()
  return useMutation({ mutationFn: (id: number) => hotelApi.remove(id), onSuccess: () => invalidate(qk.hotels.all) })
}
