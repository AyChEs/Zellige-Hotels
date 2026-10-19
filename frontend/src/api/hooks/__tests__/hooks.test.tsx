import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { BookingDto } from '../../types'
import { qk } from '../../queryKeys'
import { useBookingAction } from '../useBookings'
import { useHotelOptions } from '../useHotels'

const api = vi.hoisted(() => ({ search: vi.fn(), checkIn: vi.fn() }))
vi.mock('../../endpoints', () => ({
  hotelApi: { search: api.search },
  bookingApi: { checkIn: api.checkIn },
}))

const client = () => new QueryClient({ defaultOptions: { queries: { retry: false } } })
const wrapper = (qc: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  }

describe('resource hooks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('useHotelOptions asks the API once for two screens mounted together', async () => {
    api.search.mockResolvedValue({ content: [], page: 0, size: 50, totalElements: 0, totalPages: 1 })
    function Select() {
      const { data } = useHotelOptions()
      return <span>{data ? 'ok' : '…'}</span>
    }
    const qc = client()
    const { findAllByText } = render(
      <QueryClientProvider client={qc}>
        <Select />
        <Select />
      </QueryClientProvider>,
    )
    expect(await findAllByText('ok')).toHaveLength(2)
    expect(api.search).toHaveBeenCalledTimes(1)
  })

  it('check-in refreshes the dashboard but not the hotels', async () => {
    api.checkIn.mockResolvedValue({})
    const qc = client()
    const spy = vi.spyOn(qc, 'invalidateQueries')
    const { result } = renderHook(() => useBookingAction(), { wrapper: wrapper(qc) })

    await act(() => result.current.mutateAsync({ booking: { id: 7 } as BookingDto, action: 'checkIn' }))

    await waitFor(() => expect(spy).toHaveBeenCalled())
    const keys = spy.mock.calls.map(([filters]) => JSON.stringify(filters?.queryKey))
    expect(keys).toContain(JSON.stringify(qk.dashboard.all))
    expect(keys).not.toContain(JSON.stringify(qk.hotels.all))
    expect(keys.some((k) => k.startsWith('["hotels"'))).toBe(false)
  })
})
