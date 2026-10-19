import { useId, type Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { addDays } from '../../lib/dates'
import { nights as nightsOf } from '../../lib/format'
import { Field, Input } from './Field'

interface Props {
  checkIn: string
  checkOut: string
  onChange: (checkIn: string, checkOut: string) => void
  /** Earliest selectable check-in (yyyy-mm-dd). */
  min?: string
  /** Lets a parent move focus to the first date, e.g. from an empty state. */
  checkInRef?: Ref<HTMLInputElement>
  className?: string
}

/**
 * Two native date inputs: accessible out of the box and no extra dependency.
 * Check-out must be after check-in; the number of nights is announced politely.
 */
export function DateRangeField({ checkIn, checkOut, onChange, min, checkInRef, className = '' }: Props) {
  const { t } = useTranslation()
  const id = useId()
  const nights = checkIn && checkOut ? nightsOf(checkIn, checkOut) : 0
  const invalid = Boolean(checkIn && checkOut) && nights < 1

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-4">
        <Field id={`${id}-in`} label={t('public.landing.checkIn')}>
          <Input
            ref={checkInRef}
            type="date"
            value={checkIn}
            min={min}
            required
            onChange={(e) => onChange(e.target.value, checkOut)}
          />
        </Field>
        <Field id={`${id}-out`} label={t('public.landing.checkOut')} error={invalid ? t('common.dateOrder') : undefined}>
          <Input
            type="date"
            value={checkOut}
            min={checkIn ? addDays(checkIn, 1) : min}
            required
            onChange={(e) => onChange(checkIn, e.target.value)}
          />
        </Field>
      </div>
      <p aria-live="polite" className="mt-1.5 text-sm text-tinta-600 cifras">
        {!invalid && nights > 0 ? t('public.hotelDetail.nights', { count: nights }) : ''}
      </p>
    </div>
  )
}
