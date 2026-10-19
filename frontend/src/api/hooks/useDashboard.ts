import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../endpoints'
import { plusDaysIso } from '../../lib/format'
import { qk } from '../queryKeys'

export function useDashboard(enabled: boolean) {
  const summary = useQuery({ queryKey: qk.dashboard.summary, queryFn: dashboardApi.summary, enabled })
  const revenue = useQuery({ queryKey: qk.dashboard.revenue, queryFn: () => dashboardApi.revenue(12), enabled })
  const occupancy = useQuery({
    queryKey: qk.dashboard.occupancy,
    queryFn: () => dashboardApi.occupancy(plusDaysIso(-14), plusDaysIso(14)),
    enabled,
  })
  return { summary, revenue, occupancy }
}
