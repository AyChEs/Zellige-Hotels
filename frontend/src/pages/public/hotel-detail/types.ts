import type { BoardType } from '../../../api/types'

/** What the guest is asking for. Lives in the URL so the link can be shared. */
export interface Stay {
  checkIn: string
  checkOut: string
  guests: number
  board: BoardType
}

export const BOARDS: BoardType[] = ['ROOM_ONLY', 'BED_AND_BREAKFAST', 'HALF_BOARD', 'FULL_BOARD']
