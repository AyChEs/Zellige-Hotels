import { describe, expect, it } from 'vitest'
import { contrast } from '../contrast'

describe('contrast', () => {
  it('matches the WCAG reference values', () => {
    expect(contrast('#000000', '#FFFFFF')).toBe(21)
    expect(contrast('#FFFFFF', '#FFFFFF')).toBe(1)
  })

  it('keeps the brand pairs documented in docs/MARCA.md at AA or better', () => {
    expect(contrast('#1E5B46', '#FAF8F4')).toBe(7.5)
    expect(contrast('#9FCFB7', '#18231F')).toBe(9.3)
    expect(contrast('#E2B9BF', '#18231F')).toBe(9.2)
    expect(contrast('#EDEAE3', '#18231F')).toBeGreaterThanOrEqual(4.5)
  })
})
