import type { RefObject } from 'react'
import { moverPieza, soltarPiezas, type PiezaId } from '../rive/piezas'
import { DURACION_ENTRADA, ESCALONADO, SERENO, ScrollTrigger, gsap, useGSAP } from './gsap'

/*
 * Escenas de movimiento de la parte pública (docs/MARCA.md §9). Cada componente recibe la
 * raíz de su página, no pinta nada y deja que useGSAP revierta todo al desmontar (cambio de
 * ruta, StrictMode). Solo se cargan sin prefers-reduced-motion: el HTML ya es el estado final.
 * Reglas: solo transform y opacity; scrub en las escenas grandes; nada depende del ratón
 * salvo los botones magnéticos, que solo existen con puntero fino.
 */

interface Props {
  raiz: RefObject<HTMLElement | null>
  /** Los datos ya están en la página: se puede medir. */
  listo: boolean
}

const ANCHO = '(min-width: 768px)'
const ESTRECHO = '(max-width: 767px)'
const PUNTERO_FINO = '(hover: hover) and (pointer: fine)'

/** Titulares que entran por líneas al llegar a la vista. */
function titulares(raiz: HTMLElement) {
  raiz.querySelectorAll<HTMLElement>('h2, h3').forEach((h) => {
    const lineas = h.querySelectorAll('.linea-int:not(.linea-entrada)')
    if (!lineas.length) return
    gsap.from(lineas, {
      yPercent: 115,
      duration: DURACION_ENTRADA * 1.2,
      ease: SERENO,
      stagger: ESCALONADO,
      scrollTrigger: { trigger: h, start: 'top 88%', once: true },
    })
  })
}

/** Elementos `.revela` que entran escalonados (tarjetas, habitaciones). */
function revelar(raiz: HTMLElement) {
  const items = gsap.utils.toArray<HTMLElement>('.revela', raiz)
  if (!items.length) return
  raiz.classList.add('revelar-listo')
  gsap.set(items, { opacity: 0, y: 40 })
  ScrollTrigger.batch(items, {
    start: 'top 92%',
    once: true,
    onEnter: (lote) => gsap.to(lote, { opacity: 1, y: 0, duration: DURACION_ENTRADA, ease: SERENO, stagger: ESCALONADO }),
  })
}

/** Botones magnéticos: se acercan un poco al puntero. Solo con ratón; nunca con teclado. */
function magneticos(raiz: HTMLElement) {
  const limpiar: (() => void)[] = []
  raiz.querySelectorAll<HTMLElement>('[data-magnetico]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      x((e.clientX - (r.left + r.width / 2)) * 0.28)
      y((e.clientY - (r.top + r.height / 2)) * 0.36)
    }
    const soltar = () => {
      x(0)
      y(0)
    }
    el.addEventListener('pointermove', mover)
    el.addEventListener('pointerleave', soltar)
    limpiar.push(() => {
      el.removeEventListener('pointermove', mover)
      el.removeEventListener('pointerleave', soltar)
    })
  })
  return () => limpiar.forEach((f) => f())
}

/**
 * Si el foco entra en una sección fijada, lleva el scroll al punto en que ese elemento se ve
 * (el teclado nunca acaba en algo transparente o fuera de la pantalla).
 */
function seguirFoco(contenedor: HTMLElement, st: ScrollTrigger, progreso: (el: HTMLElement) => number) {
  const alEnfocar = (e: FocusEvent) => {
    const p = Math.min(1, Math.max(0, progreso(e.target as HTMLElement)))
    const destino = st.start + (st.end - st.start) * p
    if (Math.abs(window.scrollY - destino) > 2) window.scrollTo({ top: destino, behavior: 'instant' })
  }
  contenedor.addEventListener('focusin', alEnfocar)
  return () => contenedor.removeEventListener('focusin', alEnfocar)
}

export function MovimientoPortada({ raiz, listo }: Props) {
  useGSAP(
    () => {
      const root = raiz.current
      if (!root || !listo) return
      root.dataset.movimiento = 'on'
      const limpiar: (() => void)[] = []
      const mm = gsap.matchMedia()

      mm.add({ ancho: ANCHO, estrecho: ESTRECHO, fino: PUNTERO_FINO }, (ctx) => {
        const { ancho, fino } = ctx.conditions as { ancho: boolean; fino: boolean }
        const q = gsap.utils.selector(root)

        // 1 · El umbral: el arco crece hasta que la foto ocupa toda la pantalla.
        const umbral = q('[data-escena="umbral"]')[0] as HTMLElement
        const marco = q('.umbral-marco')[0] as Element | undefined
        if (umbral && marco) {
          const escala = () => (2.6 * Math.max(innerWidth, innerHeight)) / marco.getBoundingClientRect().width
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: umbral,
              start: 'top top',
              end: ancho ? '+=70%' : '+=45%',
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          })
          tl.to(marco, { scale: escala, transformOrigin: '50% 50%', ease: 'power2.in', duration: 1 }, 0)
            .to(q('.umbral-texto'), { yPercent: -14, opacity: 0, ease: 'power1.in', duration: 0.45 }, 0)
            .fromTo(q('.umbral-foto'), { scale: 1.14 }, { scale: 1, ease: 'none', duration: 1 }, 0)
            .fromTo(q('.umbral-pie'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: SERENO, duration: 0.25 }, 0.72)
          if (tl.scrollTrigger) limpiar.push(seguirFoco(umbral, tl.scrollTrigger, () => 0))
        }

        // 2 · Titulares por líneas.
        titulares(root)

        // 3 · La cinta avanza al ritmo del scroll (no se mueve sola).
        gsap.fromTo(
          q('.cinta-pista'),
          { xPercent: 0 },
          {
            xPercent: -33.34,
            ease: 'none',
            scrollTrigger: { trigger: q('[data-escena="cinta"]')[0], start: 'top bottom', end: 'bottom top', scrub: 0.8 },
          },
        )

        // 4 · Carrusel horizontal fijado: las tarjetas llegan inclinadas, se enderezan y se apilan.
        const carrusel = q('[data-escena="carrusel"]')[0] as HTMLElement
        const pista = q('.carrusel-pista')[0] as HTMLElement
        const tarjetas = gsap.utils.toArray<HTMLElement>(q('.carrusel-tarjeta'))
        const recorrido = () => Math.max(0, pista.scrollWidth - innerWidth)
        if (carrusel && pista && recorrido() > 40) {
          const mov = gsap.to(pista, {
            x: () => -recorrido(),
            ease: 'none',
            scrollTrigger: {
              trigger: carrusel,
              start: 'top top',
              end: () => `+=${recorrido() * (ancho ? 0.85 : 0.6)}`,
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          })
          tarjetas.forEach((t) => {
            const giro = Number(t.dataset.inclinacion ?? 0)
            gsap.fromTo(
              t,
              { rotate: giro * 2.4, y: 50 },
              {
                rotate: 0,
                y: 0,
                ease: 'none',
                scrollTrigger: { trigger: t, containerAnimation: mov, start: 'left right', end: 'center 60%', scrub: true },
              },
            )
            gsap.to(t, {
              x: () => t.offsetWidth * 0.82,
              rotate: -giro,
              scale: 0.88,
              opacity: 0.5,
              ease: 'none',
              scrollTrigger: {
                trigger: t,
                containerAnimation: mov,
                start: 'left 6%',
                end: 'right 6%',
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
          })
          if (mov.scrollTrigger)
            limpiar.push(
              seguirFoco(pista, mov.scrollTrigger, (el) => {
                const t = el.closest<HTMLElement>('.carrusel-tarjeta')
                return t ? (t.offsetLeft - innerWidth * 0.1) / recorrido() : 0
              }),
            )
        }

        // 5 · Historia por pasos: fijada en pantallas anchas; en móvil cada paso entra al llegar.
        // Las ilustraciones de Rive de cada paso (rive/reservar) avanzan con este mismo scroll:
        // el ScrollTrigger escribe su «progreso» (0 a 1) y la pieza lo copia al view model.
        const historia = q('[data-escena="historia"]')[0] as HTMLElement
        const pasos = gsap.utils.toArray<HTMLElement>(q('.paso'))
        const piezaDe = (paso: HTMLElement) => paso.querySelector<HTMLElement>('[data-pieza]')?.dataset.pieza as PiezaId | undefined
        if (historia && pasos.length) {
          const medidores = pasos.map(() => ({ p: 0 }))
          pasos.forEach((paso) => {
            const id = piezaDe(paso)
            if (id) moverPieza(id, 0) // desde aquí manda el scroll: las piezas parten del principio
          })
          const mueve = (i: number) => () => {
            const id = piezaDe(pasos[i])
            if (id) moverPieza(id, medidores[i].p)
          }
          if (ancho) {
            const barras = q('.historia-barra')
            gsap.set(pasos.slice(1), { opacity: 0 })
            gsap.set(barras[0], { scaleX: 1 })
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: historia,
                start: 'top top',
                end: `+=${(pasos.length - 1) * 55}%`,
                pin: true,
                scrub: 0.8,
              },
            })
            // El primer paso ya se ve al llegar: su ilustración empieza antes de fijarse la sección.
            const PREVIO = 0.45
            if (pasos[0] && piezaDe(pasos[0])) {
              const id = piezaDe(pasos[0]) as PiezaId
              ScrollTrigger.create({
                trigger: historia,
                start: 'top 85%',
                end: 'top top',
                onUpdate: (self) => moverPieza(id, PREVIO * self.progress),
              })
              tl.fromTo(medidores[0], { p: PREVIO }, { p: 1, duration: 0.7, ease: 'none', immediateRender: false, onUpdate: mueve(0) }, 0)
            }
            pasos.forEach((p, i) => {
              if (i === 0) return
              const prev = pasos[i - 1]
              tl.to(prev.querySelector('.paso-texto'), { y: -40, opacity: 0, duration: 0.4, ease: 'power1.in' }, i)
                .to(prev.querySelector('.paso-visual'), { y: -60, rotate: -3, opacity: 0, duration: 0.4, ease: 'power1.in' }, i)
                .set(prev, { opacity: 0 }, i + 0.4)
                .set(p, { opacity: 1 }, i + 0.3)
                .fromTo(p.querySelector('.paso-texto'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: SERENO }, i + 0.35)
                .fromTo(
                  p.querySelector('.paso-visual'),
                  { y: 80, rotate: 4, opacity: 0 },
                  { y: 0, rotate: 0, opacity: 1, duration: 0.6, ease: SERENO },
                  i + 0.35,
                )
                .fromTo(medidores[i], { p: 0 }, { p: 1, duration: 0.65, ease: 'none', onUpdate: mueve(i) }, i + 0.35)
                .to(barras[i], { scaleX: 1, duration: 0.6, ease: 'none' }, i)
            })
            tl.to({}, { duration: 0.4 })
          } else {
            pasos.forEach((p, i) => {
              gsap.from(p.children, {
                y: 40,
                opacity: 0,
                duration: DURACION_ENTRADA,
                ease: SERENO,
                stagger: ESCALONADO * 2,
                scrollTrigger: { trigger: p, start: 'top 85%', once: true },
              })
              gsap.to(medidores[i], {
                p: 1,
                ease: 'none',
                onUpdate: mueve(i),
                scrollTrigger: { trigger: p, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
              })
            })
          }
        }

        // 6 · Contorno: el nombre gigante deriva despacio y las fotos lo cruzan a distinta velocidad.
        const contorno = q('[data-escena="contorno"]')[0] as HTMLElement
        if (contorno) {
          gsap.fromTo(
            q('.contorno-texto'),
            { xPercent: -6 },
            { xPercent: 6, ease: 'none', scrollTrigger: { trigger: contorno, start: 'top bottom', end: 'bottom top', scrub: 1 } },
          )
          gsap.utils.toArray<HTMLElement>(q('.contorno-foto')).forEach((f) => {
            const v = Number(f.dataset.velocidad ?? 10)
            gsap.fromTo(
              f,
              { yPercent: Math.abs(v) * 1.3, rotate: v / 6 },
              {
                yPercent: -Math.abs(v) * 1.3,
                rotate: -v / 8,
                ease: 'none',
                scrollTrigger: { trigger: contorno, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
              },
            )
          })
        }

        if (fino) limpiar.push(magneticos(root))
      })

      // Las fuentes cambian la altura de los titulares: medir otra vez cuando estén.
      document.fonts?.ready.then(() => ScrollTrigger.refresh())

      return () => {
        limpiar.forEach((f) => f())
        mm.revert()
        soltarPiezas()
        delete root.dataset.movimiento
      }
    },
    { scope: raiz, dependencies: [listo], revertOnUpdate: true },
  )
  return null
}

export function MovimientoLista({ raiz, listo }: Props) {
  useGSAP(
    () => {
      const root = raiz.current
      if (!root || !listo) return
      titulares(root)
      revelar(root)
      const mm = gsap.matchMedia()
      mm.add(PUNTERO_FINO, () => magneticos(root))
      return () => {
        mm.revert()
        root.classList.remove('revelar-listo')
      }
    },
    { scope: raiz, dependencies: [listo], revertOnUpdate: true },
  )
  return null
}

export function MovimientoFicha({ raiz, listo }: Props) {
  useGSAP(
    () => {
      const root = raiz.current
      if (!root || !listo) return
      titulares(root)
      revelar(root)
      // Galería: cada foto se desplaza dentro de su marco (paralaje) mientras cruza la pantalla.
      gsap.utils.toArray<HTMLElement>('.galeria-foto', root).forEach((marco, i) => {
        const img = marco.querySelector('img')
        if (!img) return
        gsap.fromTo(
          img,
          { yPercent: -6 - i * 2, scale: 1.16 },
          {
            yPercent: 6 + i * 2,
            scale: 1.16,
            ease: 'none',
            scrollTrigger: { trigger: marco, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          },
        )
      })
      gsap.from(gsap.utils.toArray('.galeria-foto', root), {
        opacity: 0,
        y: 50,
        duration: DURACION_ENTRADA * 1.2,
        ease: SERENO,
        stagger: ESCALONADO * 1.5,
      })
      return () => root.classList.remove('revelar-listo')
    },
    { scope: raiz, dependencies: [listo], revertOnUpdate: true },
  )
  return null
}
