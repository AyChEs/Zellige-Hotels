import { useHotelOptions } from '../../api/hooks/useHotels'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { EmployeeDto, EmployeePosition, EmployeeStatus } from '../../api/types'
import { Button } from '../../components/ui/Button'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Field, Input, Select } from '../../components/ui/Field'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/StatusBadge'
import { PageHeader } from '../../components/ui/PageHeader'
import { ErrorNote } from '../../components/ui/Feedback'
import { useAuth } from '../../auth/AuthContext'
import { useRemoveEmployee, useSaveEmployee, useEmployeeList } from '../../api/hooks/useEmployees'
import { problemMessage } from '../../api/client'
import { useToast } from '../../components/ui/toast-context'
import { money, todayIso } from '../../lib/format'
import { useLabels } from '../../lib/labels'

const STATUS_TONE: Record<EmployeeStatus, string> = {
  ACTIVE: 'bg-fez-50 text-fez-700',
  ON_LEAVE: 'bg-aviso-50 text-aviso-ink',
  TERMINATED: 'bg-cal-100 text-tinta-600',
}

export default function EmployeesPage() {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState<EmployeeDto | null | 'new'>(null)
  const { hasRole } = useAuth()
  const isAdmin = hasRole('ADMIN')

  const hotels = useHotelOptions()
  const { data, isPending, isFetching, error, refetch } = useEmployeeList({ page })
  const toast = useToast()
  const save = useSaveEmployee(() => {
    setEditing(null)
    toast.success(t('common.savedToast'))
  })
  const remove = useRemoveEmployee()
  const [toDelete, setToDelete] = useState<{ id: number; title: string } | null>(null)

  const current = editing === 'new' ? null : editing

  const columns: Column<EmployeeDto>[] = [
    {
      header: t('admin.employees.name'),
      cell: (e) => (
        <div>
          <p className="font-medium text-tinta-900">{e.lastName}, {e.firstName}</p>
          <p className="text-xs text-tinta-600">{e.email ?? e.documentId}</p>
        </div>
      ),
    },
    { header: t('admin.employees.position'), cell: (e) => tLabel('employeePosition', e.position) },
    { header: t('admin.rooms.hotel'), cell: (e) => e.hotelName ?? '-' },
    {
      header: t('admin.employees.status'),
      cell: (e) => <Badge tone={STATUS_TONE[e.status]}>{tLabel('employeeStatus', e.status)}</Badge>,
    },
    ...(isAdmin
      ? [{
          header: t('admin.employees.grossSalary'),
          align: 'right' as const,
          cell: (e: EmployeeDto) => (e.grossSalary != null ? money(e.grossSalary) : '-'),
        }]
      : []),
    {
      header: t('common.actions'),
      align: 'right',
      cell: (e) =>
        isAdmin ? (
          <div className="flex justify-end gap-1.5">
            <Button variant="secondary" size="sm" onClick={() => setEditing(e)}>{t('common.edit')}</Button>
            <Button variant="secondary" size="sm" onClick={() => setToDelete({ id: e.id, title: t('admin.employees.deleteConfirm', { name: `${e.firstName} ${e.lastName}` }) })}>
              {t('common.delete')}
            </Button>
          </div>
        ) : (
          <span className="text-xs text-tinta-600">{t('admin.employees.readOnly')}</span>
        ),
    },
  ]

  return (
    <>
      <PageHeader
        title={t('admin.employees.title')}
        subtitle={isAdmin ? t('admin.employees.subtitleAdmin') : t('admin.employees.subtitleReadonly')}
        actions={isAdmin && <Button onClick={() => setEditing('new')}>{t('admin.employees.new')}</Button>}
      />

      <DataTable
        caption={t('admin.employees.caption')}
        columns={columns} data={data} isPending={isPending} isFetching={isFetching && !isPending} error={error}
        onRetry={() => refetch()}
        page={page} onPageChange={setPage}
        emptyTitle={t('admin.employees.emptyTitle')} rowKey={(e) => e.id}
      />

      <Modal
        open={editing !== null}
        title={current ? t('admin.employees.edit', { name: `${current.firstName} ${current.lastName}` }) : t('admin.employees.create')}
        onClose={() => setEditing(null)}
        wide
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            const f = new FormData(e.currentTarget)
            save.mutate({
              id: current?.id ?? null,
              body: {
                firstName: f.get('firstName'), lastName: f.get('lastName'),
                documentId: f.get('documentId'),
                birthDate: f.get('birthDate') || null,
                phone: f.get('phone') || null, address: f.get('address') || null,
                position: f.get('position') as EmployeePosition,
                status: f.get('status') as EmployeeStatus,
                hiredAt: f.get('hiredAt'),
                grossSalary: f.get('grossSalary') ? Number(f.get('grossSalary')) : null,
                hotelId: f.get('hotelId') ? Number(f.get('hotelId')) : null,
              },
            })
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="e-first" label={t('auth.register.firstName')}>
              <Input name="firstName" required maxLength={80} defaultValue={current?.firstName} />
            </Field>
            <Field id="e-last" label={t('auth.register.lastName')}>
              <Input name="lastName" required maxLength={80} defaultValue={current?.lastName} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field id="e-doc" label={t('auth.register.documentId')}>
              <Input name="documentId" required maxLength={40} defaultValue={current?.documentId} />
            </Field>
            <Field id="e-birth" label={t('account.profile.birthDate')}>
              <Input name="birthDate" type="date" defaultValue={current?.birthDate ?? ''} />
            </Field>
            <Field id="e-phone" label={t('auth.register.phone')}>
              <Input name="phone" type="tel" maxLength={40} defaultValue={current?.phone ?? ''} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field id="e-pos" label={t('admin.employees.position')}>
              <Select name="position" defaultValue={current?.position ?? 'RECEPTIONIST'}>
                {(['MANAGER','RECEPTIONIST','HOUSEKEEPER','MAINTENANCE'] as EmployeePosition[]).map((v) => (
                  <option key={v} value={v}>{tLabel('employeePosition', v)}</option>
                ))}
              </Select>
            </Field>
            <Field id="e-status" label={t('admin.employees.status')}>
              <Select name="status" defaultValue={current?.status ?? 'ACTIVE'}>
                {(['ACTIVE','ON_LEAVE','TERMINATED'] as EmployeeStatus[]).map((v) => (
                  <option key={v} value={v}>{tLabel('employeeStatus', v)}</option>
                ))}
              </Select>
            </Field>
            <Field id="e-hotel" label={t('booking.hotel')}>
              <Select name="hotelId" defaultValue={current?.hotelId ?? ''}>
                <option value="">{t('admin.employees.unassigned')}</option>
                {hotels.data?.content.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="e-hired" label={t('admin.employees.hireDate')}>
              <Input name="hiredAt" type="date" required defaultValue={current?.hiredAt ?? todayIso()} />
            </Field>
            <Field id="e-salary" label={t('admin.employees.grossSalaryField')}>
              <Input name="grossSalary" type="number" step="0.01" min={0} defaultValue={current?.grossSalary ?? ''} />
            </Field>
          </div>
          {save.error && <ErrorNote error={save.error} />}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setEditing(null)}>{t('common.close')}</Button>
            <Button type="submit" loading={save.isPending}>
              {save.isPending ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        open={toDelete !== null}
        title={toDelete?.title ?? ''}
        confirmLabel={t('common.delete')}
        loading={remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() =>
          toDelete &&
          remove.mutate(toDelete.id, {
            onSuccess: () => toast.success(t('common.deletedToast')),
            onError: (e) => toast.error(problemMessage(e)),
            onSettled: () => setToDelete(null),
          })
        }
      />
    </>
  )
}
