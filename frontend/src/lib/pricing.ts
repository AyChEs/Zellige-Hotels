import type { BoardType, RoomDto } from '../api/types'

/**
 * Price shown while choosing a room: the room per night, plus the half or full board
 * supplement per guest and night. Breakfast is already in the room price.
 *
 * Indicative only: it mirrors BookingService.price on the backend, and the price that
 * counts is the one the backend stores on the booking.
 */
export function roomTotal(
  room: Pick<RoomDto, 'pricePerNight' | 'halfBoardSupplement' | 'fullBoardSupplement'>,
  board: BoardType,
  guests: number,
  nights: number,
): number {
  if (nights <= 0) return 0
  const supplement =
    board === 'HALF_BOARD' ? room.halfBoardSupplement : board === 'FULL_BOARD' ? room.fullBoardSupplement : 0
  return (room.pricePerNight + supplement * guests) * nights
}
