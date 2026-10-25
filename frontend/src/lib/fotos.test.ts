import { describe, expect, it } from 'vitest'
import { fotoPropia, srcPorDefecto, srcset } from './fotos'

describe('fotos propias', () => {
  it('asigna la foto de cada hotel por su ciudad', () => {
    expect(fotoPropia({ city: 'Granada' })?.nombre).toBe('granada')
    expect(fotoPropia({ city: 'Marrakech' })?.nombre).toBe('marrakech')
    expect(fotoPropia({ city: 'Barcelona' })?.nombre).toBe('barcelona')
  })

  it('devuelve null si el hotel no tiene foto propia', () => {
    expect(fotoPropia({ city: 'Lisboa' })).toBeNull()
    expect(fotoPropia(undefined)).toBeNull()
  })

  it('arma el srcset con todos los anchos', () => {
    const f = fotoPropia({ city: 'Granada' })!
    expect(srcset(f, 'avif')).toBe('/img/granada-480.avif 480w, /img/granada-800.avif 800w, /img/granada-1122.avif 1122w')
    expect(srcPorDefecto(f)).toBe('/img/granada-800.webp')
  })
})
