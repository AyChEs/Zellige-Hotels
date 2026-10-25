// Convierte las fotos originales (JPG) a AVIF y WebP en varios anchos.
// Uso: node plan/herramientas/optimizar-fotos.mjs <carpeta-con-originales> <carpeta-salida>
// Necesita `sharp` (npm i sharp en una carpeta temporal; no es dependencia del proyecto).
import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const require = createRequire(process.env.SHARP_DIR ? join(process.env.SHARP_DIR, 'x.js') : import.meta.url)
const sharp = require('sharp')

const [origen, destino] = process.argv.slice(2)
mkdirSync(destino, { recursive: true })

const FOTOS = {
  hero: { archivo: 'zellige-hero.jpg', anchos: [640, 1024, 1672] },
  granada: { archivo: 'zellige-granada.jpg', anchos: [480, 800, 1122] },
  marrakech: { archivo: 'zellige-marrakech.jpg', anchos: [480, 800, 1122] },
  barcelona: { archivo: 'zellige-barcelona.jpg', anchos: [480, 800, 1122] },
  textura: { archivo: 'zellige-textura.jpg', anchos: [640, 1254] },
}

for (const [nombre, { archivo, anchos }] of Object.entries(FOTOS)) {
  for (const w of anchos) {
    const base = sharp(join(origen, archivo)).resize({ width: w, withoutEnlargement: true })
    await base.clone().avif({ quality: 52, effort: 6 }).toFile(join(destino, `${nombre}-${w}.avif`))
    await base.clone().webp({ quality: 74, effort: 6 }).toFile(join(destino, `${nombre}-${w}.webp`))
  }
}
console.log('listo')
