import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMoveTask, useTaskBoard } from '../../api/hooks/useTasks'
import type { TaskDto, TaskStatus } from '../../api/types'
import { problemMessage } from '../../api/client'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState, ErrorNote, ListSkeleton } from '../../components/ui/Feedback'
import { Select } from '../../components/ui/Field'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { PriorityBadge } from '../../components/ui/StatusBadge'
import { useToast } from '../../components/ui/toast-context'
import { date } from '../../lib/format'
import { useLabels } from '../../lib/labels'
import { TaskForm } from './tasks/TaskForm'

const COLUMNS: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'DONE']
const NEXT: Record<TaskStatus, TaskStatus[]> = {
  PENDING: ['IN_PROGRESS', 'DONE', 'CANCELLED'],
  IN_PROGRESS: ['DONE', 'PENDING', 'CANCELLED'],
  DONE: [],
  CANCELLED: [],
}

/** One task. The status changes with a select (no drag and drop needed). */
function TaskCard({ task, onMove, busy }: { task: TaskDto; onMove: (status: TaskStatus) => void; busy: boolean }) {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  const selectId = `task-${task.id}-status`
  return (
    <Card as="article" className="p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-tinta-900">{task.title}</h3>
        <PriorityBadge priority={task.priority} />
      </div>
      <p className="mt-1 text-xs text-tinta-600">
        {tLabel('taskType', task.type)} · {task.hotelName}
        {task.roomNumber && ` · ${t('admin.bookings.roomShort', { n: task.roomNumber })}`}
        {task.dueDate && ` · ${t('admin.tasks.due', { date: date(task.dueDate) })}`}
      </p>
      {task.assignees.length > 0 && (
        <p className="mt-1 text-xs text-tinta-600">{task.assignees.map((a) => a.fullName).join(', ')}</p>
      )}
      {NEXT[task.status].length > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <label htmlFor={selectId} className="text-xs font-semibold text-tinta-900">
            {t('admin.tasks.moveTo')}
          </label>
          <Select
            id={selectId}
            className="min-h-9 flex-1 text-sm"
            value=""
            disabled={busy}
            onChange={(e) => e.target.value && onMove(e.target.value as TaskStatus)}
          >
            <option value="">{tLabel('taskStatus', task.status)}</option>
            {NEXT[task.status].map((s) => (
              <option key={s} value={s}>
                {tLabel('taskStatus', s)}
              </option>
            ))}
          </Select>
        </div>
      )}
    </Card>
  )
}

export default function TasksPage() {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  const toast = useToast()
  const [creating, setCreating] = useState(false)

  const { data, isPending, error, refetch } = useTaskBoard()
  const move = useMoveTask((task, status) =>
    toast.success(t('admin.tasks.moved', { title: task.title, status: tLabel('taskStatus', status) })),
  )

  if (isPending) return <ListSkeleton rows={4} />
  if (error) return <ErrorNote error={error} onRetry={() => refetch()} />

  const byStatus = (status: TaskStatus) => data.content.filter((task) => task.status === status)

  return (
    <>
      <PageHeader
        title={t('admin.tasks.title')}
        subtitle={t('admin.tasks.subtitle')}
        actions={<Button onClick={() => setCreating(true)}>{t('admin.tasks.new')}</Button>}
      />

      {data.content.length === 0 ? (
        <EmptyState title={t('admin.tasks.emptyTitle')} hint={t('admin.tasks.emptyHint')} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {COLUMNS.map((status) => (
            <section key={status} aria-labelledby={`col-${status}`} className="rounded-(--radius-card) bg-cal-100 p-3">
              <h2 id={`col-${status}`} className="mb-3 px-1 text-sm font-semibold text-tinta-900">
                {tLabel('taskStatus', status)} <span className="cifras text-tinta-600">· {byStatus(status).length}</span>
              </h2>
              <div className="space-y-3">
                {byStatus(status).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    busy={move.isPending}
                    onMove={(next) => move.mutate({ task, status: next }, { onError: (e) => toast.error(problemMessage(e)) })}
                  />
                ))}
                {byStatus(status).length === 0 && (
                  <p className="rounded-(--radius-control) border border-dashed border-cal-400 px-4 py-6 text-center text-sm text-tinta-600">
                    {t('admin.tasks.emptyColumn')}
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      )}

      <Modal open={creating} title={t('admin.tasks.new')} onClose={() => setCreating(false)} wide>
        <TaskForm onDone={() => setCreating(false)} />
      </Modal>
    </>
  )
}
