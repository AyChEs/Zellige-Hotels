import { Suspense, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHotelList } from '../../api/hooks/useHotels'
import { EmptyState, ErrorNote } from '../../components/ui/Feedback'
import { Field, Input } from '../../components/ui/Field'
import { HotelCard, HotelCardSkeleton } from './HotelCard'
import { Lineas } from '../../components/brand/Lineas'
import { useMenosMovimiento, useNavegadorLibre } from '../../motion/preferencias'
import { MovimientoLista } from '../../motion/perezoso'

export default function HotelsPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const raiz = useRef<HTMLDivElement>(null)
  const quieto = useMenosMovimiento()
  const libre = useNavegadorLibre()

  const { data, isPending, error, refetch } = useHotelList({
    active: true,
    search: search || undefined,
    city: city || undefined,
    size: 24,
  })

  return (
    <div ref={raiz} className="revelar mx-auto max-w-6xl px-4 py-bloque">
      <h1 className="font-display text-[clamp(2.25rem,6vw,5rem)] leading-[1.02] text-tinta-900">
        <Lineas lineas={[t('public.hotels.title')]} entrada />
      </h1>

      <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-6 grid gap-4 sm:max-w-2xl sm:grid-cols-2">
        <Field id="hotels-search" label={t('public.hotels.searchLabel')}>
          <Input
            type="search"
            placeholder={t('public.hotels.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Field>
        <Field id="hotels-city" label={t('public.hotels.cityLabel')}>
          <Input
            type="search"
            placeholder={t('public.hotels.cityPlaceholder')}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Field>
      </form>

      <p aria-live="polite" className="mt-6 mb-4 text-sm text-tinta-600">
        {data ? t('public.hotels.count', { count: data.totalElements }) : ''}
      </p>

      {error ? (
        <ErrorNote error={error} onRetry={() => refetch()} />
      ) : isPending ? (
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <HotelCardSkeleton key={i} />
          ))}
        </div>
      ) : data.content.length === 0 ? (
        <EmptyState title={t('public.hotels.emptyTitle')} hint={t('public.hotels.emptyHint')} />
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {data.content.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} headingLevel="h2" />
          ))}
        </div>
      )}

      {!quieto && libre && (
        <Suspense fallback={null}>
          <MovimientoLista raiz={raiz} listo={!!data} />
        </Suspense>
      )}
    </div>
  )
}
