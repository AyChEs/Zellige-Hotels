import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface Seccion {
  h: string
  p: string[]
  list?: string[]
  after?: string
}
interface Texto {
  title: string
  intro: string
  sections: Seccion[]
}

/** Aviso legal y política de privacidad: el texto vive en i18n (`legal.aviso` y `legal.privacidad`). */
export default function LegalPage({ tipo }: { tipo: 'aviso' | 'privacidad' }) {
  const { t } = useTranslation()
  const texto = t(`legal.${tipo}`, { returnObjects: true }) as Texto
  return (
    <div className="mx-auto max-w-3xl px-4 py-bloque">
      <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] text-tinta-900">{texto.title}</h1>
      <p className="mt-3 text-lg text-tinta-600">{texto.intro}</p>
      <p className="mt-1 text-sm text-tinta-600">{t('legal.updated')}</p>
      {texto.sections.map((s) => (
        <section key={s.h} className="mt-8">
          <h2 className="font-display text-2xl text-tinta-900">{s.h}</h2>
          {s.p.map((p) => (
            <p key={p} className="mt-2 text-tinta-900">
              {p}
            </p>
          ))}
          {s.list && (
            <ul className="mt-2 list-disc space-y-1 pl-6 text-tinta-900">
              {s.list.map((li) => (
                <li key={li}>{li}</li>
              ))}
            </ul>
          )}
          {s.after && <p className="mt-2 text-tinta-900">{s.after}</p>}
        </section>
      ))}
      <p className="mt-10">
        <Link to="/" className="font-semibold text-fez-700 underline underline-offset-4 hover:text-fez-800">
          {t('legal.back')}
        </Link>
      </p>
    </div>
  )
}
