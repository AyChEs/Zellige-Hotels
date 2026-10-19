import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { employeeApi, hotelApi, roomApi, taskApi } from '../../../api/endpoints'
import { Button } from '../../../components/ui/Button'
import { ErrorNote } from '../../../components/ui/Feedback'
import { Field, Input, Select, Textarea } from '../../../components/ui/Field'
import { useToast } from '../../../components/ui/toast-context'
import { useLabels } from '../../../lib/labels'

export function TaskForm({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  const toast = useToast()
  const [hotelId, setHotelId] = useState<number | ''>('')
  const [roomId, setRoomId] = useState<number | ''>('')
  const [assignees, setAssignees] = useState<number[]>([])
  const queryClient = useQueryClient()

  const hotels = useQuery({ queryKey: ['hotels', 'all'], queryFn: () => hotelApi.search({ size: 50 }) })
  const rooms = useQuery({
    queryKey: ['rooms', 'byHotel', hotelId],
    queryFn: () => roomApi.search({ hotelId: Number(hotelId), size: 60 }),
    enabled: hotelId !== '',
  })
  const employees = useQuery({
    queryKey: ['employees', 'byHotel', hotelId],
    queryFn: () => employeeApi.search({ hotelId: Number(hotelId), status: 'ACTIVE', size: 50 }),
    enabled: hotelId !== '',
  })

  const create = useMutation({
    mutationFn: (form: FormData) =>
      taskApi.create({
        title: form.get('title'),
        description: form.get('description') || null,
        type: form.get('type'),
        priority: form.get('priority'),
        dueDate: form.get('dueDate') || null,
        hotelId,
        roomId: roomId === '' ? null : roomId,
        assigneeIds: assignees,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success(t('admin.tasks.created'))
      onDone()
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        create.mutate(new FormData(e.currentTarget))
      }}
    >
      <Field id="t-title" label={t('admin.tasks.titleLabel')}>
        <Input name="title" required maxLength={150} />
      </Field>
      <Field id="t-desc" label={`${t('admin.tasks.description')} (${t('common.optional')})`}>
        <Textarea name="description" rows={2} maxLength={1000} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field id="t-type" label={t('admin.tasks.type')}>
          <Select name="type" defaultValue="CLEANING">
            {(['CLEANING', 'MAINTENANCE', 'OTHER'] as const).map((v) => (
              <option key={v} value={v}>
                {tLabel('taskType', v)}
              </option>
            ))}
          </Select>
        </Field>
        <Field id="t-priority" label={t('admin.tasks.priority')}>
          <Select name="priority" defaultValue="MEDIUM">
            {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).map((v) => (
              <option key={v} value={v}>
                {tLabel('taskPriority', v)}
              </option>
            ))}
          </Select>
        </Field>
        <Field id="t-due" label={`${t('admin.tasks.dueDate')} (${t('common.optional')})`}>
          <Input name="dueDate" type="date" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="t-hotel" label={t('booking.hotel')}>
          <Select
            name="hotelId"
            required
            value={hotelId}
            onChange={(e) => {
              setHotelId(Number(e.target.value))
              setRoomId('')
              setAssignees([])
            }}
          >
            <option value="" disabled>
              {t('admin.bookings.pickHotel')}
            </option>
            {hotels.data?.content.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field id="t-room" label={t('admin.tasks.roomOptional')}>
          <Select
            name="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value === '' ? '' : Number(e.target.value))}
            disabled={hotelId === ''}
          >
            <option value="">{t('common.none')}</option>
            {rooms.data?.content.map((r) => (
              <option key={r.id} value={r.id}>
                {r.number}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field id="t-assignees" label={t('admin.tasks.assigneeHint')}>
        <Select
          multiple
          size={4}
          className="py-1"
          value={assignees.map(String)}
          onChange={(e) => setAssignees([...e.currentTarget.selectedOptions].map((o) => Number(o.value)))}
          disabled={hotelId === ''}
        >
          {employees.data?.content.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.lastName}, {emp.firstName} · {tLabel('employeePosition', emp.position)}
            </option>
          ))}
        </Select>
      </Field>

      {create.error && <ErrorNote error={create.error} />}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onDone}>
          {t('common.close')}
        </Button>
        <Button type="submit" loading={create.isPending} disabled={hotelId === ''}>
          {create.isPending ? t('admin.tasks.creating') : t('admin.tasks.create')}
        </Button>
      </div>
    </form>
  )
}
