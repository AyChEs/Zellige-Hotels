import { useMutation, useQuery } from '@tanstack/react-query'
import { taskApi } from '../endpoints'
import type { TaskDto, TaskStatus } from '../types'
import { qk } from '../queryKeys'
import { useInvalidate } from './invalidate'

export function useTaskBoard() {
  return useQuery({ queryKey: qk.tasks.board, queryFn: () => taskApi.search({ size: 100 }) })
}

/** Pending tasks are a dashboard figure, so task changes refresh its summary. */
export function useCreateTask(onSuccess?: () => void) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (body: unknown) => taskApi.create(body),
    onSuccess: () => {
      invalidate(qk.tasks.all, qk.dashboard.summary)
      onSuccess?.()
    },
  })
}

export function useMoveTask(onSuccess?: (task: TaskDto, status: TaskStatus) => void) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ task, status }: { task: TaskDto; status: TaskStatus }) => taskApi.changeStatus(task.id, status),
    onSuccess: (_, { task, status }) => {
      invalidate(qk.tasks.all, qk.dashboard.summary)
      onSuccess?.(task, status)
    },
  })
}
