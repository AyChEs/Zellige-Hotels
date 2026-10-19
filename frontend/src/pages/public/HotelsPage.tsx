import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { hotelApi } from '../../api/endpoints'
import { EmptyState, ErrorNote } from '../../components/ui/Feedback'
import { Field, Input } from '../../components/ui/Field'
import { HotelCard, HotelCardSkeleton } from './HotelCard'

export default function HotelsPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ['hotels', 'list', search, city],
    queryFn: () =>
      hotelApi.search({
        active: true,
        search: search || undefined,
        city: city || undefined,
        size: 24,
      }),
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
      <h1 className="font-display text-2xl text-tinta-900 sm:text-4xl">{t('public.hotels.title')}</h1>

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
    </div>
  )
}
