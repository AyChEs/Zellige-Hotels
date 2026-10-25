import { useEffect, useState, useSyncExternalStore } from 'react'

const CONSULTA = '(prefers-reduced-motion: reduce)'

const media = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(CONSULTA) : null)

/** true si la persona ha pedido menos movimiento (o si no se puede saber: jsdom, SSR). */
export function menosMovimiento(): boolean {
  const m = media()
  return m ? m.matches : true
}

function suscribir(aviso: () => void) {
  const m = media()
  m?.addEventListener('change', aviso)
  return () => m?.removeEventListener('change', aviso)
}

/** Igual que menosMovimiento(), pero se actualiza si cambia la preferencia con la página abierta. */
export function useMenosMovimiento(): boolean {
  return useSyncExternalStore(suscribir, menosMovimiento, () => true)
}

/** Rutas con movimiento ligado al scroll (y Lenis): portada, lista de hoteles y ficha. */
export const esRutaConMovimiento = (pathname: string) => pathname === '/' || /^\/hotels(\/\d+)?\/?$/.test(pathname)

/**
 * true cuando la página ya se ha pintado, ha terminado de cargar y el navegador está libre.
 * GSAP y Lenis esperan a este momento: no compiten con la foto de la portada ni con el
 * primer pintado (el HTML ya es el estado final, así que no se ve nada raro mientras tanto).
 */
export function useNavegadorLibre(): boolean {
  const [libre, setLibre] = useState(false)
  useEffect(() => {
    let cancelado = false
    let id: number | undefined
    const arrancar = () => {
      const listo = () => !cancelado && setLibre(true)
      if ('requestIdleCallback' in window) id = window.requestIdleCallback(listo, { timeout: 1500 })
      else id = setTimeout(listo, 200) as unknown as number
    }
    if (document.readyState === 'complete') arrancar()
    else window.addEventListener('load', arrancar, { once: true })
    return () => {
      cancelado = true
      window.removeEventListener('load', arrancar)
      if (id !== undefined && 'cancelIdleCallback' in window) window.cancelIdleCallback(id)
    }
  }, [])
  return libre
}
