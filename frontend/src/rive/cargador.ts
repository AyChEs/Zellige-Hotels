import wasmUrl from '@rive-app/canvas-lite/rive.wasm?url'

/*
 * Carga perezosa del runtime de Rive (@rive-app/canvas-lite, MIT) y de los archivos .riv.
 * Nada de esto entra en el paquete inicial: solo se pide cuando una pieza va a verse, en las
 * rutas públicas y sin prefers-reduced-motion. El .wasm sale de la propia web (no del CDN
 * por defecto de Rive) y se cachea con el resto de recursos.
 */

export type RuntimeRive = typeof import('@rive-app/canvas-lite')
export type ArchivoRiv = 'reservar' | 'logotipo'

let runtime: Promise<RuntimeRive> | null = null
const archivos = new Map<ArchivoRiv, Promise<ArrayBuffer>>()

export function cargarRuntime(): Promise<RuntimeRive> {
  if (!runtime) {
    runtime = import('@rive-app/canvas-lite').then((m) => {
      m.RuntimeLoader.setWasmUrl(wasmUrl)
      return m
    })
    // Si falla, la próxima pieza puede intentarlo otra vez.
    runtime.catch(() => {
      runtime = null
    })
  }
  return runtime
}

export function cargarRiv(nombre: ArchivoRiv): Promise<ArrayBuffer> {
  let p = archivos.get(nombre)
  if (!p) {
    p = fetch(`/rive/${nombre}.riv`).then((r) => {
      if (!r.ok) throw new Error(`No se pudo cargar ${nombre}.riv (${r.status})`)
      return r.arrayBuffer()
    })
    p.catch(() => archivos.delete(nombre))
    archivos.set(nombre, p)
  }
  return p
}

/** El runtime y el archivo, juntos. */
export function cargarTodo(nombre: ArchivoRiv) {
  return Promise.all([cargarRuntime(), cargarRiv(nombre)])
}
