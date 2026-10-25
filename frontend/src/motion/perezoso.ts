import { lazy } from 'react'

/*
 * Puertas de entrada al movimiento. GSAP, ScrollTrigger y Lenis viven en chunks aparte que
 * solo se piden en las rutas públicas y sin prefers-reduced-motion: la página se pinta antes.
 */
const escenas = () => import('./escenas')

export const MovimientoPortada = lazy(() => escenas().then((m) => ({ default: m.MovimientoPortada })))
export const MovimientoLista = lazy(() => escenas().then((m) => ({ default: m.MovimientoLista })))
export const MovimientoFicha = lazy(() => escenas().then((m) => ({ default: m.MovimientoFicha })))
export const ScrollSuave = lazy(() => import('./ScrollSuave'))
