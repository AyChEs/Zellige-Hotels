import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { hotelApi } from '../../api/endpoints'
import { plusDaysIso, todayIso } from '../../lib/format'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { DateRangeField } from '../../components/ui/DateRangeField'
import { Field, Input, Select } from '../../components/ui/Field'
import { HotelCard, HotelCardSkeleton } from './HotelCard'

export default function LandingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  const [checkIn, setCheckIn] = useState(plusDaysIso(7))
  const [checkOut, setCheckOut] = useState(plusDaysIso(10))
  const [guests, setGuests] = useState(2)
  const [hotelId, setHotelId] = useState<number | null>(null)

  const { data: hotels, isPending } = useQuery({
    queryKey: ['hotels', 'landing'],
    queryFn: () => hotelApi.search({ active: true, size: 3 }),
  })
  const first = hotels?.content[0]
  const chosen = hotelId ?? first?.id

  const search = (e: FormEvent) => {
    e.preventDefault()
    if (!chosen || checkOut <= checkIn) return
    navigate(`/hotels/${chosen}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)
  }

  // At most one 300 ms fade of the text block, and none with reduced motion.
  const fade = reduced ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }

  return (
    <>
      <section className="reticula border-b border-cal-200">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-20">
          <div className="lg:col-span-7">
            <motion.div {...fade}>
              <p className="text-sm font-semibold text-granate-700">{t('public.landing.kicker')}</p>
              <h1 className="font-display mt-3 text-[2.25rem] leading-[1.1] text-tinta-900 sm:text-6xl">
                {t('public.landing.title')}
              </h1>
              <p className="mt-5 max-w-prose text-lg text-tinta-600">{t('public.landing.subtitle')}</p>
            </motion.div>

            <Card as="section" variant="brand" aria-label={t('public.landing.search')} className="mt-8 p-4 sm:p-5">
              <form onSubmit={search} className="grid gap-4 sm:grid-cols-[1fr_7rem_auto] sm:items-end">
                <DateRangeField
                  className="sm:col-span-3"
                  checkIn={checkIn}
                  checkOut={checkOut}
                  min={todayIso()}
                  onChange={(a, b) => {
                    setCheckIn(a)
                    setCheckOut(b)
                  }}
                />
                <Field id="landing-hotel" label={t('public.landing.hotel')}>
                  <Select value={chosen ?? ''} onChange={(e) => setHotelId(Number(e.target.value))} disabled={!hotels}>
                    {hotels?.content.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field id="landing-guests" label={t('public.landing.guests')}>
                  <Input type="number" min={1} max={10} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
                </Field>
                <Button type="submit" disabled={!chosen} className="w-full sm:w-auto">
                  {t('public.landing.search')}
                </Button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-5">
            {first?.imageUrl ? (
              <img
                src={first.imageUrl}
                alt={t('public.landing.heroAlt', { name: first.name, city: first.city })}
                width={900}
                height={1125}
                fetchPriority="high"
                className="aspect-[4/3] w-full rounded-[999px_999px_10px_10px] object-cover lg:aspect-[4/5]"
              />
            ) : (
              <div aria-hidden className="aspect-[4/3] w-full rounded-[999px_999px_10px_10px] bg-cal-100 lg:aspect-[4/5]" />
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-2xl text-tinta-900 sm:text-4xl">{t('public.landing.hotelsTitle')}</h2>
          <Link to="/hotels" className="text-sm font-semibold text-fez-700 underline underline-offset-4 hover:text-fez-800">
            {t('common.viewAll')}
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {isPending
            ? Array.from({ length: 3 }).map((_, i) => <HotelCardSkeleton key={i} />)
            : hotels?.content.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
        </div>
      </section>

      <section className="border-t border-cal-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-24 md:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="font-display text-2xl text-tinta-900">{t('public.landing.whyTitle')}</h2>
            <div className="separador mt-4 max-w-40 text-xs">
              <span aria-hidden>◆</span>
            </div>
          </div>
          <dl className="grid gap-8 sm:grid-cols-3">
            {(['why1', 'why2', 'why3'] as const).map((k) => (
              <div key={k}>
                <dt className="font-semibold text-tinta-900">{t(`public.landing.${k}Title`)}</dt>
                <dd className="mt-2 text-sm text-tinta-600">{t(`public.landing.${k}Body`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
