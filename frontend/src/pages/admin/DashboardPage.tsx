import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { useDashboard } from '../../api/hooks/useDashboard'
import { useAuth } from '../../auth/AuthContext'
import { Card } from '../../components/ui/Card'
import { ErrorNote } from '../../components/ui/Feedback'
import { PageHeader } from '../../components/ui/PageHeader'
import { money, todayIso } from '../../lib/format'
import { useLabels } from '../../lib/labels'
import type { BookingStatus } from '../../api/types'

// Chart colours from plan/DISENO.md (fez-700, granate-700, tinta-900, tinta-600, cal-200).
// Both series are over 7:1 on white, so they also pass the 3:1 non-text contrast.
const SERIES = '#1E5B46'
const SERIES_2 = '#8B2E3C'
const INK = '#1C211F'
const MUTED = '#555C58'
const GRID = '#E3DDD3'

function StatTile({ label, value, context }: { label: string; value: string; context?: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-tinta-600">{label}</p>
      <p className="cifras mt-1 text-2xl font-semibold text-tinta-900">{value}</p>
      {context && <p className="mt-1 text-xs text-tinta-600">{context}</p>}
    </Card>
  )
}

/** Today's occupancy, the number the staff looks at first: wider and with its meter. */
function OccupancyTile({ label, rate, context }: { label: string; rate: number; context: string }) {
  return (
    <Card className="p-5 sm:col-span-2">
      <p id="kpi-ocupacion" className="text-sm text-tinta-600">
        {label}
      </p>
      <p className="cifras mt-1 text-4xl font-semibold text-tinta-900">{rate}%</p>
      <div
        role="meter"
        aria-labelledby="kpi-ocupacion"
        aria-valuenow={rate}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${rate}%`}
        className="mt-3 h-2.5 overflow-hidden rounded-(--radius-pill) bg-cal-200"
      >
        <div className="h-full rounded-(--radius-pill) bg-fez-700" style={{ width: `${Math.min(100, rate)}%` }} />
      </div>
      <p className="mt-2 text-xs text-tinta-600">{context}</p>
    </Card>
  )
}

/** A chart is a figure: caption on top, and the same numbers as a table for screen readers. */
function ChartCard({
  title,
  children,
  rows,
  headers,
}: {
  title: string
  children: React.ReactNode
  rows?: [string, string][]
  headers?: [string, string]
}) {
  return (
    <Card as="section" className="p-5">
      <figure>
        <figcaption className="mb-4 text-sm font-semibold text-tinta-900">{title}</figcaption>
        <div aria-hidden={rows ? true : undefined}>{children}</div>
        {rows && headers && (
          <table className="sr-only">
            <caption>{title}</caption>
            <thead>
              <tr>
                <th scope="col">{headers[0]}</th>
                <th scope="col">{headers[1]}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([a, b]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </figure>
    </Card>
  )
}

const tooltipStyle = {
  background: '#FFFFFF',
  borderRadius: 6,
  border: `1px solid ${GRID}`,
  fontSize: 13,
  color: INK,
}

export default function DashboardPage() {
  const { t, i18n } = useTranslation()
  const { tLabel } = useLabels()
  const { hasRole } = useAuth()
  const locale = i18n.resolvedLanguage?.slice(0, 2) || 'es'

  const { summary, revenue, occupancy } = useDashboard(hasRole('ADMIN', 'MANAGER'))

  if (!hasRole('ADMIN', 'MANAGER')) return <Navigate to="/admin/bookings" replace />

  if (summary.error) return <ErrorNote error={summary.error} onRetry={() => summary.refetch()} />

  const s = summary.data
  const statusEntries = s
    ? (Object.entries(s.bookingsByStatus) as [BookingStatus, number][])
    : []
  const maxStatus = Math.max(1, ...statusEntries.map(([, n]) => n))

  // Locale-aware date / month label
  const monthLabel = (m: string) => {
    const d = new Date(`${m}-01T00:00:00`)
    return d.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-GB', { month: 'short' })
  }
  const dayMonthLabel = (d: string) => {
    const date = new Date(`${d}T00:00:00`)
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-GB', { day: '2-digit', month: '2-digit' })
  }

  return (
    <>
      <PageHeader title={t('admin.dashboard.title')} subtitle={t('admin.dashboard.subtitle', { date: todayIso() })} />

      {/* KPI row */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {s ? (
          <>
            <OccupancyTile
              label={t('admin.dashboard.todayOccupancy')}
              rate={s.occupancyRateToday}
              context={t('admin.dashboard.rooms', { occupied: s.occupiedRoomsToday, total: s.totalRooms })}
            />
            <StatTile
              label={t('admin.dashboard.monthRevenue')}
              value={money(s.revenueThisMonth)}
              context={t('admin.dashboard.revenueContext')}
            />
            <StatTile
              label={t('admin.dashboard.monthBookings')}
              value={String(s.bookingsThisMonth)}
              context={t('admin.dashboard.monthBookingsContext')}
            />
            <StatTile
              label={t('admin.dashboard.pendingTasks')}
              value={String(s.pendingTasks)}
              context={t('admin.dashboard.pendingTasksContext')}
            />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className={`skeleton h-28 ${i === 0 ? 'sm:col-span-2' : ''}`} />)
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title={t('admin.dashboard.revenueChart')}
          headers={[t('admin.dashboard.month'), t('admin.dashboard.revenue')]}
          rows={revenue.data?.points.map((p) => [p.month, money(p.revenue)])}
        >
          {revenue.data ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart accessibilityLayer={false} data={revenue.data.points} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: MUTED }}
                  tickFormatter={monthLabel}
                  axisLine={{ stroke: GRID }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: MUTED }}
                  tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}k€` : `${v}€`)}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                />
                <Tooltip
                  formatter={(value) => [money(Number(value)), t('admin.dashboard.revenue')]}
                  contentStyle={tooltipStyle}
                  cursor={{ fill: 'rgba(30,91,70,0.08)' }}
                />
                <Bar dataKey="revenue" fill={SERIES} radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="skeleton h-60 w-full" />
          )}
        </ChartCard>

        <ChartCard
          title={t('admin.dashboard.occupancyChart')}
          headers={[t('admin.dashboard.day'), t('admin.dashboard.occupancy')]}
          rows={occupancy.data?.points.map((p) => [p.date, `${p.rate}%`])}
        >
          {occupancy.data ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart accessibilityLayer={false} data={occupancy.data.points} margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: MUTED }}
                  tickFormatter={dayMonthLabel}
                  axisLine={{ stroke: GRID }}
                  tickLine={false}
                  interval={3}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: MUTED }}
                  tickFormatter={(v: number) => `${v}%`}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, t('admin.dashboard.occupancy')]}
                  labelFormatter={(d) => String(d)}
                  contentStyle={tooltipStyle}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke={SERIES_2}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: '#ffffff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="skeleton h-60 w-full" />
          )}
        </ChartCard>
      </div>

      {/* Status breakdown: identity carried by the row label, single hue */}
      <div className="mt-6">
      <ChartCard title={t('admin.dashboard.bookingsByStatus')}>
        <div className="mt-2 space-y-2">
          {statusEntries.map(([status, count]) => (
            <div key={status} className="grid grid-cols-[8rem_1fr_3rem] items-center gap-3 text-sm">
              <span className="text-tinta-600">{tLabel('bookingStatus', status)}</span>
              <div className="h-4 rounded-(--radius-control) bg-cal-100" aria-hidden>
                <div
                  className="h-4 rounded-(--radius-control)"
                  style={{ width: `${(count / maxStatus) * 100}%`, backgroundColor: SERIES }}
                />
              </div>
              <span className="cifras text-right font-semibold text-tinta-900">{count}</span>
            </div>
          ))}
        </div>
      </ChartCard>
      </div>
    </>
  )
}
