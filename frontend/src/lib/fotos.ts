import type { HotelDto } from '../api/types'

/**
 * Fotos propias de la marca (imágenes generadas con IA por Ayman Charoui, sin derechos de
 * terceros; ver docs/MARCA.md). Están en `public/img/` como AVIF y WebP en varios anchos
 * (`plan/herramientas/optimizar-fotos.mjs`). La foto de cada hotel manda sobre la que
 * devuelve la API; si un hotel nuevo no tiene foto propia, se usa la de la API.
 */
export interface FotoLocal {
  /** Prefijo del archivo: `/img/<nombre>-<ancho>.avif|webp`. */
  nombre: string
  anchos: number[]
  /** Medidas del original: fijan la proporción y evitan el salto de diseño. */
  ancho: number
  alto: number
}

const RETRATO = (nombre: string): FotoLocal => ({ nombre, anchos: [480, 800, 1122], ancho: 1122, alto: 1402 })

export const FOTO_PORTADA: FotoLocal = { nombre: 'hero', anchos: [640, 1024, 1672], ancho: 1672, alto: 941 }
export const FOTO_TEXTURA: FotoLocal = { nombre: 'textura', anchos: [640, 1254], ancho: 1254, alto: 1254 }

const PROPIAS: Record<string, FotoLocal> = {
  Granada: RETRATO('granada'),
  Marrakech: RETRATO('marrakech'),
  Barcelona: RETRATO('barcelona'),
}

/** Foto propia de un hotel por su ciudad, o null si no la tiene. */
export function fotoPropia(hotel: Pick<HotelDto, 'city'> | undefined | null): FotoLocal | null {
  return (hotel && PROPIAS[hotel.city]) || null
}

/** Cualquier foto del hotel: la propia o, si no hay, la de la API. */
export function hayFoto(hotel: Pick<HotelDto, 'city' | 'imageUrl'> | undefined | null): boolean {
  return !!hotel && (!!fotoPropia(hotel) || !!hotel.imageUrl)
}

export const srcset = (f: FotoLocal, formato: 'avif' | 'webp') =>
  f.anchos.map((w) => `/img/${f.nombre}-${w}.${formato} ${w}w`).join(', ')

export const srcPorDefecto = (f: FotoLocal) => `/img/${f.nombre}-${f.anchos[Math.floor(f.anchos.length / 2)]}.webp`
