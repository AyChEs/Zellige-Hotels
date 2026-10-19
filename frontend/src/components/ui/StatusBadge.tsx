import type { BookingStatus, InvoiceStatus, RoomStatus, TaskPriority, TaskStatus } from '../../api/types'
import { useLabels } from '../../lib/labels'

// Colours from the state table in plan/DISENO.md: pending -> aviso, in progress or
// confirmed -> info, done or free -> fez, void or out of service -> error or cal.
const BOOKING_TONE: Record<BookingStatus, string> = {
  PENDING: 'bg-aviso-50 text-aviso-ink',
  CONFIRMED: 'bg-info-50 text-info-ink',
  CHECKED_IN: 'bg-fez-700 text-white',
  CHECKED_OUT: 'bg-cal-100 text-tinta-600',
  CANCELLED: 'bg-error-50 text-error-ink',
}

const INVOICE_TONE: Record<InvoiceStatus, string> = {
  ISSUED: 'bg-aviso-50 text-aviso-ink',
  PAID: 'bg-fez-50 text-fez-700',
  CANCELLED: 'bg-error-50 text-error-ink',
}

const ROOM_TONE: Record<RoomStatus, string> = {
  AVAILABLE: 'bg-fez-50 text-fez-700',
  OCCUPIED: 'bg-info-50 text-info-ink',
  CLEANING: 'bg-aviso-50 text-aviso-ink',
  MAINTENANCE: 'bg-error-50 text-error-ink',
  OUT_OF_SERVICE: 'bg-cal-100 text-tinta-600',
}

const TASK_TONE: Record<TaskStatus, string> = {
  PENDING: 'bg-aviso-50 text-aviso-ink',
  IN_PROGRESS: 'bg-info-50 text-info-ink',
  DONE: 'bg-fez-50 text-fez-700',
  CANCELLED: 'bg-cal-100 text-tinta-600',
}

const PRIORITY_TONE: Record<TaskPriority, string> = {
  LOW: 'bg-cal-100 text-tinta-600',
  MEDIUM: 'bg-info-50 text-info-ink',
  HIGH: 'bg-aviso-50 text-aviso-ink',
  URGENT: 'bg-error-50 text-error-ink',
}

export const BookingBadge = ({ status }: { status: BookingStatus }) => {
  const { tLabel } = useLabels()
  return <span className={`badge ${BOOKING_TONE[status]}`}>{tLabel('bookingStatus', status)}</span>
}

export const InvoiceBadge = ({ status }: { status: InvoiceStatus }) => {
  const { tLabel } = useLabels()
  return <span className={`badge ${INVOICE_TONE[status]}`}>{tLabel('invoiceStatus', status)}</span>
}

export const RoomBadge = ({ status }: { status: RoomStatus }) => {
  const { tLabel } = useLabels()
  return <span className={`badge ${ROOM_TONE[status]}`}>{tLabel('roomStatus', status)}</span>
}

export const TaskBadge = ({ status }: { status: TaskStatus }) => {
  const { tLabel } = useLabels()
  return <span className={`badge ${TASK_TONE[status]}`}>{tLabel('taskStatus', status)}</span>
}

export const PriorityBadge = ({ priority }: { priority: TaskPriority }) => {
  const { tLabel } = useLabels()
  return <span className={`badge ${PRIORITY_TONE[priority]}`}>{tLabel('taskPriority', priority)}</span>
}
