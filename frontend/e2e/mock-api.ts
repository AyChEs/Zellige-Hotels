import type { Page, Route } from '@playwright/test'
import bookings from './fixtures/bookings.json' with { type: 'json' }
import categories from './fixtures/categories.json' with { type: 'json' }
import clients from './fixtures/clients.json' with { type: 'json' }
import occupancy from './fixtures/dashboard-occupancy.json' with { type: 'json' }
import revenue from './fixtures/dashboard-revenue.json' with { type: 'json' }
import summary from './fixtures/dashboard-summary.json' with { type: 'json' }
import employees from './fixtures/employees.json' with { type: 'json' }
import hotel from './fixtures/hotel-1.json' with { type: 'json' }
import hotels from './fixtures/hotels.json' with { type: 'json' }
import invoices from './fixtures/invoices.json' with { type: 'json' }
import meBookings from './fixtures/me-bookings.json' with { type: 'json' }
import meInvoices from './fixtures/me-invoices.json' with { type: 'json' }
import profile from './fixtures/me-profile.json' with { type: 'json' }
import available from './fixtures/rooms-available.json' with { type: 'json' }
import rooms from './fixtures/rooms.json' with { type: 'json' }
import tasks from './fixtures/tasks.json' with { type: 'json' }

export type Role = 'ADMIN' | 'MANAGER' | 'RECEPTIONIST' | 'CLIENT'

const EMAIL: Record<Role, string> = {
  ADMIN: 'admin@hotel-erp.dev',
  MANAGER: 'manager@hotel-erp.dev',
  RECEPTIONIST: 'reception@hotel-erp.dev',
  CLIENT: 'client@hotel-erp.dev',
}

const tokens = (role: Role) => ({
  accessToken: `access-${role}`,
  refreshToken: `refresh-${role}`,
  tokenType: 'Bearer',
  expiresInSeconds: 900,
  user: { id: 1, email: EMAIL[role], role },
})

const GET: [RegExp, unknown][] = [
  [/^\/api\/hotels\/\d+$/, hotel],
  [/^\/api\/hotels$/, hotels],
  [/^\/api\/categories$/, categories],
  [/^\/api\/rooms\/available$/, available],
  [/^\/api\/rooms$/, rooms],
  [/^\/api\/bookings$/, bookings],
  [/^\/api\/invoices$/, invoices],
  [/^\/api\/clients$/, clients],
  [/^\/api\/employees$/, employees],
  [/^\/api\/tasks$/, tasks],
  [/^\/api\/dashboard\/summary$/, summary],
  [/^\/api\/dashboard\/revenue$/, revenue],
  [/^\/api\/dashboard\/occupancy$/, occupancy],
  [/^\/api\/me\/bookings$/, meBookings],
  [/^\/api\/me\/invoices$/, meInvoices],
  [/^\/api\/me\/profile$/, profile],
]

/**
 * Answers every /api call from fixed JSON so the check never depends on Render.
 * With a role, the session is resumed through /api/auth/refresh as that user.
 */
export async function mockApi(page: Page, role?: Role) {
  if (role) {
    await page.addInitScript((token) => localStorage.setItem('hotel-erp.refreshToken', token), `refresh-${role}`)
  }
  // Remote photos are not part of the check and may be unreachable.
  await page.route(/images\.unsplash\.com/, (route) => route.fulfill({ status: 204, body: '' }))
  await page.route('**/api/**', (route: Route) => {
    const url = new URL(route.request().url())
    const json = (status: number, body: unknown) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
    if (url.pathname === '/api/auth/refresh' || url.pathname === '/api/auth/login') {
      return role ? json(200, tokens(role)) : json(401, { title: 'Unauthorized', status: 401, detail: 'No session' })
    }
    if (route.request().method() !== 'GET') return json(200, {})
    const match = GET.find(([re]) => re.test(url.pathname))
    return match ? json(200, match[1]) : json(404, { title: 'Not Found', status: 404, detail: url.pathname })
  })
}
