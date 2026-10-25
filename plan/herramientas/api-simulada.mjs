// API simulada para capturas y axe sin depender de Render.
// Uso: import { instalarApiSimulada } from './api-simulada.mjs'; await instalarApiSimulada(page)
// Intercepta /api/** y las fotos de Unsplash. Los datos se calculan respecto a hoy,
// así el panel nunca sale vacío. Las escrituras responden con datos plausibles y no
// guardan nada.

const DIA = 86_400_000
const iso = (d) => new Date(d).toISOString().slice(0, 10)
const hoy = () => { const d = new Date(); d.setHours(12, 0, 0, 0); return d.getTime() }
const masDias = (n) => iso(hoy() + n * DIA)

export const categorias = [
  { id: 1, name: 'Luxury 5 Stars', starRating: 5, description: 'Premium hotels with full-service amenities' },
  { id: 2, name: 'Business 4 Stars', starRating: 4, description: 'Comfortable hotels for business travellers' },
  { id: 3, name: 'Standard 3 Stars', starRating: 3, description: 'Well-equipped mid-range hotels' },
  { id: 4, name: 'Boutique', starRating: 4, description: 'Small design-led hotels with character' },
]

export const hoteles = [
  { id: 1, name: 'Alhambra Palace', address: 'Plaza Arquitecto Garcia de Paredes 1', city: 'Granada', country: 'Spain', phone: '+34 958 221 468', email: 'info@alhambrapalace.example', description: 'Moorish-inspired luxury overlooking the Alhambra.', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', active: true, category: categorias[0] },
  { id: 2, name: 'Marrakech Riad Andalus', address: 'Derb Sidi Bouloukat 12', city: 'Marrakech', country: 'Morocco', phone: '+212 524 391 234', email: 'contact@riadandalus.example', description: 'Traditional riad with arabesque courtyards and rooftop terrace.', imageUrl: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200', active: true, category: categorias[3] },
  { id: 3, name: 'Barcelona Business Tower', address: 'Avinguda Diagonal 640', city: 'Barcelona', country: 'Spain', phone: '+34 934 052 000', email: 'stay@bcntower.example', description: 'Modern business hotel in the heart of the city.', imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200', active: true, category: categorias[1] },
]

const FOTO = {
  SINGLE: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900',
  DOUBLE: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900',
  TRIPLE: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=900',
  SUITE: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900',
}
const hab = (id, number, floor, type, status, capacity, description, price, hb, fb, hotelId) => ({
  id, number, floor, type, status, capacity, description, imageUrl: FOTO[type], pricePerNight: price,
  halfBoardSupplement: hb, fullBoardSupplement: fb, hotelId, hotelName: hoteles[hotelId - 1].name,
})
export const habitaciones = [
  hab(1, '101', 1, 'SINGLE', 'AVAILABLE', 1, 'Cozy single with garden view', 85, 15, 28, 1),
  hab(2, '102', 1, 'DOUBLE', 'OCCUPIED', 2, 'Double room with Alhambra view', 140, 20, 36, 1),
  hab(3, '201', 2, 'DOUBLE', 'AVAILABLE', 2, 'Superior double with balcony', 165, 20, 36, 1),
  hab(4, '301', 3, 'SUITE', 'CLEANING', 4, 'Royal suite with private terrace', 420, 35, 60, 1),
  hab(5, 'R1', 0, 'DOUBLE', 'AVAILABLE', 2, 'Riad double around the central courtyard', 110, 18, 30, 2),
  hab(6, 'R2', 0, 'TRIPLE', 'OCCUPIED', 3, 'Family riad room with mosaic details', 150, 22, 38, 2),
  hab(7, 'R3', 1, 'SUITE', 'AVAILABLE', 4, 'Terrace suite with plunge pool', 280, 30, 50, 2),
  hab(8, '1201', 12, 'SINGLE', 'AVAILABLE', 1, 'Executive single, city view', 95, 16, 29, 3),
  hab(9, '1202', 12, 'DOUBLE', 'OCCUPIED', 2, 'Executive double, city view', 130, 18, 32, 3),
  hab(10, '1501', 15, 'SUITE', 'MAINTENANCE', 4, 'Panoramic suite (under maintenance)', 350, 30, 55, 3),
]

export const clientes = [
  ['Ayman', 'Charoui', 'CLI-0001', 'VIP', 'client@hotel-erp.dev'],
  ['Lucía', 'Ortega Ruiz', 'CLI-0002', 'REGULAR', 'lucia.ortega@demo.zellige.test'],
  ['Karim', 'Bennani', 'CLI-0003', 'VIP', 'karim.bennani@demo.zellige.test'],
  ['Marta', 'Puig Soler', 'CLI-0004', 'REGULAR', 'marta.puig@demo.zellige.test'],
  ['Hugo', 'Navarro', 'CLI-0005', 'REGULAR', 'hugo.navarro@demo.zellige.test'],
  ['Salma', 'Idrissi', 'CLI-0006', 'REGULAR', 'salma.idrissi@demo.zellige.test'],
  ['Jordi', 'Vidal Mas', 'CLI-0007', 'VIP', 'jordi.vidal@demo.zellige.test'],
].map(([firstName, lastName, documentId, clientType, email], i) => ({
  id: i + 1, firstName, lastName, documentId, birthDate: `19${80 + i * 3}-0${(i % 9) + 1}-1${i}`,
  phone: `+34 6${10 + i}0 ${200 + i * 37} ${400 + i * 11}`, address: ['Barcelona', 'Sevilla', 'Fez', 'Girona', 'Madrid', 'Rabat', 'Tarragona'][i],
  clientType, registeredAt: new Date(hoy() - (300 - i * 30) * DIA).toISOString(), email,
}))

export const empleados = [
  [1, 'Nadia', 'El Amrani', 'MANAGER', 'ACTIVE', 3800, 1],
  [2, 'Luis', 'Fernandez', 'RECEPTIONIST', 'ACTIVE', 2100, 1],
  [3, 'Yassine', 'Berrada', 'HOUSEKEEPER', 'ACTIVE', 1500, 2],
  [4, 'Carla', 'Domènech', 'RECEPTIONIST', 'ACTIVE', 2050, 3],
  [5, 'Omar', 'Tazi', 'MAINTENANCE', 'ON_LEAVE', 1750, 2],
].map(([id, firstName, lastName, position, status, grossSalary, hotelId]) => ({
  id, firstName, lastName, documentId: `EMP-000${id}`, birthDate: `199${id}-04-12`, phone: `+34 600 1${id}1 22${id}`,
  address: hoteles[hotelId - 1].city, position, status, hiredAt: `202${id % 4}-03-01`, grossSalary, hotelId,
  hotelName: hoteles[hotelId - 1].name, email: id <= 2 ? ['manager@hotel-erp.dev', 'reception@hotel-erp.dev'][id - 1] : null,
}))

const ESTADOS = (inicio, fin) => (fin <= 0 ? 'CHECKED_OUT' : inicio <= 0 ? 'CHECKED_IN' : inicio < 6 ? 'CONFIRMED' : 'PENDING')
const REGIMEN = ['ROOM_ONLY', 'BED_AND_BREAKFAST', 'HALF_BOARD', 'FULL_BOARD']
// [habitación, cliente, día de entrada respecto a hoy, noches, huéspedes]
const PLAN = [
  [2, 1, -1, 3, 2], [6, 3, -2, 4, 3], [9, 4, 0, 2, 2], [1, 5, -6, 2, 1], [3, 2, -12, 3, 2], [5, 6, -9, 2, 2],
  [7, 7, -20, 4, 3], [8, 2, -26, 1, 1], [4, 3, -15, 3, 4], [2, 6, 3, 2, 2], [5, 1, 5, 3, 2], [9, 5, 2, 4, 2],
  [3, 4, 8, 2, 2], [7, 2, 11, 3, 2], [1, 7, 14, 1, 1], [6, 5, 18, 2, 3], [8, 3, 21, 2, 1], [4, 1, 25, 3, 2],
  [3, 6, -4, 2, 2], [5, 4, -17, 2, 2],
]
export const reservas = PLAN.map(([roomId, clientId, inicio, noches, guests], i) => {
  const room = habitaciones[roomId - 1]
  const cli = clientes[clientId - 1]
  const status = i === 19 ? 'CANCELLED' : ESTADOS(inicio, inicio + noches)
  const boardType = REGIMEN[i % 4]
  const sup = boardType === 'HALF_BOARD' ? room.halfBoardSupplement : boardType === 'FULL_BOARD' ? room.fullBoardSupplement : boardType === 'BED_AND_BREAKFAST' ? 12 : 0
  return {
    id: i + 1, code: `ZH-${(48217 + i * 137).toString(36).toUpperCase()}`,
    checkInDate: masDias(inicio), checkOutDate: masDias(inicio + noches), guests, boardType, status,
    totalPrice: Math.round((room.pricePerNight + sup * guests) * noches * 1.1 * 100) / 100,
    notes: i === 2 ? 'Llegada tarde, sobre las 23:00' : null, createdAt: new Date(hoy() - (40 - i) * DIA).toISOString(),
    roomId, roomNumber: room.number, hotelId: room.hotelId, hotelName: room.hotelName,
    clientId, clientFullName: `${cli.firstName} ${cli.lastName}`, invoiceId: null,
  }
})
export const facturas = reservas.filter((r) => r.status === 'CHECKED_OUT' || r.status === 'CHECKED_IN').map((r, i) => {
  const subtotal = Math.round((r.totalPrice / 1.1) * 100) / 100
  r.invoiceId = i + 1
  return {
    id: i + 1, invoiceNumber: `F-2026-${String(311 + i).padStart(5, '0')}`, issuedAt: new Date(Date.parse(r.checkOutDate)).toISOString(),
    subtotal, vatRate: 10, vatAmount: Math.round((r.totalPrice - subtotal) * 100) / 100, total: r.totalPrice,
    paymentMethod: ['CARD', 'CASH', 'BANK_TRANSFER'][i % 3], status: r.status === 'CHECKED_IN' ? 'ISSUED' : i % 4 === 3 ? 'ISSUED' : 'PAID',
    bookingId: r.id, bookingCode: r.code, clientId: r.clientId, clientFullName: r.clientFullName, hotelName: r.hotelName,
  }
})

const tarea = (id, title, type, status, priority, dias, roomId, asignados) => {
  const room = roomId ? habitaciones[roomId - 1] : null
  const hotelId = room ? room.hotelId : 1
  return {
    id, title, description: null, type, status, priority, dueDate: dias == null ? null : masDias(dias),
    completedAt: status === 'DONE' ? new Date(hoy() - DIA).toISOString() : null, hotelId, hotelName: hoteles[hotelId - 1].name,
    roomId, roomNumber: room?.number ?? null, assignees: asignados.map((e) => ({ id: e, fullName: `${empleados[e - 1].firstName} ${empleados[e - 1].lastName}` })),
  }
}
export const tareas = [
  tarea(1, 'Limpieza tras salida', 'CLEANING', 'PENDING', 'HIGH', 0, 4, [3]),
  tarea(2, 'Revisar aire acondicionado', 'MAINTENANCE', 'IN_PROGRESS', 'URGENT', 0, 10, [5]),
  tarea(3, 'Cambiar ropa de cama', 'CLEANING', 'PENDING', 'MEDIUM', 1, 6, [3]),
  tarea(4, 'Reponer minibar', 'OTHER', 'DONE', 'LOW', -1, 2, [2]),
  tarea(5, 'Pintar barandilla de la terraza', 'MAINTENANCE', 'PENDING', 'LOW', 6, 7, []),
  tarea(6, 'Limpieza a fondo de la suite', 'CLEANING', 'IN_PROGRESS', 'MEDIUM', 0, 4, [3]),
  tarea(7, 'Revisar cerradura electrónica', 'MAINTENANCE', 'DONE', 'HIGH', -2, 9, [4]),
]

const ingresosMes = facturas.filter((f) => f.issuedAt.slice(0, 7) === masDias(0).slice(0, 7)).reduce((s, f) => s + f.total, 0)
const resumen = () => {
  const porEstado = {}
  for (const r of reservas) porEstado[r.status] = (porEstado[r.status] ?? 0) + 1
  const ocupadas = reservas.filter((r) => r.status === 'CHECKED_IN').length
  return {
    totalHotels: 3, totalRooms: 10, occupiedRoomsToday: ocupadas, occupancyRateToday: Math.round((ocupadas / 10) * 1000) / 10,
    bookingsThisMonth: reservas.filter((r) => r.checkInDate.slice(0, 7) === masDias(0).slice(0, 7)).length,
    revenueThisMonth: Math.round((ingresosMes || 2841.6) * 100) / 100, pendingTasks: tareas.filter((t) => t.status === 'PENDING').length,
    bookingsByStatus: porEstado,
  }
}
const ingresos = () => {
  const base = [8120, 9340, 7610, 10480, 12950, 15320, 18740, 17210, 13880, 11420, 9960, 0]
  const d = new Date(hoy())
  return base.map((v, i) => {
    const m = new Date(d.getFullYear(), d.getMonth() - 11 + i, 1)
    return { month: `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`, revenue: i === 11 ? resumen().revenueThisMonth : v }
  })
}
const ocupacion = (from, to) => {
  const out = []
  for (let t = Date.parse(from); t <= Date.parse(to); t += DIA) {
    const dia = iso(t)
    const n = reservas.filter((r) => r.status !== 'CANCELLED' && r.checkInDate <= dia && r.checkOutDate > dia).length
    out.push({ date: dia, occupiedRooms: n, totalRooms: 10, rate: Math.round((n / 10) * 1000) / 10 })
  }
  return out
}

export const usuarios = {
  'admin@hotel-erp.dev': { id: 1, role: 'ADMIN' },
  'manager@hotel-erp.dev': { id: 2, role: 'MANAGER' },
  'reception@hotel-erp.dev': { id: 3, role: 'RECEPTIONIST' },
  'client@hotel-erp.dev': { id: 4, role: 'CLIENT' },
}
const tokens = (email) => ({
  accessToken: `acceso-${email}`, refreshToken: `refresco-${email}`, tokenType: 'Bearer', expiresInSeconds: 900,
  user: { id: usuarios[email].id, email, role: usuarios[email].role },
})

const pagina = (lista, q) => {
  const size = Number(q.get('size') ?? 20)
  const page = Number(q.get('page') ?? 0)
  return { content: lista.slice(page * size, page * size + size), page, size, totalElements: lista.length, totalPages: Math.max(1, Math.ceil(lista.length / size)) }
}
const contiene = (a, b) => !b || (a ?? '').toLowerCase().includes(b.toLowerCase())

/** Devuelve [estado, cuerpo] o null si la ruta no existe. Pura: sirve también para pruebas. */
export function responder(metodo, ruta, q, cuerpo) {
  const m = (re) => ruta.match(re)
  if (ruta === '/api/health') return [200, { status: 'UP' }]
  if (ruta === '/api/auth/login') {
    const u = usuarios[cuerpo?.email]
    return u ? [200, tokens(cuerpo.email)] : [401, { title: 'Unauthorized', status: 401, detail: 'Bad credentials' }]
  }
  if (ruta === '/api/auth/refresh') {
    const email = String(cuerpo?.refreshToken ?? '').replace('refresco-', '')
    return usuarios[email] ? [200, tokens(email)] : [401, { title: 'Unauthorized', status: 401, detail: 'Invalid refresh token' }]
  }
  if (ruta === '/api/auth/logout') return [204, null]
  if (ruta === '/api/categories' && metodo === 'GET') return [200, categorias]
  if (ruta === '/api/hotels' && metodo === 'GET')
    return [200, pagina(hoteles.filter((h) => contiene(h.name, q.get('search')) && contiene(h.city, q.get('city'))), q)]
  if (m(/^\/api\/hotels\/(\d+)$/) && metodo === 'GET') {
    const h = hoteles.find((x) => x.id === Number(m(/(\d+)$/)[1]))
    return h ? [200, h] : [404, { title: 'Not Found', status: 404, detail: 'Hotel not found' }]
  }
  if (ruta === '/api/rooms/available') {
    const g = Number(q.get('guests') ?? 1)
    return [200, habitaciones.filter((r) => r.hotelId === Number(q.get('hotelId')) && r.capacity >= g && r.status !== 'MAINTENANCE')]
  }
  if (ruta === '/api/rooms' && metodo === 'GET')
    return [200, pagina(habitaciones.filter((r) => !q.get('hotelId') || r.hotelId === Number(q.get('hotelId'))), q)]
  if (ruta === '/api/me/bookings' && metodo === 'GET') return [200, pagina(reservas.filter((r) => r.clientId === 1), q)]
  if (ruta === '/api/me/bookings' && metodo === 'POST') {
    const room = habitaciones.find((r) => r.id === cuerpo?.roomId) ?? habitaciones[0]
    return [201, { ...reservas[0], id: 999, code: 'ZH-DEMO1', roomId: room.id, roomNumber: room.number, hotelId: room.hotelId, hotelName: room.hotelName, checkInDate: cuerpo?.checkInDate, checkOutDate: cuerpo?.checkOutDate, guests: cuerpo?.guests, boardType: cuerpo?.boardType, status: 'PENDING', invoiceId: null }]
  }
  if (ruta === '/api/me/invoices') return [200, pagina(facturas.filter((f) => f.clientId === 1), q)]
  if (ruta === '/api/me/profile' && metodo === 'GET') return [200, clientes[0]]
  if (ruta === '/api/bookings' && metodo === 'GET') {
    const from = q.get('from'), to = q.get('to')
    return [200, pagina(reservas.filter((r) => (!q.get('status') || r.status === q.get('status'))
      && (!q.get('hotelId') || r.hotelId === Number(q.get('hotelId')))
      && (!from || r.checkOutDate >= from) && (!to || r.checkInDate <= to)), q)]
  }
  if (ruta === '/api/invoices' && metodo === 'GET') return [200, pagina(facturas.filter((f) => !q.get('status') || f.status === q.get('status')), q)]
  if (ruta === '/api/clients' && metodo === 'GET')
    return [200, pagina(clientes.filter((c) => contiene(`${c.firstName} ${c.lastName} ${c.documentId}`, q.get('search'))), q)]
  if (ruta === '/api/employees' && metodo === 'GET')
    return [200, pagina(empleados.filter((e) => (!q.get('hotelId') || e.hotelId === Number(q.get('hotelId'))) && (!q.get('status') || e.status === q.get('status'))), q)]
  if (ruta === '/api/tasks' && metodo === 'GET') return [200, pagina(tareas, q)]
  if (ruta === '/api/dashboard/summary') return [200, resumen()]
  if (ruta === '/api/dashboard/revenue') return [200, { points: ingresos() }]
  if (ruta === '/api/dashboard/occupancy') return [200, { points: ocupacion(q.get('from') ?? masDias(-14), q.get('to') ?? masDias(14)) }]
  if (metodo === 'DELETE') return [204, null]
  if (metodo === 'POST' || metodo === 'PUT') return [200, { ...(cuerpo ?? {}), id: 999 }]
  return null
}

// Paletas sobrias (piedra, verde, rosa piedra, gris azulado): sin naranjas.
const TONOS = [
  { cielo: ['#C9D6DA', '#EEF0EC'], muro: ['#E8E1D6', '#BFB3A2'], sombra: ['#24352F', '#121B17'], teselas: ['#1E5B46', '#E9E4DA'] },
  { cielo: ['#BFD0CB', '#ECEFEA'], muro: ['#E2E2D8', '#A9B09F'], sombra: ['#1F302B', '#0F1714'], teselas: ['#2C6A55', '#F1EDE6'] },
  { cielo: ['#D3D5DD', '#F1EEEC'], muro: ['#EADCD8', '#BCA6A2'], sombra: ['#2B2629', '#151214'], teselas: ['#8B2E3C', '#EFE6E2'] },
  { cielo: ['#C6CFD8', '#EDEFF1'], muro: ['#E3E0D9', '#ABA79D'], sombra: ['#232B30', '#11161A'], teselas: ['#1F4B73', '#ECEAE4'] },
]
/** Arco de herradura relleno, de luz w y alto total h, con la base en y0. */
const arco = (x, y0, w, h) => {
  const r = w / 2 / 0.96, res = Math.sqrt(r * r - (w / 2) ** 2), cy = y0 - h + r
  return `M${x - w / 2} ${y0}V${cy + res}A${r} ${r} 0 1 1 ${x + w / 2} ${cy + res}V${y0}Z`
}
/**
 * Foto sustituta en SVG: Unsplash no es accesible desde el entorno de verificación.
 * No es un bloque plano: dibuja una galería de arcos que da a un patio (hoteles) o una
 * habitación con ventana en arco (habitaciones), con luz rasante, sombras proyectadas,
 * zócalo de teselas, textura de estuco y grano, para que las capturas transmitan la marca.
 */
export function fotoSustituta(url) {
  let h = 0
  for (const c of url) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const t = TONOS[(h >>> 3) % TONOS.length]
  const habitacion = /w=900/.test(url)
  const defs = `<defs>
<linearGradient id="cielo" x2="0" y2="1"><stop offset="0" stop-color="${t.cielo[0]}"/><stop offset="1" stop-color="${t.cielo[1]}"/></linearGradient>
<linearGradient id="muro" x2="1" y2=".35"><stop offset="0" stop-color="${t.muro[0]}"/><stop offset="1" stop-color="${t.muro[1]}"/></linearGradient>
<linearGradient id="patio" x2="0" y2="1"><stop offset="0" stop-color="${t.sombra[1]}"/><stop offset=".55" stop-color="${t.sombra[0]}"/><stop offset="1" stop-color="${t.muro[1]}"/></linearGradient>
<linearGradient id="suelo" x2="0" y2="1"><stop offset="0" stop-color="${t.muro[1]}"/><stop offset="1" stop-color="${t.sombra[0]}"/></linearGradient>
<linearGradient id="cipres" x2="1"><stop offset="0" stop-color="#3D5E4C"/><stop offset="1" stop-color="#1B2C23"/></linearGradient>
<radialGradient id="vineta" cx=".45" cy=".4" r=".8"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></radialGradient>
<pattern id="tes" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="${t.teselas[1]}"/><path d="M12 1 23 12 12 23 1 12Z" fill="${t.teselas[0]}"/><path d="M12 7 17 12 12 17 7 12Z" fill="${t.teselas[1]}" opacity=".85"/><circle cx="0" cy="0" r="3" fill="${t.sombra[0]}"/><circle cx="24" cy="24" r="3" fill="${t.sombra[0]}"/></pattern>
<filter id="estuco"><feTurbulence type="fractalNoise" baseFrequency=".012 .05" numOctaves="3" seed="${h % 50}"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .1 0"/></filter>
<filter id="grano"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${h % 97}"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .14 0"/></filter>
<filter id="suave"><feGaussianBlur stdDeviation="14"/></filter>
</defs>`
  let escena
  if (habitacion) {
    const v = arco(800, 560, 280, 440)
    escena = `<rect width="1200" height="800" fill="url(#muro)"/><rect width="1200" height="800" filter="url(#estuco)"/>
<path d="${v}" fill="url(#cielo)"/><ellipse cx="800" cy="520" rx="130" ry="40" fill="${t.teselas[0]}" opacity=".35" filter="url(#suave)"/>
<path d="${v}" fill="none" stroke="${t.muro[1]}" stroke-width="26"/><path d="M800 120V560M660 380H940" stroke="${t.muro[1]}" stroke-width="7"/>
<path d="M800 560 1060 800H520Z" fill="#fff" opacity=".22" filter="url(#suave)"/>
<rect y="610" width="1200" height="190" fill="url(#suelo)"/><rect y="566" width="1200" height="44" fill="url(#tes)" opacity=".92"/>
<rect x="90" y="420" width="560" height="38" rx="6" fill="${t.sombra[0]}" opacity=".85"/>
<rect x="110" y="500" width="520" height="130" rx="12" fill="#F6F3EE"/><rect x="110" y="590" width="520" height="40" fill="${t.teselas[0]}" opacity=".6"/>
<rect x="140" y="462" width="160" height="58" rx="22" fill="#FFFDF9"/><rect x="320" y="462" width="160" height="58" rx="22" fill="#FFFDF9"/>
<rect x="110" y="630" width="520" height="22" fill="#000" opacity=".25" filter="url(#suave)"/>`
  } else {
    const n = 3 + (h % 2) * 2, paso = 1200 / n, w = paso * 0.66, alto = Math.min(w * 1.7, 470)
    let arcos = '', luces = ''
    for (let i = 0; i < n; i++) {
      const x = paso * (i + 0.5)
      arcos += `<path d="${arco(x, 600, w, alto)}" fill="url(#patio)"/><path d="${arco(x, 600, w, alto)}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3"/>
<rect x="${x - w / 2 - 22}" y="${600 - alto - 26}" width="${w + 44}" height="${alto + 26}" fill="none" stroke="${t.muro[1]}" stroke-width="5"/>
<rect x="${x - w * 0.18}" y="${600 - alto * 0.42}" width="${w * 0.36}" height="${alto * 0.42}" fill="${t.cielo[1]}" opacity=".18"/>`
      luces += `<path d="M${x - w / 2 + 40} 640h${w - 20}l${w * 0.7} 160h-${w}Z" fill="#fff" opacity=".2"/>`
    }
    escena = `<rect width="1200" height="800" fill="url(#cielo)"/>
<rect y="60" width="1200" height="580" fill="url(#muro)"/><rect y="60" width="1200" height="580" filter="url(#estuco)"/>
<rect y="60" width="1200" height="22" fill="${t.sombra[0]}" opacity=".35"/><rect y="82" width="1200" height="10" fill="url(#tes)" opacity=".7"/>
${arcos}
<rect y="600" width="1200" height="40" fill="url(#tes)"/>
<path d="M0 640H1200V800H0Z" fill="url(#suelo)"/>${luces}
<path d="M0 60H460L1200 520V640H880L0 140Z" fill="#000" opacity=".1"/>
<path d="M70 640c-40 0-46-90-36-200s30-190 46-190 36 80 46 190-16 200-56 200Z" fill="url(#cipres)"/>
<path d="M1130 640c-40 0-46-80-36-170s30-160 46-160 36 70 46 160-16 170-56 170Z" fill="url(#cipres)"/>
<rect x="40" y="620" width="80" height="40" rx="4" fill="${t.teselas[0]}"/><rect x="1100" y="620" width="80" height="40" rx="4" fill="${t.teselas[0]}"/>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">${defs}${escena}<rect width="1200" height="800" fill="url(#vineta)"/><rect width="1200" height="800" filter="url(#grano)"/></svg>`
}

export async function instalarApiSimulada(page, { retardo = 0, fotosReales = process.env.FOTOS_REALES === '1' } = {}) {
  // FOTOS_REALES=1: deja pasar las fotos de Unsplash (cuando hay red); si no, sustitutos en SVG.
  if (!fotosReales) await page.route(/images\.unsplash\.com/, (route) =>
    route.fulfill({ status: 200, contentType: 'image/svg+xml', body: fotoSustituta(route.request().url()) }))
  await page.route(/\/api\//, async (route) => {
    const req = route.request()
    const url = new URL(req.url())
    let cuerpo = null
    try { cuerpo = req.postDataJSON() } catch { cuerpo = null }
    const r = responder(req.method(), url.pathname, url.searchParams, cuerpo)
    if (retardo) await new Promise((ok) => setTimeout(ok, retardo))
    if (!r) return route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ title: 'Not Found', status: 404, detail: url.pathname }) })
    const [estado, datos] = r
    return route.fulfill({ status: estado, contentType: 'application/json', body: datos == null ? '' : JSON.stringify(datos) })
  })
}
