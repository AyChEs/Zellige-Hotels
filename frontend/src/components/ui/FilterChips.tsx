interface Props<V extends string> {
  label: string
  value: V | ''
  options: { value: V | ''; label: string }[]
  onChange: (value: V | '') => void
}

/** A row of toggle buttons to filter a list; the pressed one is the active filter. */
export function FilterChips<V extends string>({ label, value, options, onChange }: Props<V>) {
  return (
    <div role="group" aria-label={label} className="mb-4 flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value || 'all'}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`inline-flex min-h-9 items-center rounded-(--radius-pill) border px-3 text-sm font-semibold transition-colors duration-150 ${
              active
                ? 'border-fez-700 bg-fez-700 text-white'
                : 'border-cal-200 bg-white text-tinta-600 hover:border-cal-400 hover:text-tinta-900'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
