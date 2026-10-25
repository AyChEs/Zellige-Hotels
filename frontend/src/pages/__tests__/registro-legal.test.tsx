import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import i18n from '../../i18n'
import { RegisterPage } from '../RegisterPage'
import LegalPage from '../public/LegalPage'

const registro = vi.fn().mockResolvedValue({})
vi.mock('../../auth/AuthContext', () => ({ useAuth: () => ({ register: registro }) }))

async function rellenar(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nombre'), 'Ana')
  await user.type(screen.getByLabelText('Apellidos'), 'Prueba')
  await user.type(screen.getByLabelText('Documento de identidad'), 'X0000000T')
  await user.type(screen.getByLabelText('Email'), 'ana@example.com')
  await user.type(screen.getByLabelText('Contraseña'), 'Clave1234')
}

describe('Registro: política de privacidad', () => {
  it('no envía el formulario sin marcar la casilla y avisa', async () => {
    await i18n.changeLanguage('es')
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )
    await rellenar(user)
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(await screen.findByText('Debes aceptar la política de privacidad')).toBeTruthy()
    expect(registro).not.toHaveBeenCalled()
  })

  it('con la casilla marcada envía los datos sin el campo de privacidad', async () => {
    await i18n.changeLanguage('es')
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )
    await rellenar(user)
    await user.click(screen.getByRole('checkbox', { name: /política de privacidad/ }))
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    await waitFor(() => expect(registro).toHaveBeenCalledTimes(1))
    expect(registro.mock.calls[0][0]).not.toHaveProperty('privacy')
    expect(screen.getByRole('link', { name: 'política de privacidad' }).getAttribute('href')).toBe('/privacidad')
  })
})

describe('Páginas legales', () => {
  it.each([
    ['aviso', 'es', 'Aviso legal'],
    ['privacidad', 'es', 'Privacidad'],
    ['aviso', 'en', 'Legal notice'],
    ['privacidad', 'en', 'Privacy'],
  ] as const)('%s en %s tiene titular, contacto y secciones', async (tipo, lang, titulo) => {
    await i18n.changeLanguage(lang)
    render(
      <MemoryRouter>
        <LegalPage tipo={tipo} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 1, name: titulo })).toBeTruthy()
    expect(document.body.textContent).toContain('aymanessamadi72@gmail.com')
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(3)
  })
})
