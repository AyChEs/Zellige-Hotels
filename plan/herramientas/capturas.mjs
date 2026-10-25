// Capturas y axe a 390 y 1440 px.
// Uso: SPA=1 node capturas.mjs NN http://localhost:5173 '[{"id":"landing","url":"/"}]' '{"url":"/login",...}'
// Variables opcionales:
//   CAPT_DIR   carpeta con node_modules de playwright y @axe-core/playwright (por defecto /tmp/capt);
//              las capturas quedan en $CAPT_DIR/out/NN/.
//   SIMULAR=1  usa la API simulada de api-simulada.mjs en vez de la real (sin red hacia Render).
//   FOTOS_REALES=1  con SIMULAR, deja cargar las fotos reales de Unsplash.
// Campos opcionales de cada página: "login": [correo, clave], "click": selector que se pulsa
// antes de capturar, "full": true para capturar la página entera.
import { createRequire } from 'module'
import fs from 'fs'
import path from 'path'
import { instalarApiSimulada } from './api-simulada.mjs'

const dir = process.env.CAPT_DIR ?? '/tmp/capt'
const require = createRequire(path.join(dir, 'package.json'))
const { chromium } = require('playwright')
const AxeBuilder = require('@axe-core/playwright').default

const [,, name, base, pagesJson, loginJson] = process.argv
const pages = JSON.parse(pagesJson)
const login = loginJson ? JSON.parse(loginJson) : null
const out = path.join(dir, 'out', name); fs.mkdirSync(out, { recursive: true })
const spa = process.env.SPA === '1'
async function go(page, url) {
  if (!spa) return page.goto(base + url, { waitUntil: 'networkidle', timeout: 90000 })
  if (!page.url().startsWith(base)) await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 90000 })
  await page.evaluate(u => { history.pushState({}, '', u); dispatchEvent(new PopStateEvent('popstate')) }, url)
  await page.waitForLoadState('networkidle')
}
const browser = await chromium.launch()
const report = []
for (const w of [390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 }, locale: 'es-ES' })
  const page = await ctx.newPage()
  if (process.env.SIMULAR === '1') await instalarApiSimulada(page)
  const errors = []; page.on('console', m => m.type() === 'error' && errors.push(m.text()))
  for (const p of pages) {
    if (p.login && login) {
      await ctx.clearCookies(); await page.goto(base + '/', { waitUntil: 'networkidle' })
      await page.evaluate(() => localStorage.clear())
      await go(page, login.url); await page.waitForTimeout(1500)
      await page.fill(login.user, p.login[0]); await page.fill(login.pass, p.login[1])
      await page.click(login.submit); await page.waitForTimeout(process.env.SIMULAR === '1' ? 1500 : 4000)
    }
    try { await go(page, p.url) } catch (e) { report.push({ url: p.url, w, err: String(e).slice(0, 200) }); continue }
    await page.waitForTimeout(1500)
    if (p.click) { await page.click(p.click); await page.waitForTimeout(800) }
    await page.screenshot({ path: `${out}/${p.id}-${w}.png`, fullPage: !!p.full })
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    const hx = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
    report.push({ id: p.id, url: p.url, w, hscroll: hx, violations: r.violations.map(v => `${v.impact} ${v.id} (${v.nodes.length}): ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | ')}`) })
  }
  report.push({ w, consoleErrors: errors.slice(0, 10) })
  await ctx.close()
}
await browser.close()
fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 1))
console.log(JSON.stringify(report, null, 1))
