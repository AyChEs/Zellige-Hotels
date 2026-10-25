import { useHotelOptions } from '../../api/hooks/useHotels'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { RoomDto, RoomStatus, RoomType } from '../../api/types'
import { Button } from '../../components/ui/Button'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Field, Input, Select, Textarea } from '../../components/ui/Field'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { RoomBadge } from '../../components/ui/StatusBadge'
import { ErrorNote } from '../../components/ui/Feedback'
import { useRemoveRoom, useSaveRoom, useRoomList } from '../../api/hooks/useRooms'
import { problemMessage } from '../../api/client'
import { useToast } from '../../components/ui/toast-context'
import { money } from '../../lib/format'
import { useLabels } from '../../lib/labels'

export default function RoomsAdminPage() {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  const [page, setPage] = useState(0)
  const [hotelFilter, setHotelFilter] = useState<number | ''>('')
  const [editing, setEditing] = useState<RoomDto | null | 'new'>(null)

  const hotels = useHotelOptions()
  const { data, isPending, isFetching, error, refetch } = useRoomList({ page, hotelId: hotelFilter || undefined })
  const toast = useToast()
  const save = useSaveRoom(() => {
    setEditing(null)
    toast.success(t('common.savedToast'))
  })
  const remove = useRemoveRoom()
  const [toDelete, setToDelete] = useState<{ id: number; title: string } | null>(null)

  const current = editing === 'new' ? null : editing

  const columns: Column<RoomDto>[] = [
    {
      header: t('admin.rooms.title'),
      cell: (r) => (
        <div>
          <p className="font-medium text-tinta-900">{r.number}</p>
          <p className="text-xs text-tinta-600">{r.hotelName}{r.floor != null && ` · ${t('admin.rooms.floorValue', { n: r.floor })}`}</p>
        </div>
      ),
    },
    { header: t('admin.rooms.type'), cell: (r) => tLabel('roomType', r.type) },
    { header: t('admin.rooms.capacity'), cell: (r) => t('admin.rooms.capacityValue', { n: r.capacity }) },
    { header: t('admin.rooms.status'), cell: (r) => <RoomBadge status={r.status} /> },
    { header: t('admin.rooms.pricePerNight'), align: 'right', cell: (r) => <span className="font-medium">{money(r.pricePerNight)}</span> },
    {
      header: t('common.actions'),
      align: 'right',
      cell: (r) => (
        <div className="flex justify-end gap-1.5">
          <Button variant="secondary" size="sm" onClick={() => setEditing(r)}>{t('common.edit')}</Button>
          <Button variant="secondary" size="sm" onClick={() => setToDelete({ id: r.id, title: t('admin.rooms.deleteConfirm', { n: r.number }) })}>
              {t('common.delete')}
            </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title={t('admin.rooms.title')}
        subtitle={t('admin.rooms.subtitle')}
        actions={<Button onClick={() => setEditing('new')}>{t('admin.rooms.new')}</Button>}
      />

      <div className="mb-4 max-w-xs">
        <Field id="rooms-filter" label={t('admin.rooms.filterByHotel')}>
          <Select
            value={hotelFilter}
            onChange={(e) => {
              setHotelFilter(e.target.value === '' ? '' : Number(e.target.value))
              setPage(0)
            }}
          >
            <option value="">{t('admin.rooms.allHotels')}</option>
            {hotels.data?.content.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <DataTable
        caption={t('admin.rooms.caption')}
        columns={columns} data={data} isPending={isPending} isFetching={isFetching && !isPending} error={error}
        onRetry={() => refetch()}
        page={page} onPageChange={setPage}
        emptyTitle={t('admin.rooms.emptyTitle')} rowKey={(r) => r.id}
      />

      <Modal
        open={editing !== null}
        title={current ? t('admin.rooms.edit', { n: current.number }) : t('admin.rooms.create')}
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
                number: f.get('number'),
                floor: f.get('floor') ? Number(f.get('floor')) : null,
                type: f.get('type') as RoomType,
                status: f.get('status') as RoomStatus,
                capacity: Number(f.get('capacity')),
                description: f.get('description') || null,
                imageUrl: f.get('imageUrl') || null,
                pricePerNight: Number(f.get('pricePerNight')),
                halfBoardSupplement: Number(f.get('halfBoardSupplement')),
                fullBoardSupplement: Number(f.get('fullBoardSupplement')),
                hotelId: Number(f.get('hotelId')),
              },
            })
          }}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <Field id="r-hotel" label={t('booking.hotel')}>
              <Select name="hotelId" required defaultValue={current?.hotelId}>
                {hotels.data?.content.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </Select>
            </Field>
            <Field id="r-number" label={t('admin.rooms.number')}>
              <Input name="number" required maxLength={20} defaultValue={current?.number} />
            </Field>
            <Field id="r-floor" label={t('admin.rooms.floor')}>
              <Input name="floor" type="number" defaultValue={current?.floor ?? ''} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field id="r-type" label={t('admin.rooms.type')}>
              <Select name="type" defaultValue={current?.type ?? 'DOUBLE'}>
                {(['SINGLE','DOUBLE','TRIPLE','SUITE'] as RoomType[]).map((v) => (
                  <option key={v} value={v}>{tLabel('roomType', v)}</option>
                ))}
              </Select>
            </Field>
            <Field id="r-status" label={t('admin.rooms.status')}>
              <Select name="status" defaultValue={current?.status ?? 'AVAILABLE'}>
                {(['AVAILABLE','OCCUPIED','CLEANING','MAINTENANCE','OUT_OF_SERVICE'] as RoomStatus[]).map((v) => (
                  <option key={v} value={v}>{tLabel('roomStatus', v)}</option>
                ))}
              </Select>
            </Field>
            <Field id="r-cap" label={t('admin.rooms.capacity')}>
              <Input name="capacity" type="number" min={1} max={10} required defaultValue={current?.capacity ?? 2} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field id="r-price" label={t('admin.rooms.pricePerNightField')}>
              <Input name="pricePerNight" type="number" step="0.01" min={0} required defaultValue={current?.pricePerNight} />
            </Field>
            <Field id="r-half" label={t('admin.rooms.halfBoard')}>
              <Input name="halfBoardSupplement" type="number" step="0.01" min={0} required defaultValue={current?.halfBoardSupplement ?? 0} />
            </Field>
            <Field id="r-full" label={t('admin.rooms.fullBoard')}>
              <Input name="fullBoardSupplement" type="number" step="0.01" min={0} required defaultValue={current?.fullBoardSupplement ?? 0} />
            </Field>
          </div>
          <Field id="r-img" label={t('admin.hotels.imageUrl')}>
            <Input name="imageUrl" type="url" maxLength={500} defaultValue={current?.imageUrl ?? ''} />
          </Field>
          <Field id="r-desc" label={t('admin.rooms.description')}>
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
