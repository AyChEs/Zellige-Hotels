// Servidor HTTP con la API simulada en el puerto 8080 (o $PORT), para `vite preview`
// o Lighthouse sin backend. Solo datos de prueba: no guarda nada.
import http from 'http'
import { responder, fotoSustituta } from './api-simulada.mjs'

const puerto = Number(process.env.PORT ?? 8080)
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  if (url.pathname.startsWith('/foto/')) {
    res.writeHead(200, { 'content-type': 'image/svg+xml' })
    return res.end(fotoSustituta(url.pathname))
  }
  let datos = ''
  req.on('data', (c) => { datos += c })
  req.on('end', () => {
    let cuerpo = null
    try { cuerpo = datos ? JSON.parse(datos) : null } catch { cuerpo = null }
    const r = responder(req.method, url.pathname, url.searchParams, cuerpo)
    const [estado, json] = r ?? [404, { title: 'Not Found', status: 404, detail: url.pathname }]
    res.writeHead(estado, { 'content-type': 'application/json' })
    res.end(json == null ? '' : JSON.stringify(json))
  })
}).listen(puerto, () => console.log(`API simulada en http://localhost:${puerto}`))
