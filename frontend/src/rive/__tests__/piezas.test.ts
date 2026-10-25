import { afterEach, describe, expect, it, vi } from 'vitest'
import { moverPieza, progresoDe, soltarPiezas, suscribirPieza } from '../piezas'

afterEach(() => soltarPiezas())

describe('puente scroll → piezas de Rive', () => {
  it('sin nadie al mando, las piezas están en su estado final', () => {
    expect(progresoDe('fechas')).toBe(1)
  })

  it('el que se suscribe recibe el valor actual y los cambios', () => {
    moverPieza('solapes', 0.25)
    const aviso = vi.fn()
    const baja = suscribirPieza('solapes', aviso)
    expect(aviso).toHaveBeenLastCalledWith(0.25)
    moverPieza('solapes', 0.6)
    expect(aviso).toHaveBeenLastCalledWith(0.6)
    baja()
    moverPieza('solapes', 0.9)
    expect(aviso).toHaveBeenCalledTimes(2)
  })

  it('acota a 0..1 y no avisa si el valor no cambia', () => {
    const aviso = vi.fn()
    suscribirPieza('factura', aviso)
    aviso.mockClear()
    moverPieza('factura', -3)
    moverPieza('factura', 0)
    moverPieza('factura', 7)
    expect(aviso.mock.calls.map((c) => c[0])).toEqual([0, 1])
  })

  it('cada pieza tiene su propio progreso', () => {
    moverPieza('fechas', 0.1)
    moverPieza('confirmacion', 0.8)
    expect(progresoDe('fechas')).toBe(0.1)
    expect(progresoDe('confirmacion')).toBe(0.8)
    expect(progresoDe('factura')).toBe(1)
  })

  it('soltarPiezas devuelve todo al estado final', () => {
    moverPieza('fechas', 0.1)
    const aviso = vi.fn()
    suscribirPieza('fechas', aviso)
    soltarPiezas()
    expect(aviso).toHaveBeenLastCalledWith(1)
    expect(progresoDe('fechas')).toBe(1)
  })
})
