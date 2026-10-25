/*
 * Puente entre el movimiento ligado al scroll (GSAP, motion/escenas.tsx) y las piezas de Rive
 * («Reservar, paso a paso»). El scroll escribe un número entre 0 y 1 por pieza; la pieza, cuando
 * su runtime ya ha cargado, lo copia a la entrada «progreso» del view model. Este módulo no
 * importa nada de Rive ni de GSAP: pesa unos bytes y se puede cargar siempre.
 *
 * Sin nadie al mando (sin JavaScript de movimiento, o con prefers-reduced-motion) el progreso
 * por defecto es 1: la pieza se ve en su estado final.
 */

export type PiezaId = 'fechas' | 'solapes' | 'confirmacion' | 'factura'

type Escucha = (progreso: number) => void

const valores = new Map<PiezaId, number>()
const escuchas = new Map<PiezaId, Set<Escucha>>()

const acotar = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 1)

/** Progreso actual de una pieza (1 si nadie lo ha movido). */
export function progresoDe(id: PiezaId): number {
  return valores.get(id) ?? 1
}

/** Mueve una pieza. Lo llama el scroll en cada actualización. */
export function moverPieza(id: PiezaId, progreso: number) {
  const p = acotar(progreso)
  if (valores.get(id) === p) return
  valores.set(id, p)
  escuchas.get(id)?.forEach((fn) => fn(p))
}

/** Devuelve las piezas a su estado final (al desmontar la escena de movimiento). */
export function soltarPiezas() {
  for (const id of [...valores.keys()]) moverPieza(id, 1)
  valores.clear()
}

/** La pieza se suscribe a su progreso y recibe el valor actual al momento. */
export function suscribirPieza(id: PiezaId, fn: Escucha): () => void {
  let set = escuchas.get(id)
  if (!set) escuchas.set(id, (set = new Set()))
  set.add(fn)
  fn(progresoDe(id))
  return () => {
    set.delete(fn)
  }
}
