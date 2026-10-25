import { useEffect } from 'react'
import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { menosMovimiento } from './preferencias'

/**
 * Cambios de página con la View Transitions API. BrowserRouter (modo declarativo) no
 * aplica `viewTransition`, así que se interceptan en fase de captura los clics en enlaces
 * internos y la navegación se hace dentro de document.startViewTransition. Sin soporte,
 * con prefers-reduced-motion, con teclas modificadoras o en anclas de la misma página,
 * el enlace sigue su camino normal. Un enlace puede salir con `data-sin-transicion`.
 */
export function useTransicionesDePagina() {
  const navigate = useNavigate()
  useEffect(() => {
    if (typeof document === 'undefined' || !('startViewTransition' in document)) return
    const alPulsar = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || a.target || a.hasAttribute('download') || a.hasAttribute('data-sin-transicion')) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin) return
      if (url.pathname === location.pathname && url.search === location.search) return
      if (menosMovimiento()) return
      e.preventDefault()
      document.startViewTransition(() => {
        flushSync(() => navigate(url.pathname + url.search + url.hash))
      })
    }
    document.addEventListener('click', alPulsar, true)
    return () => document.removeEventListener('click', alPulsar, true)
  }, [navigate])
}
