import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'
import { Field, Input } from '../Field'
import { Modal } from '../Modal'
import { DateRangeField } from '../DateRangeField'

describe('Button', () => {
  it('is disabled and busy while loading', () => {
    render(<Button loading>Guardar</Button>)
    const button = screen.getByRole('button', { name: 'Guardar' })
    expect(button).toHaveProperty('disabled', true)
    expect(button.getAttribute('aria-busy')).toBe('true')
  })
})

describe('Field', () => {
  it('marks the control invalid and points it at the error text', () => {
    render(
      <Field id="email" label="Email" error="Email no válido">
        <Input type="email" />
      </Field>,
    )
    const input = screen.getByLabelText('Email')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    const describedBy = input.getAttribute('aria-describedby') ?? ''
    const error = document.getElementById(describedBy.split(' ').find((id) => id.endsWith('-error')) ?? '')
    expect(error?.textContent).toContain('Email no válido')
  })
})

describe('Modal', () => {
  function Harness() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <button onClick={() => setOpen(true)}>Abrir</button>
        <Modal open={open} title="Editar" onClose={() => setOpen(false)}>
          <input aria-label="Nombre" />
        </Modal>
      </>
    )
  }

  it('moves focus inside on open and back to the opener on close', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const opener = screen.getByRole('button', { name: 'Abrir' })

    await user.click(opener)
    expect(document.activeElement).toBe(screen.getByLabelText('Nombre'))

    const closeButton = document.querySelector('dialog button') as HTMLButtonElement
    await user.click(closeButton)
    expect(document.activeElement).toBe(opener)
  })
})

describe('DateRangeField', () => {
  it('shows an error when check-out is before check-in', () => {
    render(<DateRangeField checkIn="2026-11-10" checkOut="2026-11-08" onChange={() => {}} />)
    expect(screen.getByRole('alert').textContent).toMatch(/check-in|entrada/i)
  })

  it('announces the number of nights for a valid range', () => {
    render(<DateRangeField checkIn="2026-11-10" checkOut="2026-11-13" onChange={() => {}} />)
    expect(screen.queryByRole('alert')).toBeNull()
    expect(document.querySelector('[aria-live="polite"]')?.textContent).toMatch(/3/)
  })
})
