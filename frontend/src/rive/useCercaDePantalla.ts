import { useEffect, useState, type RefObject } from 'react'

/** true cuando el elemento está (o va a estar enseguida) en pantalla; una vez en true, se queda. */
export function useCercaDePantalla(ref: RefObject<Element | null>, margen = '700px 0px', habilitado = true) {
  const [cerca, setCerca] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || cerca || !habilitado) return
    if (!('IntersectionObserver' in window)) {
      setCerca(true)
      return
    }
    const io = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setCerca(true)
          io.disconnect()
        }
      },
      { rootMargin: margen },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margen, cerca, habilitado])
  return cerca
}
