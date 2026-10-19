import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ClientDto, ClientType } from '../../api/types'
import { Button } from '../../components/ui/Button'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Field, Input, Select } from '../../components/ui/Field'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/StatusBadge'
import { PageHeader } from '../../components/ui/PageHeader'
import { ErrorNote } from '../../components/ui/Feedback'
import { useAuth } from '../../auth/AuthContext'
import { useRemoveClient, useSaveClient, useClientList } from '../../api/hooks/useClients'
import { problemMessage } from '../../api/client'
import { useToast } from '../../components/ui/toast-context'
import { useLabels } from '../../lib/labels'

export default function ClientsPage() {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<ClientDto | null | 'new'>(null)
  const { hasRole } = useAuth()

  const { data, isPending, isFetching, error, refetch } = useClientList({ page, search: search || undefined })
  const toast = useToast()
  const save = useSaveClient(() => {
    setEditing(null)
    toast.success(t('common.savedToast'))
  })
  const remove = useRemoveClient()
  const [toDelete, setToDelete] = useState<{ id: number; title: string } | null>(null)

  const current = editing === 'new' ? null : editing

  const columns: Column<ClientDto>[] = [
    {
      header: t('admin.clients.name'),
      cell: (c) => (
        <div>
          <p className="font-medium text-tinta-900">{c.lastName}, {c.firstName}</p>
          <p className="text-xs text-tinta-600">{c.email ?? t('admin.clients.noAccount')}</p>
        </div>
      ),
    },
    { header: t('auth.register.documentId'), cell: (c) => c.documentId },
    { header: t('auth.register.phone'), cell: (c) => c.phone ?? '-' },
    {
      header: t('admin.clients.type'),
      cell: (c) => (
        <Badge tone={c.clientType === 'VIP' ? 'bg-granate-50 text-granate-700' : 'bg-cal-100 text-tinta-600'}>
          {tLabel('clientType', c.clientType)}
        </Badge>
      ),
    },
    {
      header: t('common.actions'),
      align: 'right',
      cell: (c) => (
        <div className="flex justify-end gap-1.5">
          <Button variant="secondary" size="sm" onClick={() => setEditing(c)}>{t('common.edit')}</Button>
          {hasRole('ADMIN', 'MANAGER') && (
            <Button variant="secondary" size="sm" onClick={() => setToDelete({ id: c.id, title: t('admin.clients.deleteConfirm', { name: `${c.firstName} ${c.lastName}` }) })}>
              {t('common.delete')}
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title={t('admin.clients.title')}
        subtitle={t('admin.clients.subtitle')}
        actions={<Button onClick={() => setEditing('new')}>{t('admin.clients.new')}</Button>}
      />

      <div role="search" className="mb-4 max-w-sm">
        <Field id="clients-search" label={t('admin.clients.searchLabel')}>
          <Input
            type="search"
            placeholder={t('admin.bookings.clientSearchPlaceholder')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(0)
            }}
          />
        </Field>
      </div>

      <DataTable
        caption={t('admin.clients.caption')}
        columns={columns} data={data} isPending={isPending} isFetching={isFetching && !isPending} error={error}
        onRetry={() => refetch()}
        page={page} onPageChange={setPage}
        emptyTitle={t('admin.clients.emptyTitle')}
        emptyHint={t('admin.clients.emptyHint')}
        rowKey={(c) => c.id}
      />

      <Modal
        open={editing !== null}
        title={current ? t('admin.clients.edit', { name: `${current.firstName} ${current.lastName}` }) : t('admin.clients.create')}
        onClose={() => setEditing(null)}
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
                clientType: f.get('clientType') as ClientType,
              },
            })
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="cl-first" label={t('auth.register.firstName')}>
              <Input name="firstName" required maxLength={80} defaultValue={current?.firstName} />
            </Field>
            <Field id="cl-last" label={t('auth.register.lastName')}>
              <Input name="lastName" required maxLength={80} defaultValue={current?.lastName} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="cl-doc" label={t('auth.register.documentId')}>
              <Input name="documentId" required maxLength={40} defaultValue={current?.documentId} />
            </Field>
            <Field id="cl-birth" label={t('account.profile.birthDate')}>
              <Input name="birthDate" type="date" defaultValue={current?.birthDate ?? ''} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="cl-phone" label={t('auth.register.phone')}>
              <Input name="phone" type="tel" maxLength={40} defaultValue={current?.phone ?? ''} />
            </Field>
            <Field id="cl-type" label={t('admin.clients.type')}>
              <Select name="clientType" defaultValue={current?.clientType ?? 'REGULAR'}>
                {(['REGULAR','VIP'] as ClientType[]).map((v) => (
                  <option key={v} value={v}>{tLabel('clientType', v)}</option>
                ))}
              </Select>
            </Field>
          </div>
          <Field id="cl-addr" label={t('account.profile.address')}>
            <Input name="address" maxLength={200} defaultValue={current?.address ?? ''} />
          </Field>
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
