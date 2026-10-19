import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { categoryApi } from '../../api/endpoints'
import type { CategoryDto } from '../../api/types'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Field, Input, Textarea } from '../../components/ui/Field'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { EmptyState, ErrorNote, ListSkeleton } from '../../components/ui/Feedback'
import { useCrud } from '../../hooks/useCrud'

export default function CategoriesPage() {
  const { t } = useTranslation()
  const [editing, setEditing] = useState<CategoryDto | null | 'new'>(null)
  const { data, isPending, error } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.list,
  })
  const { save, remove } = useCrud('categories', categoryApi, () => setEditing(null))
  const [toDelete, setToDelete] = useState<{ id: number; title: string } | null>(null)

  if (isPending) return <ListSkeleton rows={3} />
  if (error) return <ErrorNote error={error} />

  const current = editing === 'new' ? null : editing

  return (
    <>
      <PageHeader
        title={t('admin.categories.title')}
        subtitle={t('admin.categories.subtitle')}
        actions={<Button onClick={() => setEditing('new')}>{t('admin.categories.new')}</Button>}
      />

      {data && data.length === 0 ? (
        <EmptyState title={t('admin.categories.emptyTitle')} />
      ) : (
        <Card className="relative overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <caption className="sr-only">{t('admin.categories.caption')}</caption>
            <thead>
              <tr className="border-b border-cal-200 bg-cal-50 text-left text-xs text-tinta-600">
                <th scope="col" className="px-4 py-3 font-semibold">{t('admin.categories.name')}</th>
                <th scope="col" className="px-4 py-3 font-semibold">{t('admin.categories.stars')}</th>
                <th scope="col" className="px-4 py-3 font-semibold">{t('admin.hotels.description')}</th>
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">{t('common.actions')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((cat) => (
                <tr key={cat.id} className="h-12 border-b border-cal-200 last:border-0 hover:bg-cal-100/60">
                  <td className="px-4 py-3 font-medium text-tinta-900">{cat.name}</td>
                  <td className="px-4 py-3 text-tinta-900">
                    <span aria-hidden className="text-granate-700">{'★'.repeat(cat.starRating)}</span>
                    <span className="sr-only">{t('public.hotelDetail.stars', { count: cat.starRating })}</span>
                  </td>
                  <td className="px-4 py-3 text-tinta-600">{cat.description}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="secondary" size="sm" onClick={() => setEditing(cat)}>
                        {t('common.edit')}
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => setToDelete({ id: cat.id, title: t('admin.categories.deleteConfirm', { name: cat.name }) })}>
              {t('common.delete')}
            </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal
        open={editing !== null}
        title={current ? t('admin.categories.edit', { name: current.name }) : t('admin.categories.create')}
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
                name: f.get('name'),
                starRating: Number(f.get('starRating')),
                description: f.get('description') || null,
              },
            })
          }}
        >
          <Field id="c-name" label={t('admin.categories.name')}>
            <Input name="name" required maxLength={80} defaultValue={current?.name} />
          </Field>
          <Field id="c-stars" label={t('admin.categories.starsRange')}>
            <Input name="starRating" type="number" min={1} max={5} required defaultValue={current?.starRating ?? 3} />
          </Field>
          <Field id="c-desc" label={t('admin.hotels.description')}>
            <Textarea name="description" rows={2} maxLength={500} defaultValue={current?.description ?? ''} />
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
        onConfirm={() => toDelete && remove.mutate(toDelete.id, { onSettled: () => setToDelete(null) })}
      />
    </>
  )
}
