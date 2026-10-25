import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mockApi, type Role } from './mock-api'

// The 18 screens of plan/AUDITORIA.md plus the brand page (session 10). Each one is checked at 390 and 1440 px (projects).
const ROUTES: { path: string; role?: Role }[] = [
  { path: '/' },
  { path: '/hotels' },
  { path: '/hotels/1' },
  { path: '/marca' },
  { path: '/login' },
  { path: '/register' },
  { path: '/aviso-legal' },
  { path: '/privacidad' },
  { path: '/account', role: 'CLIENT' },
  { path: '/account/invoices', role: 'CLIENT' },
  { path: '/account/profile', role: 'CLIENT' },
  { path: '/admin', role: 'ADMIN' },
  { path: '/admin/bookings', role: 'ADMIN' },
  { path: '/admin/calendar', role: 'ADMIN' },
  { path: '/admin/invoices', role: 'ADMIN' },
  { path: '/admin/clients', role: 'ADMIN' },
  { path: '/admin/tasks', role: 'ADMIN' },
  { path: '/admin/hotels', role: 'ADMIN' },
  { path: '/admin/rooms', role: 'ADMIN' },
  { path: '/admin/categories', role: 'ADMIN' },
  { path: '/admin/employees', role: 'ADMIN' },
]

for (const { path, role } of ROUTES) {
  test(`${path}${role ? ` (${role})` : ''} has no serious or critical axe violations`, async ({ page }) => {
    await mockApi(page, role)
    await page.goto(path)
    await expect(page.locator('main h1')).toBeVisible()
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    const blocking = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(blocking.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])

    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
    expect(overflows, 'no horizontal scroll').toBe(false)
  })
}

// The hero text and buttons slide in on load; they must keep their contrast from the first frame
// (a fade-in made axe fail on slow runners).
test('the home hero keeps its contrast while the entrance plays', async ({ page }) => {
  await mockApi(page)
  await page.goto('/', { waitUntil: 'commit' })
  await page.waitForSelector('main h1')
  await page.waitForTimeout(700)
  const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze()
  expect(results.violations.map((v) => v.nodes.map((n) => n.target.join(' ')))).toEqual([])
})
