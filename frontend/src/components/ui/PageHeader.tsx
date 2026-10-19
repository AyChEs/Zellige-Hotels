import type { ReactNode } from 'react'

export function PageHeader({ title, subtitle, actions }: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-tinta-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-tinta-600">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </header>
  )
}
