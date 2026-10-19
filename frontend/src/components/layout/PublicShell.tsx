import { Link, NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../auth/AuthContext'
import { homeFor } from '../../auth/ProtectedRoute'
import { LanguageSwitcher } from '../../i18n/LanguageSwitcher'

const navLink = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm transition ${
    isActive ? 'text-white underline decoration-2 underline-offset-8' : 'text-noche-ink hover:text-white'
  }`

export function PublicShell() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <div className="flex min-h-screen flex-col bg-cal-50">
      <header className="bg-noche-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
          <Link to="/" className="font-display text-lg text-noche-ink sm:text-xl">
            <span className="text-noche-muted">◆</span> Zellige Hotels
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/" end className={navLink}>
                {t('public.nav.home')}
            </NavLink>
            <NavLink to="/hotels" className={navLink}>
              {t('public.nav.hotels')}
            </NavLink>
            {user ? (
              <>
                <NavLink to={homeFor(user.role)} className={navLink}>
                  {user.role === 'CLIENT' ? t('public.nav.myAccount') : t('public.nav.staffPanel')}
                </NavLink>
                <button
                  onClick={logout}
                  className="ml-2 rounded-(--radius-control) border border-noche-muted/60 px-3 py-1.5 text-sm text-noche-ink transition hover:bg-noche-800"
                >
                  {t('public.nav.logout')}
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLink}>
                  {t('public.nav.login')}
                </NavLink>
                <Link
                  to="/register"
                  className="ml-2 rounded-(--radius-control) bg-fez-700 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-fez-800"
                >
                  {t('auth.register.submit')}
                </Link>
              </>
            )}
            <LanguageSwitcher className="ml-1" />
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t('common.openMenu')}
            className="rounded-(--radius-control) border border-noche-muted/60 p-2 text-noche-ink md:hidden"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <button
          type="button"
          aria-label={t('common.closeMenu')}
          onClick={close}
          className="fixed inset-0 z-40 bg-noche-900/60 backdrop-blur-sm md:hidden"
        />
      )}
      <aside
        className={`bg-noche-900 fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] transform flex-col transition-transform duration-200 ease-out md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-noche-800 px-5 py-4">
          <span className="font-display text-lg text-noche-ink">
            <span className="text-noche-muted">◆</span> Zellige Hotels
          </span>
          <button
            type="button"
            onClick={close}
            aria-label={t('common.closeMenu')}
            className="rounded-(--radius-control) p-1.5 text-noche-ink hover:bg-noche-800"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-1">
            <li><NavLink to="/" end onClick={close} className={({ isActive }) => `block rounded-(--radius-control) px-3 py-2.5 text-sm transition ${isActive ? 'bg-noche-800 text-white' : 'text-noche-ink hover:bg-noche-800'}`}>{t('public.nav.home')}</NavLink></li>
            <li><NavLink to="/hotels" onClick={close} className={({ isActive }) => `block rounded-(--radius-control) px-3 py-2.5 text-sm transition ${isActive ? 'bg-noche-800 text-white' : 'text-noche-ink hover:bg-noche-800'}`}>{t('public.nav.hotels')}</NavLink></li>
            {user && (
              <li><NavLink to={homeFor(user.role)} onClick={close} className={({ isActive }) => `block rounded-(--radius-control) px-3 py-2.5 text-sm transition ${isActive ? 'bg-noche-800 text-white' : 'text-noche-ink hover:bg-noche-800'}`}>{user.role === 'CLIENT' ? t('public.nav.myAccount') : t('public.nav.staffPanel')}</NavLink></li>
            )}
          </ul>
        </nav>
        <div className="border-t border-noche-800 p-4">
          <LanguageSwitcher className="mb-3" />
          {user ? (
            <button
              onClick={() => { logout(); close() }}
              className="w-full rounded-(--radius-control) border border-noche-muted/60 px-3 py-2 text-sm text-noche-ink transition hover:bg-noche-800"
            >
              {t('public.nav.logout')}
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <NavLink to="/login" onClick={close} className="rounded-(--radius-control) border border-noche-muted/60 px-3 py-2 text-center text-sm text-noche-ink">
                {t('public.nav.login')}
              </NavLink>
              <Link to="/register" onClick={close} className="rounded-(--radius-control) bg-fez-700 px-3 py-2 text-center text-sm font-semibold text-white">
                {t('auth.register.submit')}
              </Link>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-noche-900 py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-noche-muted">
          <div className="separador mx-auto mb-3 max-w-xs">◆</div>
          Zellige Hotels · {t('public.footer.tagline')} ·{' '}
          <a
            href="https://github.com/AyChEs"
            className="text-noche-ink underline underline-offset-2 hover:text-white"
            target="_blank"
            rel="noreferrer"
          >
            AyChEs
          </a>
        </div>
      </footer>
    </div>
  )
}
