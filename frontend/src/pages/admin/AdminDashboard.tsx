import { useGetAdminStatsQuery } from '../../store/api/adminApi'
import {
  IconUsers,
  IconBuildingBank,
  IconMessageReport,
  IconMessageCircle,
} from '@tabler/icons-react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useGetAdminStatsQuery()

  if (isLoading) return <LoadingSpinner />
  if (error || !stats)
    return (
      <div className="flex items-center justify-center h-40 rounded-lg bg-red-500/10 border border-red-500/20">
        <p className="text-red-400">Failed to load statistics.</p>
      </div>
    )

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <IconUsers size={24} className="text-blue-400" />,
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Companies',
      value: stats.totalCompanies,
      icon: <IconBuildingBank size={24} className="text-emerald-400" />,
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Feedbacks',
      value: stats.totalFeedbacks,
      icon: <IconMessageReport size={24} className="text-purple-400" />,
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Replies',
      value: stats.totalReplies,
      icon: <IconMessageCircle size={24} className="text-amber-400" />,
      bgColor: 'bg-amber-500/10',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-base-200">System Overview</h2>
        <p className="text-sm text-base-100 mt-1">
          Live metrics across users, companies, and activity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card
            key={card.title}
            className="bg-sidebar-bg/40 border-border/60 hover:border-border/80 hover:bg-sidebar-bg/60 transition-all duration-200"
          >
            <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
              <CardDescription className="font-medium text-base-200">{card.title}</CardDescription>
              {/* <div className={`p-2.5 ${card.bgColor} rounded-lg border border-border/40`}>
                {card.icon}
              </div> */}
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl font-bold text-base-200">{card.value}</CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
