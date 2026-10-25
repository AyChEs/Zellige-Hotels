import { cloneElement, type ComponentProps, type ReactElement, type ReactNode } from 'react'
import { IconAlerta } from './icons'

const CONTROL =
  'block w-full rounded-(--radius-control) border border-cal-400 bg-white px-3 text-base text-tinta-900 ' +
  'placeholder:text-tinta-600 transition-colors duration-150 focus:border-fez-700 ' +
  'aria-[invalid=true]:border-error-700 disabled:cursor-not-allowed disabled:bg-cal-100'

export function Input({ className = '', ...props }: ComponentProps<'input'>) {
  return <input className={`${CONTROL} min-h-11 ${className}`} {...props} />
}

export function Select({ className = '', ...props }: ComponentProps<'select'>) {
  return <select className={`${CONTROL} min-h-11 ${className}`} {...props} />
}

export function Textarea({ className = '', ...props }: ComponentProps<'textarea'>) {
  return <textarea className={`${CONTROL} py-2 ${className}`} {...props} />
}

type ControlProps = {
  id?: string
  'aria-invalid'?: boolean | 'true' | 'false'
  'aria-describedby'?: string
}

interface FieldProps {
  id: string
  label: ReactNode
  hint?: ReactNode
  error?: string
  /** One control (Input, Select, Textarea or a native one). */
  children: ReactElement<ControlProps>
  className?: string
}

/**
 * Label, control, hint and error wired together by id: the control gets aria-invalid and
 * aria-describedby pointing at the hint and the error, so a screen reader reads them.
 */
export function Field({ id, label, hint, error, children, className = '' }: FieldProps) {
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [children.props['aria-describedby'], hint ? hintId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-tinta-900">
        {label}
      </label>
      {cloneElement(children, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy || undefined,
      })}
      {hint && (
        <p id={hintId} className="mt-1 text-sm text-tinta-600">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1 flex items-start gap-1.5 text-sm text-error-ink">
          <IconAlerta size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
