// Genera los SVG de la marca Zellige: símbolo, logotipos y favicon.
// Uso: cd docs/marca && npm i --no-save opentype.js@1.3.4 && node generar.mjs . ../../frontend/public/identidad
import opentype from 'opentype.js'
import fs from 'fs'
import path from 'path'

const FUENTE = new URL('../../frontend/node_modules/@fontsource/marcellus/files/marcellus-latin-400-normal.woff', import.meta.url)
const font = opentype.parse((b => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength))(fs.readFileSync(FUENTE)))
const salida = process.argv.slice(2)
const C = { fez: '#1E5B46', tinta: '#1C211F', granate: '#8B2E3C', cal: '#FAF8F4', noche: '#18231F', calTexto: '#EDEAE3', rosa: '#E2B9BF' }

// Símbolo en 64x64: tesela de esquinas suaves con dos vacíos, la puerta (arco de herradura
// abierto por abajo) y la clave (rombo) sobre ella.
const ARCO = { cx: 32, cy: 30, r: 15, w: 13.4 } // w = media luz de las jambas
const resalte = Math.sqrt(ARCO.r ** 2 - ARCO.w ** 2) // cuánto baja el arco por debajo del centro
function teselaPath(x = 0, y = 0, s = 1) {
  const f = (n) => +(n * s).toFixed(3)
  const R = 14, L = 64
  const X = (n) => f(n) + x, Y = (n) => f(n) + y
  const { cx, cy, r, w } = ARCO
  // Un solo contorno: la base de la tesela se interrumpe en la puerta (sin solapes de trazado).
  const tile = `M${X(cx - w)} ${Y(L)}V${Y(cy + resalte)}A${f(r)} ${f(r)} 0 1 1 ${X(cx + w)} ${Y(cy + resalte)}V${Y(L)}H${X(L - R)}A${f(R)} ${f(R)} 0 0 0 ${X(L)} ${Y(L - R)}V${Y(R)}A${f(R)} ${f(R)} 0 0 0 ${X(L - R)} ${Y(0)}H${X(R)}A${f(R)} ${f(R)} 0 0 0 ${X(0)} ${Y(R)}V${Y(L - R)}A${f(R)} ${f(R)} 0 0 0 ${X(R)} ${Y(L)}Z`
  const puerta = ''
  const k = 3.8, ky = 7.8
  const clave = `M${X(cx)} ${Y(ky - k)}L${X(cx + k)} ${Y(ky)}L${X(cx)} ${Y(ky + k)}L${X(cx - k)} ${Y(ky)}Z`
  return `${tile}${puerta}${clave}`
}
function texto(str, x, y, size, tracking) {
  let cx = x, d = ''
  const glyphs = font.stringToGlyphs(str)
  glyphs.forEach((g, i) => {
    d += g.getPath(cx, y, size).toPathData(2)
    cx += (g.advanceWidth / font.unitsPerEm) * size + (i < glyphs.length - 1 ? tracking * size : 0)
  })
  return { d, ancho: cx - x }
}
const svg = (w, h, body, titulo) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${titulo}"><title>${titulo}</title>${body}</svg>\n`

// La tesela recortada: evenodd hace de la puerta y la clave dos vacíos.
const simbolo = (color, x = 0, y = 0, s = 1) => `<path fill="${color}" fill-rule="evenodd" d="${teselaPath(x, y, s)}"/>`

const out = {}
out['simbolo.svg'] = svg(64, 64, simbolo(C.fez), 'Zellige Hotels')
out['simbolo-mono.svg'] = svg(64, 64, simbolo(C.tinta), 'Zellige Hotels')
out['simbolo-claro.svg'] = svg(64, 64, simbolo(C.calTexto), 'Zellige Hotels')

// Logotipo horizontal: símbolo de 64 + ZELLIGE (Marcellus, espaciado .14em) sobre HOTELS (.42em).
function horizontal(cSim, cNombre, cHotels) {
  const nombre = texto('ZELLIGE', 88, 40, 36, 0.14)
  const hotels = texto('HOTELS', 89, 61, 13.5, 0.62)
  const ancho = Math.ceil(Math.max(88 + nombre.ancho, 89 + hotels.ancho)) + 2
  return [ancho, simbolo(cSim) + `<path fill="${cNombre}" d="${nombre.d}"/><path fill="${cHotels}" d="${hotels.d}"/>`]
}
for (const [nombre, cs] of [
  ['logotipo-horizontal.svg', [C.fez, C.tinta, C.granate]],
  ['logotipo-mono.svg', [C.tinta, C.tinta, C.tinta]],
  ['logotipo-claro.svg', [C.calTexto, C.calTexto, C.rosa]],
]) {
  const [w, body] = horizontal(...cs)
  out[nombre] = svg(w, 64, body, 'Zellige Hotels')
}
// Logotipo apilado (para el pie, la imagen OG y la página de marca).
{
  const n = texto('ZELLIGE', 0, 0, 48, 0.14)
  const h = texto('HOTELS', 0, 0, 16, 0.62)
  const W = Math.ceil(n.ancho) + 4
  const nn = texto('ZELLIGE', (W - n.ancho) / 2, 140, 48, 0.14)
  const hh = texto('HOTELS', (W - h.ancho) / 2, 170, 16, 0.62)
  out['logotipo-apilado.svg'] = svg(W, 176, simbolo(C.fez, (W - 72) / 2, 0, 72 / 64) + `<path fill="${C.tinta}" d="${nn.d}"/><path fill="${C.granate}" d="${hh.d}"/>`, 'Zellige Hotels')
}
// Nombre a todo el ancho, para el pie: solo letras, color heredado.
{
  const n = texto('ZELLIGE', 0, 0, 200, 0.06)
  const bb = font.getPath('ZELLIGE', 0, 0, 200).getBoundingBox()
  const nn = texto('ZELLIGE', 0, -bb.y1, 200, 0.06)
  out['nombre-ancho.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.ceil(n.ancho)} ${Math.ceil(bb.y2 - bb.y1)}" aria-hidden="true"><path fill="currentColor" d="${nn.d}"/></svg>\n`
}
// Favicon: el símbolo solo, con el color de la marca. Se ve en pestañas claras y oscuras.
out['favicon.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${simbolo(C.fez)}</svg>\n`

for (const dir of salida) {
  fs.mkdirSync(dir, { recursive: true })
  for (const [f, c] of Object.entries(out)) fs.writeFileSync(path.join(dir, f), c)
}
console.log(Object.keys(out).join(' '))
