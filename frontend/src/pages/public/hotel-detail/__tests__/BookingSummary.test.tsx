import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AxiosError, type AxiosResponse } from 'axios'
import type { HotelDto, RoomDto } from '../../../../api/types'
import { AuthProvider } from '../../../../auth/AuthContext'
import { ToastProvider } from '../../../../components/ui/Toast'
import HotelDetailPage from '../../HotelDetailPage'

const hotel: HotelDto = {
  id: 2, name: 'Marrakech Riad Andalus', address: 'Derb Sidi Bouloukat 12', city: 'Marrakech', country: 'Morocco',
  phone: null, email: null, description: null, imageUrl: null, active: true,
  category: { id: 4, name: 'Boutique', starRating: 4, description: null },
}
const room: RoomDto = {
  id: 5, number: 'R1', floor: 0, type: 'DOUBLE', status: 'AVAILABLE', capacity: 2, description: null, imageUrl: null,
  pricePerNight: 110, halfBoardSupplement: 18, fullBoardSupplement: 30, hotelId: 2, hotelName: hotel.name,
}

const api = vi.hoisted(() => ({
  byId: vi.fn(),
  available: vi.fn(),
  book: vi.fn(),
  refresh: vi.fn(),
}))

vi.mock('../../../../api/endpoints', () => ({
  hotelApi: { byId: api.byId },
  roomApi: { available: api.available },
  meApi: { book: api.book },
  authApi: { refresh: api.refresh, logout: vi.fn().mockResolvedValue(undefined) },
}))

function renderPage() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <MemoryRouter initialEntries={['/hotels/2?checkIn=2026-11-10&checkOut=2026-11-13&guests=2&board=HALF_BOARD']}>
          <AuthProvider>
            <Routes>
              <Route path="/hotels/:id" element={<HotelDetailPage />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      </ToastProvider>
    </QueryClientProvider>,
  )
}

describe('booking confirmation step', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('hotel-erp.refreshToken', 'refresh')
    api.refresh.mockResolvedValue({
      accessToken: 'a', refreshToken: 'r', tokenType: 'Bearer', expiresInSeconds: 900,
      user: { id: 4, email: 'client@hotel-erp.dev', role: 'CLIENT' },
    })
    api.byId.mockResolvedValue(hotel)
    api.available.mockResolvedValue([room])
  })

  it('does not book when the guest chooses a room, only shows the summary', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(await screen.findByRole('button', { name: /choose|elegir/i }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(hotel.name)).toBeTruthy()
    expect(api.book).not.toHaveBeenCalled()
  })

  it('books once, with the stay from the URL, when the guest confirms', async () => {
    const user = userEvent.setup()
    api.book.mockResolvedValue({ id: 99, code: 'BK-2026-000099', hotelName: hotel.name, checkInDate: '2026-11-10', checkOutDate: '2026-11-13' })
    renderPage()
    await user.click(await screen.findByRole('button', { name: /choose|elegir/i }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /confirm/i }))

    expect(api.book).toHaveBeenCalledTimes(1)
    expect(api.book).toHaveBeenCalledWith({
      roomId: 5, checkInDate: '2026-11-10', checkOutDate: '2026-11-13', guests: 2, boardType: 'HALF_BOARD',
    })
    expect(await screen.findByText('BK-2026-000099')).toBeTruthy()
  })

  it('warns that the room was taken when the backend says it is no longer available', async () => {
    const user = userEvent.setup()
    const response = {
      status: 409,
      data: { title: 'Conflict', status: 409, detail: 'Room is not available for the selected dates' },
    } as AxiosResponse
    api.book.mockRejectedValue(new AxiosError('Conflict', '409', undefined, undefined, response))
    renderPage()
    await user.click(await screen.findByRole('button', { name: /choose|elegir/i }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /confirm/i }))

    const alert = await screen.findByText(/booked that room|reservado esa habitación/i)
    expect(alert.closest('[role="alert"]')).toBeTruthy()
    expect(api.available).toHaveBeenCalledTimes(2) // availability is refreshed
  })
})
