import { useTranslation } from 'react-i18next'

/**
 * Small ES / EN toggle. Two compact buttons so it fits in the public header, the mobile
 * drawer and the staff sidebar.
 */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { t, i18n } = useTranslation()
  const current = (i18n.resolvedLanguage || i18n.language || 'es').slice(0, 2)

  const set = (lng: 'es' | 'en') => {
    if (current === lng) return
    i18n.changeLanguage(lng)
  }

  const button = (lng: 'es' | 'en', label: string) => (
    <button
      type="button"
      lang={lng}
      onClick={() => set(lng)}
      aria-pressed={current === lng}
      className={`inline-flex min-h-8 min-w-10 items-center justify-center rounded-(--radius-pill) px-3 text-xs font-semibold transition-colors duration-150 ${
        current === lng ? 'bg-noche-900 text-noche-ink' : 'text-tinta-600 hover:text-tinta-900'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-(--radius-pill) border border-cal-200 bg-cal-50 p-1 ${className}`}
      role="group"
      aria-label={t('common.language')}
    >
      {button('es', 'ES')}
      {button('en', 'EN')}
    </div>
  )
}
