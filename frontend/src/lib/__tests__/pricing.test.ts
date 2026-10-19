import { describe, expect, it } from 'vitest'
import { roomTotal } from '../pricing'

const room = { pricePerNight: 110, halfBoardSupplement: 18, fullBoardSupplement: 30 }

describe('roomTotal', () => {
  it('charges only the room for room only', () => {
    expect(roomTotal(room, 'ROOM_ONLY', 2, 3)).toBe(330)
  })

  it('adds the half board supplement per guest and night', () => {
    // (110 + 18 * 2) * 3
    expect(roomTotal(room, 'HALF_BOARD', 2, 3)).toBe(438)
  })

  it('is zero for zero nights', () => {
    expect(roomTotal(room, 'FULL_BOARD', 2, 0)).toBe(0)
  })
})
