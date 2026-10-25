import type { ReactNode } from 'react'

/** Staff page title: one h1 per screen, actions on the right (below at 390 px). */
export function PageHeader({ title, subtitle, actions }: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-tinta-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-tinta-600">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  )
}
