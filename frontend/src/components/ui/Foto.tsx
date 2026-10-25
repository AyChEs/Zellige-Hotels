import type { ImgHTMLAttributes } from 'react'
import type { HotelDto } from '../../api/types'
import { fotoPropia, srcPorDefecto, srcset, type FotoLocal } from '../../lib/fotos'

interface FotoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'> {
  foto: FotoLocal
  /** Atributo `sizes`: ancho que ocupa la foto en pantalla. */
  sizes: string
}

/** Foto propia con AVIF, WebP y varios anchos. Lleva width y height del original (sin CLS). */
export function Foto({ foto, sizes, alt, ...props }: FotoProps) {
  return (
    <picture className="contents">
      <source type="image/avif" srcSet={srcset(foto, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(foto, 'webp')} sizes={sizes} />
      <img src={srcPorDefecto(foto)} alt={alt} width={foto.ancho} height={foto.alto} decoding="async" {...props} />
    </picture>
  )
}

interface FotoHotelProps extends Omit<FotoProps, 'foto'> {
  hotel: Pick<HotelDto, 'city' | 'imageUrl'> | undefined | null
}

/** Foto de un hotel: la propia (en `public/img`) o, si no la tiene, la que devuelve la API. */
export function FotoHotel({ hotel, sizes, alt, ...props }: FotoHotelProps) {
  const propia = fotoPropia(hotel)
  if (propia) return <Foto foto={propia} sizes={sizes} alt={alt} {...props} />
  if (!hotel?.imageUrl) return null
  return <img src={hotel.imageUrl} alt={alt} width={1200} height={800} decoding="async" {...props} />
}
