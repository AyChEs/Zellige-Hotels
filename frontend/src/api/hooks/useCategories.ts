import { useMutation, useQuery } from '@tanstack/react-query'
import { categoryApi } from '../endpoints'
import { qk } from '../queryKeys'
import { useInvalidate } from './invalidate'

export function useCategories() {
  return useQuery({ queryKey: qk.categories.all, queryFn: categoryApi.list, staleTime: 10 * 60_000 })
}

/** Hotels embed their category, so saving one refreshes the hotels too. */
export function useSaveCategory(onSuccess?: () => void) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, body }: { id: number | null; body: unknown }) =>
      id == null ? categoryApi.create(body) : categoryApi.update(id, body),
    onSuccess: () => {
      invalidate(qk.categories.all, qk.hotels.all)
      onSuccess?.()
    },
  })
}

export function useRemoveCategory() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (id: number) => categoryApi.remove(id),
    onSuccess: () => invalidate(qk.categories.all, qk.hotels.all),
  })
}
