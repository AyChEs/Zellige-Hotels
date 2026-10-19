import { useQueryClient, type QueryKey } from '@tanstack/react-query'

/** Invalidates exactly the keys given: each mutation lists what it really changes. */
export function useInvalidate() {
  const queryClient = useQueryClient()
  return (...keys: QueryKey[]) => Promise.all(keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })))
}
