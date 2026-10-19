import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { problemMessage } from '../api/client'
import { useToast } from '../components/ui/toast-context'

interface CrudApi {
  create: (body: unknown) => Promise<unknown>
  update: (id: number, body: unknown) => Promise<unknown>
  remove: (id: number) => Promise<void>
}

/** Shared create/update/delete mutations that invalidate the list query and say how it went. */
export function useCrud(queryKey: string, api: CrudApi, onSaved?: () => void) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { t } = useTranslation()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: [queryKey] })

  const save = useMutation({
    mutationFn: ({ id, body }: { id: number | null; body: unknown }) =>
      id == null ? api.create(body) : api.update(id, body),
    onSuccess: () => {
      invalidate()
      toast.success(t('common.savedToast'))
      onSaved?.()
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => api.remove(id),
    onSuccess: () => {
      invalidate()
      toast.success(t('common.deletedToast'))
    },
    onError: (e) => toast.error(problemMessage(e)),
  })

  return { save, remove }
}
