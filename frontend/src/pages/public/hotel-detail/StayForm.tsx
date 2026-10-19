import { useState, type FormEvent, type Ref } from 'react'
import { useTranslation } from 'react-i18next'
import type { BoardType } from '../../../api/types'
import { todayIso } from '../../../lib/format'
import { useLabels } from '../../../lib/labels'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { DateRangeField } from '../../../components/ui/DateRangeField'
import { Field, Input, Select } from '../../../components/ui/Field'
import { BOARDS, type Stay } from './types'

interface Props {
  stay: Stay
  onSubmit: (stay: Stay) => void
  checkInRef?: Ref<HTMLInputElement>
}

/** Dates, guests and board. Mount it with key={url} so it resets when the URL changes. */
export function StayForm({ stay, onSubmit, checkInRef }: Props) {
  const { t } = useTranslation()
  const { tLabel } = useLabels()
  const [draft, setDraft] = useState(stay)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (draft.checkOut > draft.checkIn) onSubmit(draft)
  }

  return (
    <Card as="section" aria-label={t('public.hotelDetail.update')} className="p-4 sm:p-5">
      <form onSubmit={submit} className="grid gap-4 lg:grid-cols-[2fr_7rem_1fr_auto] lg:items-start">
        <DateRangeField
          checkInRef={checkInRef}
          checkIn={draft.checkIn}
          checkOut={draft.checkOut}
          min={todayIso()}
          onChange={(checkIn, checkOut) => setDraft({ ...draft, checkIn, checkOut })}
        />
        <Field id="stay-guests" label={t('public.landing.guests')}>
          <Input
            type="number"
            min={1}
            max={10}
            value={draft.guests}
            onChange={(e) => setDraft({ ...draft, guests: Number(e.target.value) })}
          />
        </Field>
        <Field id="stay-board" label={t('public.hotelDetail.board')}>
          <Select value={draft.board} onChange={(e) => setDraft({ ...draft, board: e.target.value as BoardType })}>
            {BOARDS.map((value) => (
              <option key={value} value={value}>
                {tLabel('boardType', value)}
              </option>
            ))}
          </Select>
        </Field>
        <Button type="submit" className="w-full lg:mt-7 lg:w-auto">
          {t('public.hotelDetail.update')}
        </Button>
      </form>
    </Card>
  )
}
