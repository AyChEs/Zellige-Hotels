import { Link, useNavigate } from 'react-router-dom'
import { Suspense, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { HotelDto } from '../../api/types'
import { useHotelList } from '../../api/hooks/useHotels'
import { plusDaysIso, todayIso } from '../../lib/format'
import { Button, ButtonLink, buttonClasses } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { DateRangeField } from '../../components/ui/DateRangeField'
import { Field, Input, Select } from '../../components/ui/Field'
import { Lineas } from '../../components/brand/Lineas'
import { useMenosMovimiento, useNavegadorLibre } from '../../motion/preferencias'
import { MovimientoPortada } from '../../motion/perezoso'
import { loadHotelDetail } from './loadHotelDetail'
import { Foto, FotoHotel } from '../../components/ui/Foto'
import { FOTO_PORTADA, FOTO_TEXTURA } from '../../lib/fotos'
import { PiezaRive } from '../../rive/PiezaRive'
import type { PiezaId } from '../../rive/piezas'

/*
 * Portada como narración por scroll (sesión 11, docs/MARCA.md §9). El HTML es el estado
 * final y se lee entero sin JavaScript ni movimiento; MovimientoPortada (carga perezosa,
 * solo sin prefers-reduced-motion) añade el arco que se abre, los titulares por líneas,
 * la cinta, el carrusel fijado, la historia por pasos y el paralaje.
 */

/** Arco de herradura en una caja de 100 × 125, abierto como ventana; el exterior lo tapa la cal. */
const HUECO = 'M0 125V81.2A56 56 0 1 1 100 81.2V125Z'
const EXTERIOR = 'M-1500-1500H1600V1600H-1500Z'

export default function LandingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const raiz = useRef<HTMLDivElement>(null)
  const quieto = useMenosMovimiento()
  const libre = useNavegadorLibre()
  const [checkIn, setCheckIn] = useState(plusDaysIso(7))
  const [checkOut, setCheckOut] = useState(plusDaysIso(10))
  const [guests, setGuests] = useState(2)
  const [hotelId, setHotelId] = useState<number | null>(null)

  const { data: hotels, isPending } = useHotelList({ active: true, size: 3 })
  const lista = hotels?.content ?? []
  const first = lista[0]
  const chosen = hotelId ?? first?.id

  const search = (e: FormEvent) => {
    e.preventDefault()
    if (!chosen || checkOut <= checkIn) return
    navigate(`/hotels/${chosen}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)
  }

  const facts = [
    t('public.landing.factHotels', { count: hotels?.totalElements ?? 3 }),
    ...(lista.length ? lista.map((h) => h.city) : ['Granada', 'Marrakech', 'Barcelona']),
    ...(t('public.landing.facts', { returnObjects: true }) as string[]),
  ]

  return (
    <div ref={raiz} className="portada">
      {/* 1 · El umbral: foto a sangre tapada por la cal, con un arco de herradura como ventana. */}
      <section data-escena="umbral" className="relative isolate overflow-hidden bg-cal-100">
        <Foto
          foto={FOTO_PORTADA}
          sizes="100vw"
          alt={t('public.landing.heroAlt')}
          fetchPriority="high"
          className="umbral-foto absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="mx-auto grid min-h-[min(calc(100svh-4rem),46rem)] max-w-6xl grid-rows-[auto_1fr] items-center gap-8 px-4 pt-8 pb-8 lg:grid-cols-12 lg:grid-rows-1 lg:gap-12 lg:py-10">
          <div className="umbral-texto relative z-20 lg:col-span-7">
            <h1 className="font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.98] tracking-[-0.01em] text-tinta-900">
              <Lineas lineas={t('public.landing.titleLines', { returnObjects: true }) as string[]} entrada />
            </h1>
            <p className="aparecer-tarde mt-6 max-w-[34rem] text-lg text-tinta-600">{t('public.landing.subtitle')}</p>
            <div className="aparecer-tarde mt-8 flex flex-wrap gap-3">
              <span data-magnetico className="inline-flex">
                <a href="#buscar" className={buttonClasses('primary', 'md', 'px-6')}>
                  {t('public.landing.ctaSearch')}
                </a>
              </span>
              <ButtonLink to="/hotels" variant="secondary" className="px-6">
                {t('public.landing.closingCta')}
              </ButtonLink>
            </div>
          </div>

          <div className="relative z-10 mx-auto w-[62%] max-w-[17rem] self-center sm:max-w-xs lg:col-span-5 lg:w-full lg:max-w-md">
            <div className="relative aspect-[4/5]">
              <svg
                viewBox="0 0 100 125"
                className="umbral-marco absolute inset-0 h-full w-full overflow-visible"
                aria-hidden
                focusable="false"
              >
                <defs>
                  <pattern id="umbral-reticula" width="9.6" height="9.6" patternUnits="userSpaceOnUse">
                    <path d="M4.8 0 9.6 4.8 4.8 9.6 0 4.8Z" fill="none" stroke="#1E5B46" strokeOpacity=".07" strokeWidth=".2" />
                  </pattern>
                </defs>
                <path d={`${EXTERIOR}${HUECO}`} fill="#FAF8F4" fillOpacity=".9" fillRule="evenodd" />
                <path d={`${EXTERIOR}${HUECO}`} fill="url(#umbral-reticula)" fillRule="evenodd" />
                <path d={HUECO} fill="none" stroke="#8B2E3C" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </div>
        </div>
        <p aria-hidden className="umbral-pie pointer-events-none absolute bottom-8 left-4 z-20 opacity-0 sm:left-8">
          <span className="block rounded-(--radius-card) bg-noche-900/90 px-5 py-4 text-noche-ink">
            <span className="font-display block text-2xl sm:text-4xl">Zellige Hotels</span>
            <span className="mt-1 block text-sm text-fez-200">
              {(lista.length ? lista.map((h) => h.city) : ['Granada', 'Marrakech', 'Barcelona']).join(' · ')}
            </span>
          </span>
        </p>
      </section>

      {/* 2 · Búsqueda: la función de la portada, nada más pasar el umbral. */}
      <section id="buscar" aria-labelledby="buscar-titulo" className="relative z-10 scroll-mt-24 px-4 pt-bloque">
        <div className="mx-auto max-w-6xl">
          <h2 id="buscar-titulo" className="font-display text-2xl text-tinta-900 sm:text-4xl">
            {t('public.landing.searchTitle')}
          </h2>
          <Card as="div" variant="brand" className="mt-6 p-4 sm:p-6">
            <form onSubmit={search} className="grid gap-4 md:grid-cols-[2fr_1fr_7rem_auto] md:items-end">
              <DateRangeField
                className="md:col-span-1"
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
                  {lista.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field id="landing-guests" label={t('public.landing.guests')}>
                <Input type="number" min={1} max={10} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
              </Field>
              <span data-magnetico className="flex md:inline-flex">
                <Button type="submit" disabled={!chosen} className="w-full px-6 md:w-auto">
                  {t('public.landing.search')}
                </Button>
              </span>
            </form>
          </Card>
        </div>
      </section>

      {/* 3 · Cinta con datos del producto: se desplaza solo al hacer scroll. */}
      <section aria-label={t('public.landing.factsLabel')} data-escena="cinta" className="mt-seccion overflow-hidden bg-fez-700 py-4 text-white">
        <ul className="sr-only">
          {facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <div aria-hidden className="cinta-pista flex w-max gap-10 whitespace-nowrap">
          {[0, 1, 2].map((copia) => (
            <span key={copia} className="flex gap-10">
              {facts.map((f) => (
                <span key={f} className="font-display flex items-center gap-10 text-xl uppercase tracking-[0.12em] sm:text-2xl">
                  {f}
                  <span className="size-2 rotate-45 bg-fez-200" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* 4 · Los tres hoteles: carrusel horizontal fijado; sin movimiento, una rejilla. */}
      <section aria-labelledby="casas-titulo" data-escena="carrusel" className="carrusel overflow-hidden py-seccion">
        <div className="carrusel-pista mx-auto flex max-w-6xl flex-col gap-6 px-4">
          <div className="carrusel-intro flex shrink-0 flex-col justify-end">
            <h2 id="casas-titulo" className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] text-tinta-900">
              <Lineas lineas={t('public.landing.hotelsLines', { returnObjects: true }) as string[]} />
            </h2>
            <p className="mt-4 max-w-sm text-lg text-tinta-600">{t('public.landing.hotelsBody')}</p>
            <Link
              to="/hotels"
              className="mt-6 inline-flex min-h-11 items-center self-start text-sm font-semibold text-fez-700 underline underline-offset-4 hover:text-fez-800"
            >
              {t('common.viewAll')}
            </Link>
          </div>
          <div className="carrusel-tarjetas grid gap-6 md:grid-cols-3">
            {isPending
              ? Array.from({ length: 3 }).map((_, i) => <div key={i} aria-hidden className="skeleton aspect-[4/5]" />)
              : lista.map((hotel, i) => <TarjetaCasa key={hotel.id} hotel={hotel} indice={i} />)}
          </div>
        </div>
      </section>

      {/* 5 · Historia fijada: cómo funciona reservar, en cuatro pasos. */}
      <Historia />

      {/* 6 · «Zellige» gigante en contorno con fotos que cruzan por delante. */}
      <section aria-labelledby="cierre-titulo" data-escena="contorno" className="relative isolate overflow-hidden py-seccion">
        <div className="contorno-zona">
          <p aria-hidden className="contorno-texto font-display text-center uppercase leading-none tracking-[0.06em]">
            Zellige
          </p>
          {lista.map((h, i) => (
            <div
              key={h.id}
              data-velocidad={[-18, 26, -10][i]}
              className={`contorno-foto contorno-foto-${i} absolute aspect-[4/5] overflow-hidden shadow-(--shadow-card)`}
            >
              <FotoHotel
                hotel={h}
                alt=""
                sizes="(min-width: 1024px) 19vw, 24vw"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        <Foto
          foto={FOTO_TEXTURA}
          alt=""
          sizes="100vw"
          loading="lazy"
          className="contorno-textura pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="relative z-10 mx-auto mt-bloque max-w-6xl px-4 text-center">
          <h2 id="cierre-titulo" className="font-display mx-auto max-w-3xl text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.05] text-tinta-900">
            <Lineas lineas={t('public.landing.closingLines', { returnObjects: true }) as string[]} />
          </h2>
          <span data-magnetico className="mt-8 inline-flex">
            <ButtonLink to="/hotels" className="px-8">
              {t('public.landing.closingCta')}
            </ButtonLink>
          </span>
        </div>
      </section>

      {!quieto && libre && (
        <Suspense fallback={null}>
          <MovimientoPortada raiz={raiz} listo={!isPending} />
        </Suspense>
      )}
    </div>
  )
}

const INCLINACION = [-3, 2.5, -2]

function TarjetaCasa({ hotel, indice }: { hotel: HotelDto; indice: number }) {
  const { t } = useTranslation()
  return (
    <article
      className="carrusel-tarjeta tarjeta-viva group flex flex-col overflow-hidden rounded-(--radius-card) border border-cal-200 bg-white shadow-(--shadow-card)"
      data-inclinacion={INCLINACION[indice % 3]}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cal-100">
        <FotoHotel
          hotel={hotel}
          alt=""
          sizes="(min-width: 768px) 30rem, 80vw"
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-(--ease-sereno) group-hover:scale-[1.04]"
        />
        <span className="cifras absolute top-4 left-4 rounded-(--radius-pill) bg-white/90 px-3 py-1 text-xs font-semibold text-tinta-900">
          0{indice + 1}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-2xl text-tinta-900 sm:text-[2rem] sm:leading-tight">{hotel.name}</h3>
        <p className="mt-1 text-sm text-tinta-600">
          {hotel.city}, {hotel.country} · {t('public.hotelDetail.stars', { count: hotel.category.starRating })}
        </p>
        {hotel.description && <p className="mt-3 line-clamp-2 text-tinta-600">{hotel.description}</p>}
        <div className="mt-auto pt-6">
          <ButtonLink
            to={`/hotels/${hotel.id}`}
            onPointerEnter={loadHotelDetail}
            onFocus={loadHotelDetail}
            variant="secondary"
            aria-label={`${t('public.hotels.viewAvailability')}: ${hotel.name}`}
          >
            {t('public.hotels.viewAvailability')}
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}

/** Una ilustración de Rive por paso (rive/reservar). El texto de cada paso sigue siendo HTML. */
const PIEZAS: PiezaId[] = ['fechas', 'solapes', 'confirmacion', 'factura']

function Historia() {
  const { t } = useTranslation()
  const pasos = t('public.landing.steps', { returnObjects: true }) as { title: string; body: string }[]
  return (
    <section aria-labelledby="historia-titulo" data-escena="historia" className="historia arqueria mt-bloque bg-noche-900 text-noche-ink">
      <div className="historia-marco mx-auto max-w-6xl px-4 py-seccion">
        <h2 id="historia-titulo" className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02]">
          <Lineas lineas={t('public.landing.storyLines', { returnObjects: true }) as string[]} />
        </h2>
        <ol className="historia-pasos mt-8 grid gap-10">
          {pasos.map((p, i) => (
            <li key={p.title} className="paso grid items-center gap-8 md:grid-cols-2 md:gap-16">
              <div className="paso-texto">
                <p className="cifras text-sm font-semibold text-fez-200">
                  {t('public.landing.storyStep', { n: i + 1, total: pasos.length })}
                </p>
                <h3 className="font-display mt-3 text-3xl sm:text-4xl">{p.title}</h3>
                <p className="mt-4 max-w-md text-lg text-noche-muted">{p.body}</p>
              </div>
              <div aria-hidden className="paso-visual mx-auto w-full max-w-[30rem] md:max-w-none">
                <PiezaRive pieza={PIEZAS[i]} />
              </div>
            </li>
          ))}
        </ol>
        <div aria-hidden className="historia-progreso mt-10 hidden gap-2">
          {pasos.map((p) => (
            <span key={p.title} className="h-1 flex-1 overflow-hidden rounded-(--radius-pill) bg-noche-800">
              <span className="historia-barra block h-full origin-left scale-x-0 bg-fez-200" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
