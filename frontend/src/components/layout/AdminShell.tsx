import { Link, NavLink, Outlet } from 'react-router-dom'
import { useEffect, useRef, useState, type ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../auth/AuthContext'
import { LanguageSwitcher } from '../../i18n/LanguageSwitcher'
import type { Role } from '../../api/types'
import { useLabels } from '../../lib/labels'
import {
  IconCalendario,
  IconCerrar,
  IconEdificio,
  IconEtiqueta,
  IconFactura,
  IconGafete,
  IconLista,
  IconMenu,
  IconPanel,
  IconPersona,
  IconPuerta,
  IconReserva,
} from '../ui/icons'

type NavItem = { to: string; label: string; Icon: ComponentType<{ size?: number }>; roles?: Role[] }

export function AdminShell() {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  const { user, logout, hasRole } = useAuth()
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const drawer = useRef<HTMLElement>(null)

  // Which role sees what is decided by the backend; this only hides links a role cannot use.
  const items: NavItem[] = [
    { to: '/admin', label: t('admin.nav.dashboard'), Icon: IconPanel, roles: ['ADMIN', 'MANAGER'] },
    { to: '/admin/bookings', label: t('admin.nav.bookings'), Icon: IconReserva },
    { to: '/admin/calendar', label: t('admin.nav.calendar'), Icon: IconCalendario },
    { to: '/admin/invoices', label: t('admin.nav.invoices'), Icon: IconFactura },
    { to: '/admin/clients', label: t('admin.nav.clients'), Icon: IconPersona },
    { to: '/admin/tasks', label: t('admin.nav.tasks'), Icon: IconLista },
    { to: '/admin/hotels', label: t('admin.nav.hotels'), Icon: IconEdificio, roles: ['ADMIN'] },
    { to: '/admin/rooms', label: t('admin.nav.rooms'), Icon: IconPuerta, roles: ['ADMIN', 'MANAGER'] },
    { to: '/admin/categories', label: t('admin.nav.categories'), Icon: IconEtiqueta, roles: ['ADMIN'] },
    { to: '/admin/employees', label: t('admin.nav.employees'), Icon: IconGafete, roles: ['ADMIN', 'MANAGER'] },
  ]

  const close = () => setOpen(false)

  // Focus moves into the drawer on open; Esc closes it. Once it is closed (and the page is
  // no longer inert) focus goes back to the menu button.
  const wasOpen = useRef(false)
  useEffect(() => {
    if (!open) {
      if (wasOpen.current) menuButton.current?.focus()
      wasOpen.current = false
      return
    }
    wasOpen.current = true
    drawer.current?.querySelector<HTMLElement>('nav a')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const sidebarInner = (closeButton?: boolean) => (
    <>
      <div className="flex h-16 items-center justify-between px-5">
        <Link to="/" className="font-display text-xl text-noche-ink" onClick={close}>
          <span aria-hidden className="mr-1.5 text-base text-noche-muted">
            ◆
          </span>
          Zellige ERP
        </Link>
        {closeButton && (
          <button
            type="button"
            onClick={close}
            aria-label={t('common.closeMenu')}
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-(--radius-control) text-noche-ink hover:bg-noche-800"
          >
            <IconCerrar size={20} />
          </button>
        )}
      </div>
      <nav aria-label={t('admin.nav.label')} className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {items
          .filter((item) => !item.roles || hasRole(...item.roles))
          .map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              onClick={close}
              className={({ isActive }) =>
                `flex min-h-11 items-center gap-3 rounded-(--radius-control) px-3 text-sm font-semibold transition-colors duration-150 lg:min-h-10 ${
                  isActive ? 'bg-noche-800 text-white' : 'text-noche-muted hover:bg-noche-800 hover:text-noche-ink'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
      </nav>
      <div className="space-y-3 border-t border-noche-800 p-4 text-sm">
        <div>
          <p className="truncate font-semibold text-noche-ink">{user?.email}</p>
          <p className="text-noche-muted">{user && tLabel('employeePosition', user.role)}</p>
        </div>
        <LanguageSwitcher />
        <button
          type="button"
          onClick={logout}
          className="min-h-11 w-full rounded-(--radius-control) border border-noche-muted/60 px-3 font-semibold text-noche-ink transition-colors duration-150 hover:bg-noche-800 lg:min-h-9"
        >
          {t('common.logout')}
        </button>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-cal-50">
      {open && <div aria-hidden className="fixed inset-0 z-40 bg-tinta-900/40 lg:hidden" onClick={close} />}

      <aside
        ref={drawer}
        id="menu-panel"
        inert={!open}
        className={`reticula-noche sobre-noche fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col transition-transform duration-200 ease-out lg:hidden ${
          open ? 'translate-x-0' : 'invisible -translate-x-full'
        }`}
      >
        {sidebarInner(true)}
      </aside>

      <aside className="reticula-noche sobre-noche sticky top-0 hidden h-screen w-60 shrink-0 flex-col lg:flex">
        {sidebarInner()}
      </aside>

      <div className="min-w-0 flex-1" inert={open}>
        <div className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-cal-200 bg-cal-50 px-4 lg:hidden">
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t('common.openMenu')}
            aria-expanded={open}
            aria-controls="menu-panel"
            className="inline-flex size-11 items-center justify-center rounded-(--radius-control) border border-cal-400 bg-white text-tinta-900"
          >
            <IconMenu size={20} />
          </button>
          <Link to="/" className="font-display text-lg text-tinta-900">
            <span aria-hidden className="mr-1.5 text-sm text-granate-700">
              ◆
            </span>
            Zellige ERP
          </Link>
        </div>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
