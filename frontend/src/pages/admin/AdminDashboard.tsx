import { useGetAdminStatsQuery } from '../../store/api/adminApi'
import { IconUsers, IconBuildingBank, IconMessageReport, IconMessageCircle } from '@tabler/icons-react'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useGetAdminStatsQuery()

  if (isLoading) return <LoadingSpinner />
  if (error || !stats) return <div className="text-red-500">Failed to load statistics.</div>

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: <IconUsers size={24} className="text-blue-500" /> },
    { title: 'Companies', value: stats.totalCompanies, icon: <IconBuildingBank size={24} className="text-emerald-500" /> },
    { title: 'Feedbacks', value: stats.totalFeedbacks, icon: <IconMessageReport size={24} className="text-purple-500" /> },
    { title: 'Replies', value: stats.totalReplies, icon: <IconMessageCircle size={24} className="text-amber-500" /> },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-base-200">System Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.title} className="p-4 rounded-xl border border-border bg-background flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-base-100">{card.title}</p>
              <h3 className="text-2xl font-bold text-base-200 mt-1">{card.value}</h3>
            </div>
            <div className="p-3 bg-border/30 rounded-[10px]">
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
