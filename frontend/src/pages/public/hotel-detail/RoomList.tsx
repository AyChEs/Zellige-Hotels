import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { RoomDto } from '../../../api/types'
import { useAuth } from '../../../auth/AuthContext'
import { nights } from '../../../lib/format'
import { roomTotal } from '../../../lib/pricing'
import { Button, ButtonLink } from '../../../components/ui/Button'
import { useLabels } from '../../../lib/labels'
import { RoomCard } from './RoomCard'
import type { Stay } from './types'

interface Props {
  rooms: RoomDto[]
  stay: Stay
  onChoose: (room: RoomDto) => void
}

export function RoomList({ rooms, stay, onChoose }: Props) {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  const { user } = useAuth()
  const location = useLocation()
  const nightCount = nights(stay.checkIn, stay.checkOut)

  return (
    <div className="space-y-4">
      {rooms.map((room) => {
        const label = t('booking.roomLabel', { type: tLabel('roomType', room.type), number: room.number })
        const action =
          user?.role === 'CLIENT' ? (
            <Button onClick={() => onChoose(room)} aria-label={`${t('booking.choose')}: ${label}`}>
              {t('booking.choose')}
            </Button>
          ) : user ? (
            <p className="max-w-48 text-sm text-tinta-600">{t('public.hotelDetail.clientOnly')}</p>
          ) : (
            <ButtonLink to="/login" state={{ from: location.pathname + location.search }} variant="secondary">
              {t('booking.loginToBook')}
            </ButtonLink>
          )
        return (
          <RoomCard
            key={room.id}
            room={room}
            stay={stay}
            total={roomTotal(room, stay.board, stay.guests, nightCount)}
            action={action}
          />
        )
      })}
    </div>
  )
}
