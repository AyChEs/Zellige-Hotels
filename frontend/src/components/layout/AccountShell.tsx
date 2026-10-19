import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const tab = ({ isActive }: { isActive: boolean }) =>
  `rounded-(--radius-control) px-4 py-2 text-sm font-medium transition-colors duration-150 ${
    isActive ? 'bg-fez-700 text-white' : 'text-tinta-600 hover:bg-fez-50'
  }`

/** Client area: rendered inside PublicShell; adds heading + tabbed sub-nav. */
export function AccountShell() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
      <h1 className="font-display mb-1 text-2xl text-tinta-900">{t('public.nav.myAccount')}</h1>
      <div className="separador mb-6 max-w-55 text-sm">◆</div>
      <nav aria-label={t('public.nav.myAccount')} className="mb-6 flex flex-wrap gap-2">
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
      <Outlet />
    </div>
  )
}
