import { useEffect, useRef, useState } from 'react'
import { useMenosMovimiento, useNavegadorLibre } from '../motion/preferencias'
import { cargarTodo } from './cargador'
import { suscribirPieza, type PiezaId } from './piezas'
import { useCercaDePantalla } from './useCercaDePantalla'

/*
 * Una ilustración de «Reservar, paso a paso». La imagen SVG fija (el estado final) siempre está
 * y es lo único que ven quienes piden menos movimiento o no tienen el runtime. Encima va un
 * lienzo de Rive (decorativo, aria-hidden) que solo se carga cuando la pieza está cerca de la
 * pantalla; su progreso (entrada numérica «progreso» del view model) lo mueve el scroll.
 * El texto del paso sigue siendo HTML, en LandingPage.
 */

const ARTBOARD: Record<PiezaId, string> = {
  fechas: 'Fechas',
  solapes: 'Solapes',
  confirmacion: 'Confirmacion',
  factura: 'Factura',
}

export function PiezaRive({ pieza, className = '' }: { pieza: PiezaId; className?: string }) {
  const quieto = useMenosMovimiento()
  const libre = useNavegadorLibre()
  const caja = useRef<HTMLDivElement>(null)
  const lienzo = useRef<HTMLCanvasElement>(null)
  const [lista, setLista] = useState(false)
  const cerca = useCercaDePantalla(caja)

  useEffect(() => {
    if (quieto || !libre || !cerca) return
    const canvas = lienzo.current
    if (!canvas) return
    let cancelado = false
    let soltar: (() => void) | undefined
    let instancia: InstanceType<typeof import('@rive-app/canvas-lite').Rive> | undefined
    let observador: ResizeObserver | undefined

    cargarTodo('reservar')
      .then(([rive, buffer]) => {
        if (cancelado) return
        instancia = new rive.Rive({
          buffer,
          canvas,
          artboard: ARTBOARD[pieza],
          autoplay: true,
          autoBind: true,
          layout: new rive.Layout({ fit: rive.Fit.Contain, alignment: rive.Alignment.Center }),
          shouldDisableRiveListeners: true,
          isTouchScrollEnabled: true,
          onLoad: () => {
            if (cancelado || !instancia) return
            instancia.resizeDrawingSurfaceToCanvas()
            const entrada = instancia.viewModelInstance?.number('progreso')
            if (!entrada) return // sin entrada, se queda el SVG
            soltar = suscribirPieza(pieza, (p) => {
              entrada.value = p
            })
            observador = new ResizeObserver(() => instancia?.resizeDrawingSurfaceToCanvas())
            observador.observe(canvas)
            setLista(true)
          },
          onLoadError: () => setLista(false),
        })
      })
      .catch(() => {
        /* sin runtime o sin archivo: se queda la imagen fija */
      })

    return () => {
      cancelado = true
      soltar?.()
      observador?.disconnect()
      instancia?.cleanup()
      setLista(false)
    }
  }, [quieto, libre, cerca, pieza])

  return (
    <div
      ref={caja}
      data-pieza={pieza}
      data-rive={lista ? 'lista' : 'imagen'}
      className={`relative aspect-[3/2] w-full ${className}`}
    >
      <img src={`/rive/${pieza}.svg`} alt="" width={480} height={320} decoding="async" loading="lazy" className="absolute inset-0 size-full" />
      <canvas
        ref={lienzo}
        aria-hidden
        className="rive-lienzo pointer-events-none absolute inset-0 size-full"
      />
    </div>
  )
}
