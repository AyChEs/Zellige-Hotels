import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { employeeApi } from '../endpoints'
import { qk } from '../queryKeys'
import { useInvalidate } from './invalidate'

export function useEmployeeList(params: { page?: number; hotelId?: number; status?: string; size?: number }, enabled = true) {
  return useQuery({
    queryKey: qk.employees.list(params),
    queryFn: () => employeeApi.search(params),
    placeholderData: keepPreviousData,
    enabled,
  })
}

export function useSaveEmployee(onSuccess?: () => void) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, body }: { id: number | null; body: unknown }) =>
      id == null ? employeeApi.create(body) : employeeApi.update(id, body),
    onSuccess: () => {
      invalidate(qk.employees.all)
      onSuccess?.()
    },
  })
}

export function useRemoveEmployee() {
  const invalidate = useInvalidate()
  return useMutation({ mutationFn: (id: number) => employeeApi.remove(id), onSuccess: () => invalidate(qk.employees.all) })
}
