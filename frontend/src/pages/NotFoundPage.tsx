import { useTranslation } from 'react-i18next'
import { ButtonLink } from '../components/ui/Button'

export default function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <div className="reticula flex min-h-[50vh] items-center justify-center px-4 py-seccion">
      <div className="max-w-md text-center">
        <p className="cifras text-sm font-semibold text-granate-700">404</p>
        <h1 className="font-display mt-2 text-2xl text-tinta-900 sm:text-4xl">{t('errors.notFoundTitle')}</h1>
        <p className="mt-3 text-tinta-600">{t('errors.notFoundBody')}</p>
        <ButtonLink to="/" className="mt-6">
          {t('errors.backHome')}
        </ButtonLink>
      </div>
    </div>
  )
}
