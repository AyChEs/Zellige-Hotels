import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

const BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-(--radius-control) text-sm font-semibold ' +
  'transition-colors duration-150 ease-out active:translate-y-px ' +
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 ' +
  'aria-disabled:cursor-not-allowed aria-disabled:opacity-50'

const VARIANT: Record<Variant, string> = {
  primary: 'bg-fez-700 text-white hover:bg-fez-800',
  secondary: 'border border-cal-400 bg-white text-tinta-900 hover:bg-cal-100',
  ghost: 'text-fez-700 hover:bg-fez-50',
  danger: 'bg-error-700 text-white hover:brightness-95',
}

// sm is 36 px high; md is 44 px, the touch target for primary controls at 390 px.
const SIZE: Record<Size, string> = {
  sm: 'min-h-9 px-3',
  md: 'min-h-11 px-4',
}

const classes = (variant: Variant, size: Size, className = '') =>
  `${BASE} ${VARIANT[variant]} ${SIZE[size]} ${className}`.trim()

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      className="animate-spin motion-reduce:animate-none"
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity=".3" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

interface ButtonProps extends ComponentProps<'button'> {
  variant?: Variant
  size?: Size
  /** Shows a spinner, sets aria-busy and disables the button so it cannot be sent twice. */
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  type = 'button',
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes(variant, size, className)}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant
  size?: Size
}

/** A router link that looks like a button: for navigation, never for actions. */
export function ButtonLink({ variant = 'primary', size = 'md', className, ...props }: ButtonLinkProps) {
  return <Link className={classes(variant, size, className)} {...props} />
}
