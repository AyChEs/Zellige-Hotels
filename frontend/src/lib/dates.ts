const DAY = 86_400_000

/** yyyy-mm-dd plus n days, in UTC so a DST change never shifts the date. */
export function addDays(iso: string, n: number): string {
  return new Date(Date.parse(`${iso}T00:00:00Z`) + n * DAY).toISOString().slice(0, 10)
}
