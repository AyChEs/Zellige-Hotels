import { describe, expect, it } from 'vitest'
import type { Role } from '../../api/types'
import en from '../../i18n/locales/en.json'
import es from '../../i18n/locales/es.json'

const roles: Role[] = ['ADMIN', 'MANAGER', 'RECEPTIONIST', 'CLIENT']

describe('labels.employeePosition', () => {
  it.each(roles)('has a label for %s in es.json and en.json', (role) => {
    expect(es.labels.employeePosition[role as keyof typeof es.labels.employeePosition]).toBeTruthy()
    expect(en.labels.employeePosition[role as keyof typeof en.labels.employeePosition]).toBeTruthy()
  })
})
