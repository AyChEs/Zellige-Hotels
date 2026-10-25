import { useTranslation } from 'react-i18next'
import type { HotelDto } from '../../api/types'
import { ButtonLink } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { loadHotelDetail } from './loadHotelDetail'
import { FotoHotel } from '../../components/ui/Foto'

/** One hotel: photo 3:2, name, city and stars, and the way into its availability. */
export function HotelCard({ hotel, headingLevel: H = 'h3' }: { hotel: HotelDto; headingLevel?: 'h2' | 'h3' }) {
  const { t } = useTranslation()
  return (
    <Card as="article" className="revela tarjeta-viva group flex flex-col overflow-hidden">
      <div className="aspect-[3/2] overflow-hidden bg-cal-100">
        <FotoHotel
          hotel={hotel}
          alt=""
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-(--ease-sereno) group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <H className="font-display text-2xl text-tinta-900">{hotel.name}</H>
        <p className="mt-1 text-sm text-tinta-600">
          {hotel.city}, {hotel.country} · {t('public.hotelDetail.stars', { count: hotel.category.starRating })}
        </p>
        {hotel.description && <p className="mt-3 line-clamp-2 text-sm text-tinta-600">{hotel.description}</p>}
        <div className="mt-auto pt-5">
          <ButtonLink
            to={`/hotels/${hotel.id}`}
            // Start loading the hotel page as soon as the guest shows intent.
            onPointerEnter={loadHotelDetail}
            onFocus={loadHotelDetail}
            variant="secondary"
            aria-label={`${t('public.hotels.viewAvailability')}: ${hotel.name}`}
          >
            {t('public.hotels.viewAvailability')}
          </ButtonLink>
        </div>
      </div>
    </Card>
  )
}

export function HotelCardSkeleton() {
  return (
    <div aria-hidden className="overflow-hidden rounded-(--radius-card) border border-cal-200 bg-white">
      <div className="skeleton aspect-[3/2] rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-7 w-2/3" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-11 w-44" />
      </div>
    </div>
  )
}
