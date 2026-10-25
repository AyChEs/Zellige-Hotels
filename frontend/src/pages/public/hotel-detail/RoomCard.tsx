import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { RoomDto } from '../../../api/types'
import { money } from '../../../lib/format'
import { useLabels } from '../../../lib/labels'
import { Card } from '../../../components/ui/Card'
import type { Stay } from './types'

interface Props {
  room: RoomDto
  stay: Stay
  total: number
  action: ReactNode
  className?: string
}

export function RoomCard({ room, stay, total, action, className = '' }: Props) {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  const name = t('booking.roomLabel', { type: tLabel('roomType', room.type), number: room.number })
  return (
    <Card as="article" className={`tarjeta-viva group grid overflow-hidden sm:grid-cols-[16rem_1fr] ${className}`}>
      <div className="aspect-[3/2] overflow-hidden bg-cal-100 sm:aspect-auto">
        {room.imageUrl && (
          <img src={room.imageUrl} alt="" width={480} height={320} loading="lazy" className="h-full w-full object-cover transition-transform duration-[900ms] ease-(--ease-sereno) group-hover:scale-[1.04]" />
        )}
      </div>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-tinta-900">{name}</h3>
          <p className="mt-1 text-sm text-tinta-600">
            {t('public.hotelDetail.capacity', { count: room.capacity })}
            {room.floor != null && ` · ${t('public.hotelDetail.floor', { n: room.floor })}`}
          </p>
          {room.description && <p className="mt-2 text-sm text-tinta-600">{room.description}</p>}
          <p className="cifras mt-2 text-sm text-tinta-600">
            {money(room.pricePerNight)}
            {t('public.hotelDetail.perNight')}
            {stay.board === 'HALF_BOARD' &&
              ` · ${t('public.hotelDetail.halfBoardSupplement', { price: money(room.halfBoardSupplement) })}`}
            {stay.board === 'FULL_BOARD' &&
              ` · ${t('public.hotelDetail.fullBoardSupplement', { price: money(room.fullBoardSupplement) })}`}
          </p>
        </div>
        <div className="flex shrink-0 items-end justify-between gap-4 sm:flex-col sm:items-end">
          <div className="sm:text-right">
            <p className="cifras text-xl font-semibold text-tinta-900">{money(total)}</p>
            <p className="text-xs text-tinta-600">{t('public.hotelDetail.total')}</p>
          </div>
          {action}
        </div>
      </div>
    </Card>
  )
}
