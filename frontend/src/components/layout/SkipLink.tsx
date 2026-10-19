import { useTranslation } from 'react-i18next'

/** First focusable element of every layout: jumps over the navigation to <main id="contenido">. */
export function SkipLink() {
  const { t } = useTranslation()
  return (
    <a
      href="#contenido"
      onClick={(e) => {
        e.preventDefault()
        document.getElementById('contenido')?.focus()
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-(--radius-control) focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-fez-700 focus:shadow-(--shadow-card)"
    >
      {t('common.skipToContent')}
    </a>
  )
}
