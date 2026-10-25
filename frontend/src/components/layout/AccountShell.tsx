import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { ErrorBoundary } from '../ErrorBoundary'
import { useTranslation } from 'react-i18next'

const tab = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-11 items-center px-1 text-sm font-semibold transition-colors duration-150 ${
    isActive
      ? 'text-fez-700 underline decoration-2 underline-offset-8'
      : 'text-tinta-600 hover:text-tinta-900'
  }`

/** Client area: rendered inside PublicShell; adds the heading and plain links as sub-navigation. */
export function AccountShell() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <h1 className="font-display text-2xl text-tinta-900 sm:text-4xl print:hidden">{t('public.nav.myAccount')}</h1>
      <nav aria-label={t('public.nav.myAccount')} className="mt-4 mb-8 flex flex-wrap gap-6 border-b border-cal-200 print:hidden">
        <NavLink to="/account" end className={tab}>
          {t('account.nav.myBookings')}
        </NavLink>
        <NavLink to="/account/invoices" className={tab}>
          {t('account.nav.myInvoices')}
        </NavLink>
        <NavLink to="/account/profile" className={tab}>
          {t('account.nav.profile')}
        </NavLink>
      </nav>
      <ErrorBoundary resetKey={pathname} nested>
          <Outlet />
        </ErrorBoundary>
    </div>
  )
}
