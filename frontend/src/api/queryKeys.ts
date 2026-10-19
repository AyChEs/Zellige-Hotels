/**
 * Every query key in the app, in one place. Each resource has an `all` root so an
 * invalidation can be as wide or as narrow as the change it follows.
 */
type Params = Record<string, unknown>

export const qk = {
  hotels: {
    all: ['hotels'] as const,
    list: (p: Params) => ['hotels', 'list', p] as const,
    detail: (id: number) => ['hotels', 'detail', id] as const,
    options: ['hotels', 'options'] as const,
  },
  categories: { all: ['categories'] as const },
  availability: {
    all: ['availability'] as const,
    search: (hotelId: number, checkIn: string, checkOut: string, guests: number) =>
      ['availability', hotelId, checkIn, checkOut, guests] as const,
  },
  rooms: {
    all: ['rooms'] as const,
    list: (p: Params) => ['rooms', 'list', p] as const,
  },
  bookings: {
    all: ['bookings'] as const,
    list: (p: Params) => ['bookings', 'list', p] as const,
    calendar: (hotelId: number, start: string, days: number) => ['bookings', 'calendar', hotelId, start, days] as const,
    invoiceable: ['bookings', 'invoiceable'] as const,
  },
  invoices: {
    all: ['invoices'] as const,
    list: (p: Params) => ['invoices', 'list', p] as const,
  },
  clients: {
    all: ['clients'] as const,
    list: (p: Params) => ['clients', 'list', p] as const,
  },
  employees: {
    all: ['employees'] as const,
    list: (p: Params) => ['employees', 'list', p] as const,
  },
  tasks: { all: ['tasks'] as const, board: ['tasks', 'board'] as const },
  dashboard: {
    all: ['dashboard'] as const,
    summary: ['dashboard', 'summary'] as const,
    revenue: ['dashboard', 'revenue'] as const,
    occupancy: ['dashboard', 'occupancy'] as const,
  },
  me: {
    bookings: ['me', 'bookings'] as const,
    invoices: ['me', 'invoices'] as const,
    profile: ['me', 'profile'] as const,
  },
}
