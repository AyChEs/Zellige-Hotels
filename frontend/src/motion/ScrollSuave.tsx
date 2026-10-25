import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

/**
 * Desplazamiento suave con Lenis, solo en las rutas públicas con movimiento y nunca con
 * prefers-reduced-motion (lo decide PublicShell). La rueda se suaviza; el teclado, el
 * táctil y el foco siguen siendo el desplazamiento nativo. Un único bucle: el de GSAP.
 */
export default function ScrollSuave() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      anchors: { offset: -80 },
      // Diálogos y menús con su propio scroll quedan fuera.
      prevent: (nodo: HTMLElement) => nodo.closest?.('dialog, [role="dialog"], #menu-movil') != null,
    })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    document.documentElement.classList.add('con-lenis')
    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      document.documentElement.classList.remove('con-lenis')
    }
  }, [])
  return null
}
