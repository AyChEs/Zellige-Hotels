import type { ComponentProps } from 'react'

type As = 'div' | 'section' | 'article'

interface Props extends ComponentProps<'div'> {
  /** brand adds the garnet top keyline: search, auth and booking confirmation only. */
  variant?: 'plain' | 'brand'
  as?: As
}

export function Card({ variant = 'plain', as: Tag = 'div', className = '', ...props }: Props) {
  const keyline = variant === 'brand' ? 'border-t-2 border-t-granate-700' : ''
  return (
    <Tag
      className={`rounded-(--radius-card) border border-cal-200 bg-white shadow-(--shadow-card) ${keyline} ${className}`}
      {...props}
    />
  )
}
