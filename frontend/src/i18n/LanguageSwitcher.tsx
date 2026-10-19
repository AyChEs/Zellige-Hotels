import { useTranslation } from 'react-i18next';

/**
 * Small ES / EN toggle. Renders as two compact text buttons so it fits
 * in either the public nav or the admin sidebar without taking much room.
 */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage || i18n.language || 'es').slice(0, 2);

  const set = (lng: 'es' | 'en') => {
    if (current === lng) return;
    i18n.changeLanguage(lng);
  };

  return (
    <div
      className={`flex items-center gap-1 rounded-full border border-cal-200 bg-cal-50 p-1 text-[11px] font-semibold ${className}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => set('es')}
        aria-pressed={current === 'es'}
        className={
          'rounded-full px-3 py-1 transition-colors ' +
          (current === 'es'
            ? 'bg-noche-900 text-noche-ink'
            : 'text-tinta-600 hover:text-tinta-900')
        }
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => set('en')}
        aria-pressed={current === 'en'}
        className={
          'rounded-full px-3 py-1 transition-colors ' +
          (current === 'en'
            ? 'bg-noche-900 text-noche-ink'
            : 'text-tinta-600 hover:text-tinta-900')
        }
      >
        EN
      </button>
    </div>
  );
}
