import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ErrorBoundary } from '../ErrorBoundary'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../auth/AuthContext'
import { homeFor } from '../../auth/ProtectedRoute'
import { LanguageSwitcher } from '../../i18n/LanguageSwitcher'
import { Button, ButtonLink } from '../ui/Button'
import { IconCerrar, IconMenu } from '../ui/icons'
import { useRouteFocus } from '../../hooks/useRouteFocus'
import { SkipLink } from './SkipLink'
import { Logotipo } from '../brand/Marca'
import { esRutaConMovimiento, useMenosMovimiento, useNavegadorLibre } from '../../motion/preferencias'
import { ScrollSuave } from '../../motion/perezoso'

const navLink = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-11 items-center px-3 text-sm font-semibold transition-colors duration-150 ${
    isActive
      ? 'text-fez-700 underline decoration-2 underline-offset-8'
      : 'text-tinta-900 hover:text-fez-700'
  }`

const drawerLink = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-11 items-center rounded-(--radius-control) px-3 text-base font-semibold transition-colors duration-150 ${
    isActive ? 'bg-fez-50 text-fez-700' : 'text-tinta-900 hover:bg-cal-100'
  }`


export function PublicShell() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const drawer = useRef<HTMLElement>(null)

  const close = () => setOpen(false)
  const quieto = useMenosMovimiento()
  const libre = useNavegadorLibre()
  const suave = !quieto && esRutaConMovimiento(pathname)
  useRouteFocus()

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
    drawer.current?.querySelector<HTMLElement>('a, button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const accountLabel = user?.role === 'CLIENT' ? t('public.nav.myAccount') : t('public.nav.staffPanel')

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-cal-50">
      <SkipLink />
      <header className="cabecera-publica relative z-40 border-b border-cal-200 bg-cal-50 print:hidden" inert={open}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
          <Link to="/" className="-my-1 inline-flex min-h-11 items-center rounded-(--radius-control)">
            <Logotipo animado={suave} />
          </Link>

          <nav aria-label={t('common.menu')} className="hidden items-center gap-1 md:flex">
            <NavLink to="/" end className={navLink}>
              {t('public.nav.home')}
            </NavLink>
            <NavLink to="/hotels" className={navLink}>
              {t('public.nav.hotels')}
            </NavLink>
            {user ? (
              <>
                <NavLink to={homeFor(user.role)} className={navLink}>
                  {accountLabel}
                </NavLink>
                <Button variant="ghost" size="sm" onClick={logout} className="ml-1">
                  {t('public.nav.logout')}
                </Button>
              </>
            ) : (
              <>
                <ButtonLink to="/login" variant="ghost" size="sm" className="ml-1">
                  {t('public.nav.login')}
                </ButtonLink>
                <ButtonLink to="/register" size="sm" className="ml-1">
                  {t('auth.register.submit')}
                </ButtonLink>
              </>
            )}
            <LanguageSwitcher className="ml-2" />
          </nav>

          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t('common.openMenu')}
            aria-expanded={open}
            aria-controls="menu-movil"
            className="inline-flex size-11 items-center justify-center rounded-(--radius-control) border border-cal-400 bg-white text-tinta-900 md:hidden"
          >
            <IconMenu size={20} />
          </button>
        </div>
      </header>

      {open && (
        <div aria-hidden className="fixed inset-0 z-40 bg-tinta-900/40 md:hidden" onClick={close} />
      )}
      <aside
        ref={drawer}
        id="menu-movil"
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-80 max-w-[85vw] flex-col bg-white shadow-(--shadow-card) transition-transform duration-200 ease-out md:hidden ${
          open ? 'translate-x-0' : 'invisible translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-cal-200 px-4">
          <Logotipo size="sm" />
          <button
            type="button"
            onClick={close}
            aria-label={t('common.closeMenu')}
            className="inline-flex size-11 items-center justify-center rounded-(--radius-control) text-tinta-600 hover:bg-cal-100"
          >
            <IconCerrar size={20} />
          </button>
        </div>
        <nav aria-label={t('common.menu')} className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            <li>
              <NavLink to="/" end onClick={close} className={drawerLink}>
                {t('public.nav.home')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/hotels" onClick={close} className={drawerLink}>
                {t('public.nav.hotels')}
              </NavLink>
            </li>
            {user && (
              <li>
                <NavLink to={homeFor(user.role)} onClick={close} className={drawerLink}>
                  {accountLabel}
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
        <div className="space-y-3 border-t border-cal-200 p-4">
          <LanguageSwitcher />
          {user ? (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                logout()
                close()
              }}
            >
              {t('public.nav.logout')}
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <ButtonLink to="/register" onClick={close} className="w-full">
                {t('auth.register.submit')}
              </ButtonLink>
              <ButtonLink to="/login" onClick={close} variant="secondary" className="w-full">
                {t('public.nav.login')}
              </ButtonLink>
            </div>
          )}
        </div>
      </aside>

      <main id="contenido" tabIndex={-1} className={`flex-1 outline-none ${esRutaConMovimiento(pathname) ? 'min-h-svh' : ''}`} inert={open}>
        <ErrorBoundary resetKey={pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>

      <footer className="arqueria mt-10 bg-noche-900 text-noche-ink print:hidden" inert={open}>
        <div className="sobre-noche mx-auto max-w-6xl px-4 pt-14 sm:pt-20">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <Link to="/" className="inline-flex min-h-11 items-center">
                <Logotipo tono="claro" animado={suave} />
              </Link>
              <p className="mt-4 text-sm text-noche-muted">{t('public.footer.tagline')}</p>
            </div>
            <nav aria-label={t('public.footer.explore')}>
              <h2 className="text-sm font-semibold text-fez-200">{t('public.footer.explore')}</h2>
              <ul className="mt-3 grid grid-cols-2 gap-x-10 text-sm sm:grid-cols-1">
                {[
                  ['/', t('public.nav.home')],
                  ['/hotels', t('public.nav.hotels')],
                  ['/marca', t('brand.footerLink')],
                ].map(([to, label]) => (
                  <li key={to}>
                    <Link to={to} className="pie-enlace inline-flex min-h-11 items-center text-noche-ink hover:text-fez-200">
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="https://github.com/AyChEs"
                    target="_blank"
                    rel="noreferrer"
                    className="pie-enlace inline-flex min-h-11 items-center text-noche-ink hover:text-fez-200"
                  >
                    GitHub · AyChEs
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div aria-hidden className="pie-nombre font-display mt-12 select-none overflow-hidden text-noche-ink uppercase sm:mt-16">
            <span>Zellige</span>
          </div>
          <p className="border-t border-noche-800 py-5 text-xs text-noche-muted">{t('public.footer.made')}</p>
        </div>
      </footer>

      {suave && libre && (
        <Suspense fallback={null}>
          <ScrollSuave />
        </Suspense>
      )}
    </div>
  )
}
