import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { HotelDto } from '../../../api/types'

export function HotelHeader({ hotel }: { hotel: HotelDto | undefined }) {
  const { t } = useTranslation()
  return (
    <header className="bg-cal-50">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:pt-12">
        <nav aria-label={t('public.hotelDetail.breadcrumbLabel')}>
          <ol className="flex flex-wrap items-center gap-2 text-sm text-tinta-600">
            <li>
              <Link to="/hotels" className="font-semibold text-fez-700 underline underline-offset-2 hover:text-fez-800">
                {t('public.hotelDetail.breadcrumb')}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page">{hotel?.city ?? '…'}</li>
          </ol>
        </nav>
        <h1 className="font-display mt-3 text-2xl text-tinta-900 sm:text-4xl">
          {hotel?.name ?? t('public.hotelDetail.loading')}
        </h1>
        {hotel && (
          <p className="mt-2 text-tinta-600">
            {t('public.hotelDetail.stars', { count: hotel.category.starRating })} · {hotel.address}, {hotel.city},{' '}
            {hotel.country}
          </p>
        )}
        <div className="mt-6 aspect-[4/3] overflow-hidden rounded-(--radius-card) bg-cal-100 sm:aspect-[21/9]">
          {hotel?.imageUrl && (
            <img
              src={hotel.imageUrl}
              alt={t('public.hotelDetail.photoAlt', { name: hotel.name })}
              width={1200}
              height={514}
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          )}
        </div>
        {hotel?.description && <p className="mt-6 max-w-prose text-lg text-tinta-600">{hotel.description}</p>}
      </div>
    </header>
  )
}
