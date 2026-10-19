import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from '../ErrorBoundary'

let shouldThrow = true
function Fragile() {
  if (shouldThrow) throw new Error('boom')
  return <p>Pantalla bien</p>
}

describe('ErrorBoundary', () => {
  it('shows the error screen when a page throws and renders it again after retrying', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const user = userEvent.setup()
    render(
      <QueryClientProvider client={new QueryClient()}>
        <ErrorBoundary>
          <Fragile />
        </ErrorBoundary>
      </QueryClientProvider>,
    )
    const retry = await screen.findByRole('button', { name: /try again|volver a intentarlo/i })
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()

    shouldThrow = false
    await user.click(retry)
    expect(await screen.findByText('Pantalla bien')).toBeTruthy()
  })
})
