import { useCallback, useEffect, useRef, useState } from 'react'
import { useMenosMovimiento, useNavegadorLibre } from '../motion/preferencias'
import { cargarTodo } from './cargador'
import { useCercaDePantalla } from './useCercaDePantalla'

/*
 * Logotipo animado (docs/MARCA.md §13): el arco se dibuja con un trazo y después se enciende la
 * clave. Una vez al cargar y otra cada vez que el puntero pasa por encima. El símbolo SVG está
 * siempre debajo: es lo que se ve hasta que el runtime carga, si no carga y con
 * prefers-reduced-motion. El tiempo de la animación lo lleva este hook: mueve la entrada
 * numérica «progreso» del view model de 0 a 1 en 1,8 s (la línea de tiempo del archivo ya
 * trae sus curvas).
 */

export type TonoVivo = 'marca' | 'claro'

const DURACION_MS = 1800
const RETRASO_INICIAL_MS = 700

// Colores del view model (ARGB). «marca» son los del archivo; «claro» sirve sobre noche-900.
const CLARO = { tesela: 0xffedeae3, luz: 0xffe2b9bf }

type Entrada = { value: number }

export function useSimboloVivo({ activo, tono }: { activo: boolean; tono: TonoVivo }) {
  const quieto = useMenosMovimiento()
  const libre = useNavegadorLibre()
  const caja = useRef<HTMLSpanElement>(null)
  const lienzo = useRef<HTMLCanvasElement>(null)
  const reproductor = useRef<(() => void) | null>(null)
  const [lista, setLista] = useState(false)
  const visible = useCercaDePantalla(caja, '0px', activo)

  useEffect(() => {
    if (!activo || quieto || !libre || !visible) return
    const canvas = lienzo.current
    if (!canvas) return
    let cancelado = false
    let instancia: InstanceType<typeof import('@rive-app/canvas-lite').Rive> | undefined
    let raf = 0
    let arranque = 0

    const animar = (entrada: Entrada) => {
      const t0 = performance.now()
      const paso = (t: number) => {
        const k = Math.min(1, (t - t0) / DURACION_MS)
        entrada.value = k
        raf = k < 1 ? requestAnimationFrame(paso) : 0
      }
      entrada.value = 0
      raf = requestAnimationFrame(paso)
    }

    cargarTodo('logotipo')
      .then(([rive, buffer]) => {
        if (cancelado) return
        instancia = new rive.Rive({
          buffer,
          canvas,
          artboard: 'Logotipo',
          autoplay: true,
          autoBind: true,
          layout: new rive.Layout({ fit: rive.Fit.Contain, alignment: rive.Alignment.Center }),
          shouldDisableRiveListeners: true,
          isTouchScrollEnabled: true,
          onLoad: () => {
            if (cancelado || !instancia) return
            const vm = instancia.viewModelInstance
            const progreso = vm?.number('progreso')
            if (!vm || !progreso) return // sin entrada, se queda el SVG
            if (tono === 'claro') {
              const tesela = vm.color('tesela')
              const luz = vm.color('luz')
              if (tesela) tesela.value = CLARO.tesela
              if (luz) luz.value = CLARO.luz
            }
            instancia.resizeDrawingSurfaceToCanvas()
            progreso.value = 0 // la primera imagen es el símbolo de siempre
            setLista(true)
            reproductor.current = () => {
              if (raf) return // ya se está dibujando
              animar(progreso)
            }
            arranque = window.setTimeout(() => reproductor.current?.(), RETRASO_INICIAL_MS)
          },
        })
      })
      .catch(() => {
        /* sin runtime: se queda el símbolo SVG */
      })

    return () => {
      cancelado = true
      window.clearTimeout(arranque)
      cancelAnimationFrame(raf)
      reproductor.current = null
      instancia?.cleanup()
      setLista(false)
    }
  }, [activo, quieto, libre, visible, tono])

  const reproducir = useCallback(() => reproductor.current?.(), [])
  return { caja, lienzo, lista, reproducir }
}
