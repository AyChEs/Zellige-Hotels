import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { clientApi } from '../endpoints'
import { qk } from '../queryKeys'
import { useInvalidate } from './invalidate'

export function useClientList(params: { page?: number; search?: string; size?: number }) {
  return useQuery({
    queryKey: qk.clients.list(params),
    queryFn: () => clientApi.search(params),
    placeholderData: keepPreviousData,
  })
}

export function useSaveClient(onSuccess?: () => void) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, body }: { id: number | null; body: unknown }) =>
      id == null ? clientApi.create(body) : clientApi.update(id, body),
    onSuccess: () => {
      invalidate(qk.clients.all)
      onSuccess?.()
    },
  })
}

export function useRemoveClient() {
  const invalidate = useInvalidate()
  return useMutation({ mutationFn: (id: number) => clientApi.remove(id), onSuccess: () => invalidate(qk.clients.all) })
}
