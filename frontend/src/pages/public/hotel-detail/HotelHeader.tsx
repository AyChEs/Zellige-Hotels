import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { HotelDto } from '../../../api/types'
import { Lineas } from '../../../components/brand/Lineas'
import { FotoHotel } from '../../../components/ui/Foto'

/**
 * Cabecera de la ficha: nombre grande y una galería con la foto del hotel en arco y hasta
 * dos fotos de sus habitaciones. Cada foto va en su marco (`.galeria-foto`) para que el
 * paralaje mueva la imagen por dentro sin cambiar el diseño.
 */
export function HotelHeader({ hotel, fotosHabitaciones = [] }: { hotel: HotelDto | undefined; fotosHabitaciones?: string[] }) {
  const { t } = useTranslation()
  const extra = fotosHabitaciones.slice(0, 2)
  return (
    <header className="bg-cal-50">
      <div className="mx-auto max-w-6xl px-4 pt-bloque">
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
        <h1 className="font-display mt-4 text-[clamp(2.25rem,6vw,5rem)] leading-[1.02] text-tinta-900">
          {hotel ? <Lineas lineas={[hotel.name]} entrada /> : t('public.hotelDetail.loading')}
        </h1>
        {hotel && (
          <p className="mt-3 text-tinta-600">
            {t('public.hotelDetail.stars', { count: hotel.category.starRating })} · {hotel.address}, {hotel.city},{' '}
            {hotel.country}
          </p>
        )}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12">
          <figure className="galeria-foto col-span-2 aspect-[4/3] overflow-hidden rounded-[999px_999px_var(--radius-card)_var(--radius-card)] bg-cal-100 sm:aspect-[16/10] lg:col-span-7 lg:row-span-2 lg:aspect-auto lg:min-h-[32rem]">
            <FotoHotel
              hotel={hotel}
              alt={t('public.hotelDetail.photoAlt', { name: hotel?.name })}
              sizes="(min-width: 1024px) 44rem, 100vw"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </figure>
          {extra.map((src) => (
            <figure key={src} className="galeria-foto aspect-[4/3] overflow-hidden rounded-(--radius-card) bg-cal-100 lg:col-span-5 lg:aspect-auto">
              <img src={src} alt="" width={800} height={600} loading="lazy" className="h-full w-full object-cover" />
            </figure>
          ))}
        </div>
        {hotel?.description && <p className="mt-8 max-w-prose text-lg text-tinta-600">{hotel.description}</p>}
      </div>
    </header>
  )
}
