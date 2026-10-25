import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Logotipo, SIMBOLO_D, Simbolo } from '../../components/brand/Marca'
import { contrast } from '../../lib/contrast'

/** /marca: the brand system of docs/MARCA.md, shown live. A portfolio piece as well. */

const COLORES = [
  { token: 'cal-50', hex: '#FAF8F4', rol: 'c_cal', fondo: 'bg-cal-50', texto: 'text-tinta-900', sobre: ['#1C211F', 'tinta-900'] },
  { token: 'tinta-900', hex: '#1C211F', rol: 'c_tinta', fondo: 'bg-tinta-900', texto: 'text-noche-ink', sobre: ['#FAF8F4', 'cal-50'] },
  { token: 'fez-700', hex: '#1E5B46', rol: 'c_fez', fondo: 'bg-fez-700', texto: 'text-white', sobre: ['#FAF8F4', 'cal-50'] },
  { token: 'noche-900', hex: '#18231F', rol: 'c_noche', fondo: 'bg-noche-900', texto: 'text-noche-ink', sobre: ['#EDEAE3', 'noche-ink'] },
  { token: 'granate-700', hex: '#8B2E3C', rol: 'c_granate', fondo: 'bg-granate-700', texto: 'text-white', sobre: ['#FAF8F4', 'cal-50'] },
  { token: 'fez-200', hex: '#9FCFB7', rol: 'c_fez200', fondo: 'bg-fez-200', texto: 'text-tinta-900', sobre: ['#18231F', 'noche-900'] },
] as const

function Seccion({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-cal-200 py-12 sm:py-16">
      <h2 id={id} className="font-display text-2xl text-tinta-900 sm:text-4xl">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  )
}

function Lamina({ children, className = '', label }: { children: ReactNode; className?: string; label?: ReactNode }) {
  return (
    <figure className="flex flex-col gap-3">
      <div className={`flex min-h-44 items-center justify-center rounded-(--radius-card) border border-cal-200 p-6 ${className}`}>
        {children}
      </div>
      {label && <figcaption className="text-sm text-tinta-600">{label}</figcaption>}
    </figure>
  )
}

/** The symbol on its 64-unit grid with the arch circle and the keystone axis. */
function Construccion({ label }: { label: string }) {
  const lineas = Array.from({ length: 9 }, (_, i) => i * 8)
  return (
    <svg viewBox="-8 -8 80 80" role="img" aria-label={label} className="w-full max-w-sm">
      <g stroke="#E3DDD3" strokeWidth="0.25">
        {lineas.map((n) => (
          <g key={n}>
            <line x1={n} y1={-4} x2={n} y2={68} />
            <line x1={-4} y1={n} x2={68} y2={n} />
          </g>
        ))}
      </g>
      <path d={SIMBOLO_D} fill="#1E5B46" fillOpacity="0.92" fillRule="evenodd" />
      <g fill="none" stroke="#8B2E3C" strokeWidth="0.4">
        <circle cx="32" cy="30" r="15" strokeDasharray="1.2 1" />
        <line x1="32" y1="-6" x2="32" y2="70" strokeDasharray="1.2 1" />
        <line x1="14" y1="30" x2="50" y2="30" strokeDasharray="1.2 1" />
        <rect x="0" y="0" width="64" height="64" rx="14" />
      </g>
      <circle cx="32" cy="30" r="0.9" fill="#8B2E3C" />
    </svg>
  )
}

function Curva({ d, label }: { d: string; label: string }) {
  return (
    <figure className="flex items-center gap-4">
      <svg viewBox="-4 -4 108 108" aria-hidden className="size-24 shrink-0 rounded-(--radius-control) bg-white">
        <path d="M0 100H100M0 100V0" stroke="#E3DDD3" strokeWidth="1" />
        <path d={d} fill="none" stroke="#1E5B46" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <figcaption className="text-sm text-tinta-600">{label}</figcaption>
    </figure>
  )
}

export default function BrandPage() {
  const { t } = useTranslation()
  const [movido, setMovido] = useState(false)

  const versiones = [
    { key: 'vHorizontal', file: 'logotipo-horizontal.svg', body: <Logotipo size="lg" />, bg: 'bg-white' },
    {
      key: 'vStacked',
      file: 'logotipo-apilado.svg',
      body: <img src="/identidad/logotipo-apilado.svg" alt="" width={190} height={120} className="h-32 w-auto" />,
      bg: 'bg-cal-50',
    },
    { key: 'vMono', file: 'logotipo-mono.svg', body: <Logotipo tono="tinta" size="lg" />, bg: 'bg-cal-100' },
    { key: 'vLight', file: 'logotipo-claro.svg', body: <Logotipo tono="claro" size="lg" />, bg: 'bg-noche-900 border-noche-900' },
  ] as const

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:pb-24">
      <header className="reticula -mx-4 px-4 py-12 sm:py-20">
        <h1 className="sr-only">{t('brand.title')}</h1>
        <Logotipo size="lg" />
        <p className="font-display mt-10 max-w-3xl text-2xl text-tinta-900 sm:text-4xl">{t('brand.intro')}</p>
        <p className="mt-5 max-w-prose text-lg text-tinta-600">{t('brand.intro2')}</p>
      </header>

      <Seccion id="marca-simbolo" title={t('brand.symbolTitle')}>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Construccion label={t('brand.symbolDiagram')} />
          <dl className="space-y-6">
            {(['tile', 'door', 'key'] as const).map((k) => (
              <div key={k} className="border-l-2 border-granate-700 pl-4">
                <dt className="font-semibold text-tinta-900">{t(`brand.${k}Title`)}</dt>
                <dd className="mt-1 text-tinta-600">{t(`brand.${k}Body`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Seccion>

      <Seccion id="marca-versiones" title={t('brand.versionsTitle')}>
        <div className="grid gap-6 md:grid-cols-2">
          {versiones.map((v) => (
            <Lamina
              key={v.key}
              className={v.bg}
              label={
                <span className="flex flex-wrap items-center justify-between gap-2">
                  {t(`brand.${v.key}`)}
                  <a
                    href={`/identidad/${v.file}`}
                    download
                    className="font-semibold text-fez-700 underline underline-offset-2 hover:text-fez-800"
                  >
                    {t('brand.download', { name: v.file })}
                  </a>
                </span>
              }
            >
              {v.body}
            </Lamina>
          ))}
          <Lamina className="bg-white md:col-span-2" label={t('brand.vFavicon')}>
            <div className="flex items-end gap-8 text-fez-700">
              <Simbolo size={64} />
              <Simbolo size={32} />
              <Simbolo size={16} />
            </div>
          </Lamina>
        </div>
      </Seccion>

      <Seccion id="marca-color" title={t('brand.colorTitle')}>
        <p className="mb-6 max-w-prose text-tinta-600">{t('brand.colorBody')}</p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COLORES.map((c) => (
            <li key={c.token} className="overflow-hidden rounded-(--radius-card) border border-cal-200 bg-white">
              <div className={`flex h-28 items-end p-4 ${c.fondo} ${c.texto}`}>
                <span className="font-display text-2xl">Aa</span>
              </div>
              <div className="p-4 text-sm">
                <p className="font-semibold text-tinta-900">
                  {c.token} <span className="cifras font-normal text-tinta-600">{c.hex}</span>
                </p>
                <p className="mt-1 text-tinta-600">{t(`brand.${c.rol}`)}</p>
                <p className="cifras mt-1 text-tinta-600">
                  {t('brand.contrastOn', { ratio: contrast(c.hex, c.sobre[0]).toLocaleString(), bg: c.sobre[1] })}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div aria-hidden className="mt-6 flex h-3 overflow-hidden rounded-(--radius-pill)">
          <span className="w-[60%] bg-cal-200" />
          <span className="w-[30%] bg-fez-700" />
          <span className="w-[10%] bg-granate-700" />
        </div>
      </Seccion>

      <Seccion id="marca-tipo" title={t('brand.typeTitle')}>
        <div className="grid gap-6 md:grid-cols-2">
          <Lamina className="flex-col items-start justify-end bg-white" label={t('brand.typeDisplay')}>
            <span className="font-display text-6xl leading-none text-tinta-900 uppercase tracking-[0.14em]">Zellige</span>
            <span className="font-display mt-4 text-2xl text-tinta-600">Aa Bb Cc 0123</span>
          </Lamina>
          <Lamina className="flex-col items-start justify-end bg-white" label={t('brand.typeText')}>
            <span className="text-4xl font-semibold text-tinta-900">Aa Bb Cc 0123</span>
            <span className="mt-4 text-lg text-tinta-600">{t('brand.typeSample')}</span>
          </Lamina>
        </div>
      </Seccion>

      <Seccion id="marca-motivo" title={t('brand.motifTitle')}>
        <div className="grid gap-6 md:grid-cols-3">
          <Lamina className="reticula bg-cal-50" label={t('brand.mGrid')}>
            <span />
          </Lamina>
          <Lamina className="bg-white" label={t('brand.mSeparator')}>
            <div className="separador w-full max-w-60 text-xs">
              <span aria-hidden>◆</span>
            </div>
          </Lamina>
          <Lamina className="items-end overflow-hidden bg-white p-0 pt-10" label={t('brand.mArcade')}>
            <div className="arqueria h-20 w-full bg-noche-900" />
          </Lamina>
        </div>
      </Seccion>

      <Seccion id="marca-movimiento" title={t('brand.motionTitle')}>
        <p className="mb-6 max-w-prose text-tinta-600">{t('brand.motionBody')}</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <Curva d="M0 100C22 0 36 0 100 0" label={t('brand.curveSereno')} />
            <Curva d="M0 100C65 100 35 0 100 0" label={t('brand.curveUmbral')} />
          </div>
          <div className="flex flex-col justify-center gap-4 rounded-(--radius-card) border border-cal-200 bg-white p-6">
            {(['var(--ease-sereno)', 'var(--ease-umbral)'] as const).map((ease) => (
              <div key={ease} className="relative h-6 rounded-(--radius-pill) bg-cal-100">
                <span aria-hidden className="absolute inset-y-0 right-6 left-3">
                  <span
                    className="flex h-full w-full items-center"
                    style={{
                      transform: `translateX(${movido ? '100%' : '0'})`,
                      transition: `transform var(--duracion-entrada) ${ease}`,
                    }}
                  >
                    <span className="size-3 rotate-45 bg-granate-700" />
                  </span>
                </span>
              </div>
            ))}
            <button
              type="button"
              aria-pressed={movido}
              onClick={() => setMovido((m) => !m)}
              className="mt-2 inline-flex min-h-11 items-center justify-center self-start rounded-(--radius-control) border border-cal-400 px-4 text-sm font-semibold text-tinta-900 transition-colors duration-150 hover:bg-cal-100"
            >
              {t('brand.motionTry')}
            </button>
          </div>
        </div>
      </Seccion>

      <Seccion id="marca-usos" title={t('brand.usageTitle')}>
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div>
            <h3 className="mb-4 font-semibold text-tinta-900">{t('brand.doTitle')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <Lamina className="min-h-32 bg-cal-50" label={t('brand.do1')}>
                <Simbolo size={48} className="text-fez-700" />
              </Lamina>
              <Lamina className="min-h-32 border-noche-900 bg-noche-900" label={t('brand.do2')}>
                <Simbolo size={48} className="text-noche-ink" />
              </Lamina>
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-tinta-900">{t('brand.dontTitle')}</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Lamina className="no-uso min-h-32 bg-white" label={t('brand.dont1')}>
                <Simbolo size={48} className="scale-x-150 text-fez-700" />
              </Lamina>
              <Lamina className="no-uso min-h-32 bg-white" label={t('brand.dont2')}>
                <Simbolo size={48} className="rotate-[20deg] text-fez-700" />
              </Lamina>
              <Lamina className="no-uso min-h-32 bg-white" label={t('brand.dont3')}>
                <Simbolo size={48} className="text-fez-700 drop-shadow-[0_6px_6px_rgb(0_0_0_/_0.45)]" />
              </Lamina>
              <Lamina className="no-uso min-h-32 bg-white" label={t('brand.dont4')}>
                <Simbolo size={48} className="text-info-ink" />
              </Lamina>
            </div>
          </div>
        </div>
      </Seccion>
    </div>
  )
}
