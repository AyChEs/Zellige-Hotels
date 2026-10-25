import type { SVGProps } from 'react'
import { useSimboloVivo } from '../../rive/useSimboloVivo'

/**
 * Símbolo de Zellige (docs/MARCA.md): una tesela de esquinas suaves con dos vacíos,
 * la puerta (arco de herradura abierto hacia abajo) y la clave (rombo) sobre ella.
 * Mismo trazado que frontend/public/identidad/simbolo.svg (lo genera docs/marca/generar.mjs).
 */
export const SIMBOLO_D =
  'M18.6 64V36.741A15 15 0 1 1 45.4 36.741V64H50A14 14 0 0 0 64 50V14A14 14 0 0 0 50 0H14A14 14 0 0 0 0 14V50A14 14 0 0 0 14 64ZM32 4L35.8 7.8L32 11.6L28.2 7.8Z'

/** El símbolo, decorativo por defecto: toma el color del texto (`currentColor`). */
export function Simbolo({ size = 32, ...props }: { size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden focusable="false" {...props}>
      <path fill="currentColor" fillRule="evenodd" d={SIMBOLO_D} />
    </svg>
  )
}

type Tono = 'marca' | 'tinta' | 'claro'

const TONOS: Record<Tono, { simbolo: string; nombre: string; sub: string }> = {
  marca: { simbolo: 'text-fez-700', nombre: 'text-tinta-900', sub: 'text-granate-700' },
  tinta: { simbolo: 'text-tinta-900', nombre: 'text-tinta-900', sub: 'text-tinta-900' },
  claro: { simbolo: 'text-noche-ink', nombre: 'text-noche-ink', sub: 'text-granate-200' },
}

/**
 * Logotipo horizontal: símbolo + «Zellige» en Marcellus con espaciado ancho y el
 * apellido («Hotels», «ERP») debajo. El texto es real (se lee y se traduce); las
 * mayúsculas las pone el CSS para que el lector de pantalla no deletree.
 */
export function Logotipo({
  tono = 'marca',
  sub = 'Hotels',
  size = 'md',
  className = '',
  animado = false,
}: {
  tono?: Tono
  sub?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** El arco se dibuja con un trazo y se enciende la clave: al cargar y al pasar el ratón (Rive, carga perezosa). */
  animado?: boolean
}) {
  const c = TONOS[tono]
  const vivo = useSimboloVivo({ activo: animado, tono: tono === 'claro' ? 'claro' : 'marca' })
  const s = {
    sm: { simbolo: 28, nombre: 'text-[1.0625rem]', sub: 'text-[0.5625rem]', gap: 'gap-2.5' },
    md: { simbolo: 34, nombre: 'text-[1.25rem]', sub: 'text-[0.5625rem]', gap: 'gap-3' },
    lg: { simbolo: 64, nombre: 'text-[2.25rem]', sub: 'text-[0.875rem]', gap: 'gap-5' },
  }[size]
  return (
    <span
      className={`inline-flex items-center ${s.gap} ${className}`}
      onPointerEnter={animado ? (e) => e.pointerType === 'mouse' && vivo.reproducir() : undefined}
    >
      <span
        ref={vivo.caja}
        data-rive={vivo.lista ? 'lista' : 'imagen'}
        className="simbolo-vivo relative inline-flex shrink-0"
        style={{ width: s.simbolo, height: s.simbolo }}
      >
        <Simbolo size={s.simbolo} className={c.simbolo} />
        {animado && <canvas ref={vivo.lienzo} aria-hidden className="pointer-events-none absolute inset-0 size-full" />}
      </span>
      <span className="font-display flex flex-col uppercase leading-none">
        <span className={`${s.nombre} tracking-[0.14em] ${c.nombre}`}>Zellige</span>
        <span className={`${s.sub} mt-[0.35em] pl-[0.08em] tracking-[0.62em] ${c.sub}`}>{sub}</span>
      </span>
    </span>
  )
}
