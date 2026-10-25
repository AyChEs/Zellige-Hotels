import { act, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { moverPieza, soltarPiezas } from '../piezas'

const estado = vi.hoisted(() => ({ quieto: false, libre: true }))
vi.mock('../../motion/preferencias', () => ({
  useMenosMovimiento: () => estado.quieto,
  useNavegadorLibre: () => estado.libre,
}))

const cargarTodo = vi.hoisted(() => vi.fn())
vi.mock('../cargador', () => ({ cargarTodo }))

import { PiezaRive } from '../PiezaRive'
import { Logotipo } from '../../components/brand/Marca'

/** Un Rive falso: llama a onLoad y expone la entrada «progreso» y el color. */
function falsoRuntime(entradas: { progreso: { value: number }; colores: Record<string, { value: number }> }) {
  class Rive {
    viewModelInstance = {
      number: (n: string) => (n === 'progreso' ? entradas.progreso : null),
      color: (n: string) => entradas.colores[n] ?? null,
    }
    cleanup = vi.fn()
    resizeDrawingSurfaceToCanvas = vi.fn()
    constructor(opts: { onLoad?: () => void }) {
      queueMicrotask(() => opts.onLoad?.())
    }
  }
  class Layout {}
  return [{ Rive, Layout, Fit: { Contain: 'contain' }, Alignment: { Center: 'center' } }, new ArrayBuffer(8)]
}

let cerca: (() => void) | null = null
beforeEach(() => {
  estado.quieto = false
  estado.libre = true
  cargarTodo.mockReset()
  soltarPiezas()
  cerca = null
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(fn: (e: { isIntersecting: boolean }[]) => void) {
        cerca = () => fn([{ isIntersecting: true }])
      }
      observe() {}
      disconnect() {}
    },
  )
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} })
})

describe('PiezaRive', () => {
  it('siempre trae la imagen fija y un lienzo oculto a los lectores de pantalla', () => {
    const { container } = render(<PiezaRive pieza="fechas" />)
    const img = container.querySelector('img')!
    expect(img.getAttribute('src')).toBe('/rive/fechas.svg')
    expect(img.getAttribute('alt')).toBe('')
    expect(container.querySelector('canvas')!.getAttribute('aria-hidden')).toBe('true')
  })

  it('no carga el runtime si la pieza está lejos de la pantalla', () => {
    render(<PiezaRive pieza="fechas" />)
    expect(cargarTodo).not.toHaveBeenCalled()
  })

  it('con prefers-reduced-motion se queda la imagen fija: no se pide el runtime', () => {
    estado.quieto = true
    const { container } = render(<PiezaRive pieza="solapes" />)
    act(() => cerca?.())
    expect(cargarTodo).not.toHaveBeenCalled()
    expect(container.firstElementChild!.getAttribute('data-rive')).toBe('imagen')
  })

  it('si el runtime no carga se queda la imagen fija', async () => {
    cargarTodo.mockRejectedValue(new Error('sin red'))
    const { container } = render(<PiezaRive pieza="factura" />)
    act(() => cerca?.())
    await waitFor(() => expect(cargarTodo).toHaveBeenCalledWith('reservar'))
    expect(container.firstElementChild!.getAttribute('data-rive')).toBe('imagen')
  })

  it('al cargar, el scroll mueve la entrada «progreso»', async () => {
    const progreso = { value: -1 }
    cargarTodo.mockResolvedValue(falsoRuntime({ progreso, colores: {} }))
    const { container } = render(<PiezaRive pieza="confirmacion" />)
    act(() => cerca?.())
    await waitFor(() => expect(container.firstElementChild!.getAttribute('data-rive')).toBe('lista'))
    expect(progreso.value).toBe(1) // nadie al mando: estado final
    act(() => moverPieza('confirmacion', 0.4))
    expect(progreso.value).toBe(0.4)
  })
})

describe('Logotipo animado', () => {
  it('sin animar no lleva lienzo', () => {
    const { container } = render(<Logotipo />)
    expect(container.querySelector('canvas')).toBeNull()
    expect(container.querySelector('svg')).not.toBeNull()
  })

  it('animado lleva el símbolo SVG debajo y un lienzo decorativo', () => {
    const { container } = render(<Logotipo animado />)
    expect(container.querySelector('svg')).not.toBeNull()
    expect(container.querySelector('canvas')!.getAttribute('aria-hidden')).toBe('true')
    expect(screen.getByText('Zellige')).toBeTruthy()
  })

  it('al cargar pinta el símbolo y lo anima; sobre fondo oscuro cambia los colores', async () => {
    const progreso = { value: -1 }
    const colores = { tesela: { value: 0 }, luz: { value: 0 } }
    cargarTodo.mockResolvedValue(falsoRuntime({ progreso, colores }))
    const { container } = render(<Logotipo tono="claro" animado />)
    act(() => cerca?.())
    await waitFor(() => expect(container.querySelector('.simbolo-vivo')!.getAttribute('data-rive')).toBe('lista'))
    expect(cargarTodo).toHaveBeenCalledWith('logotipo')
    expect(progreso.value).toBe(0)
    expect(colores.tesela.value).toBe(0xffedeae3)
    expect(colores.luz.value).toBe(0xffe2b9bf)
  })

  it('con prefers-reduced-motion no se carga nada', () => {
    estado.quieto = true
    render(<Logotipo animado />)
    act(() => cerca?.())
    expect(cargarTodo).not.toHaveBeenCalled()
  })
})
