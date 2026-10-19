import { Link, NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../auth/AuthContext'
import { LanguageSwitcher } from '../../i18n/LanguageSwitcher'
import type { Role } from '../../api/types'
import { useLabels } from '../../lib/labels'

export function AdminShell() {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  const { user, logout, hasRole } = useAuth()
  const [open, setOpen] = useState(false)

  const items: { to: string; label: string; icon: string; roles?: Role[] }[] = [
    { to: '/admin', label: t('admin.nav.dashboard'), icon: '▦', roles: ['ADMIN', 'MANAGER'] },
    { to: '/admin/bookings', label: t('admin.nav.bookings'), icon: '◫' },
    { to: '/admin/calendar', label: t('admin.nav.calendar'), icon: '▤' },
    { to: '/admin/invoices', label: t('admin.nav.invoices'), icon: '▥' },
    { to: '/admin/clients', label: t('admin.nav.clients'), icon: '◧' },
    { to: '/admin/tasks', label: t('admin.nav.tasks'), icon: '◨' },
    { to: '/admin/hotels', label: t('admin.nav.hotels'), icon: '⬡', roles: ['ADMIN'] },
    { to: '/admin/rooms', label: t('admin.nav.rooms'), icon: '⬢', roles: ['ADMIN', 'MANAGER'] },
    { to: '/admin/categories', label: t('admin.nav.categories'), icon: '✦', roles: ['ADMIN'] },
    { to: '/admin/employees', label: t('admin.nav.employees'), icon: '◩', roles: ['ADMIN', 'MANAGER'] },
  ]

  const close = () => setOpen(false)

  const sidebarInner = (
    <>
      <Link to="/" className="block px-5 py-5 font-display text-lg text-noche-ink" onClick={close}>
        <span className="text-noche-muted">◆</span> Zellige ERP
      </Link>
      <div className="mx-5 mb-4 h-px bg-noche-800" />
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {items.filter((item) => !item.roles || hasRole(...item.roles)).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            onClick={close}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-(--radius-control) px-3 py-2 text-sm transition ${
                isActive
                  ? 'bg-noche-800 text-white'
                  : 'text-noche-muted hover:bg-noche-800/60 hover:text-noche-ink'
              }`
            }
          >
            <span aria-hidden className="text-noche-muted">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-noche-800 p-4 text-xs text-noche-muted">
        <p className="truncate font-medium text-noche-ink">{user?.email}</p>
        <p className="mb-2 text-noche-muted">{user && tLabel('employeePosition', user.role)}</p>
        <LanguageSwitcher className="mb-2" />
        <button
          onClick={logout}
          className="w-full rounded-(--radius-control) border border-noche-muted/60 px-2 py-1.5 text-noche-ink transition hover:bg-noche-800"
        >
          {t('common.logout')}
        </button>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-cal-50">
      {/* Mobile backdrop */}
      {open && (
        <button
          type="button"
          aria-label={t('common.closeMenu')}
          onClick={close}
          className="fixed inset-0 z-40 bg-noche-900/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`reticula-noche sobre-noche fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col transition-transform duration-200 ease-out lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!open}
      >
        {sidebarInner}
      </aside>

      {/* Desktop sidebar */}
      <aside className="reticula-noche sobre-noche hidden w-60 shrink-0 flex-col lg:flex">{sidebarInner}</aside>

      <main className="min-w-0 flex-1">
        {/* Mobile top bar with hamburger */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-cal-200 bg-cal-50/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t('common.openMenu')}
            className="rounded-(--radius-control) border border-cal-200 bg-white p-2 text-tinta-900"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <Link to="/" className="font-display text-base text-tinta-900">
            <span className="text-granate-700">◆</span> Zellige ERP
          </Link>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
