import { useCategories } from '../../api/hooks/useCategories'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { HotelDto } from '../../api/types'
import { Button } from '../../components/ui/Button'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Field, Input, Select, Textarea } from '../../components/ui/Field'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/StatusBadge'
import { PageHeader } from '../../components/ui/PageHeader'
import { ErrorNote } from '../../components/ui/Feedback'
import { useRemoveHotel, useSaveHotel, useHotelList } from '../../api/hooks/useHotels'
import { problemMessage } from '../../api/client'
import { useToast } from '../../components/ui/toast-context'

export default function HotelsAdminPage() {
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState<HotelDto | null | 'new'>(null)

  const { data, isPending, isFetching, error, refetch } = useHotelList({ page })
  const categories = useCategories()
  const toast = useToast()
  const save = useSaveHotel(() => {
    setEditing(null)
    toast.success(t('common.savedToast'))
  })
  const remove = useRemoveHotel()
  const [toDelete, setToDelete] = useState<{ id: number; title: string } | null>(null)

  const current = editing === 'new' ? null : editing

  const columns: Column<HotelDto>[] = [
    {
      header: t('admin.hotels.name'),
      cell: (h) => (
        <div>
          <p className="font-medium text-tinta-900">{h.name}</p>
          <p className="text-xs text-tinta-600">{h.address}</p>
        </div>
      ),
    },
    { header: t('admin.hotels.city'), cell: (h) => `${h.city}, ${h.country}` },
    { header: t('admin.hotels.category'), cell: (h) => (
        <>
          <span aria-hidden className="text-granate-700">{'★'.repeat(h.category.starRating)}</span>
          <span className="sr-only">{t('public.hotelDetail.stars', { count: h.category.starRating })}</span>
        </>
      ) },
    {
      header: t('admin.hotels.active'),
      cell: (h) => (
        <Badge tone={h.active ? 'bg-fez-50 text-fez-700' : 'bg-cal-100 text-tinta-600'}>
          {h.active ? t('common.active') : t('common.inactive')}
        </Badge>
      ),
    },
    {
      header: t('common.actions'),
      align: 'right',
      cell: (h) => (
        <div className="flex justify-end gap-1.5">
          <Button variant="secondary" size="sm" onClick={() => setEditing(h)}>{t('common.edit')}</Button>
          <Button variant="secondary" size="sm" onClick={() => setToDelete({ id: h.id, title: t('admin.hotels.deleteConfirm', { name: h.name }) })}>
              {t('common.delete')}
            </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title={t('admin.hotels.title')}
        subtitle={t('admin.hotels.subtitle')}
        actions={<Button onClick={() => setEditing('new')}>{t('admin.hotels.new')}</Button>}
      />

      <DataTable
        caption={t('admin.hotels.caption')}
        columns={columns} data={data} isPending={isPending} isFetching={isFetching && !isPending} error={error}
        onRetry={() => refetch()}
        page={page} onPageChange={setPage}
        emptyTitle={t('admin.hotels.emptyTitle')} rowKey={(h) => h.id}
      />

      <Modal
        open={editing !== null}
        title={current ? t('admin.hotels.edit', { name: current.name }) : t('admin.hotels.create')}
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
                name: f.get('name'), address: f.get('address'), city: f.get('city'),
                country: f.get('country'), phone: f.get('phone') || null,
                email: f.get('email') || null, description: f.get('description') || null,
                imageUrl: f.get('imageUrl') || null,
                active: f.get('active') === 'on',
                categoryId: Number(f.get('categoryId')),
              },
            })
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="h-name" label={t('admin.hotels.name')}>
              <Input name="name" required maxLength={120} defaultValue={current?.name} />
            </Field>
            <Field id="h-cat" label={t('admin.hotels.category')}>
              <Select name="categoryId" required defaultValue={current?.category.id}>
                {categories.data?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.starRating}★)</option>
                ))}
              </Select>
            </Field>
          </div>
          <Field id="h-addr" label={t('admin.hotels.address')}>
            <Input name="address" required maxLength={200} defaultValue={current?.address} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="h-city" label={t('admin.hotels.city')}>
              <Input name="city" required maxLength={100} defaultValue={current?.city} />
            </Field>
            <Field id="h-country" label={t('admin.hotels.country')}>
              <Input name="country" required maxLength={100} defaultValue={current?.country} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="h-phone" label={t('auth.register.phone')}>
              <Input name="phone" maxLength={40} defaultValue={current?.phone ?? ''} />
            </Field>
            <Field id="h-email" label={t('auth.login.email')}>
              <Input name="email" type="email" maxLength={160} defaultValue={current?.email ?? ''} />
            </Field>
          </div>
          <Field id="h-img" label={t('admin.hotels.imageUrl')}>
            <Input name="imageUrl" type="url" maxLength={500} defaultValue={current?.imageUrl ?? ''} />
          </Field>
          <Field id="h-desc" label={t('admin.hotels.description')}>
            <Textarea name="description" rows={2} maxLength={1000} defaultValue={current?.description ?? ''} />
          </Field>
          <label className="flex items-center gap-2 text-sm text-tinta-900">
            <input type="checkbox" name="active" defaultChecked={current?.active ?? true} />
            {t('admin.hotels.activeLabel')}
          </label>
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
