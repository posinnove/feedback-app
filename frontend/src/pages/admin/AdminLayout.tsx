import { Outlet, NavLink, Navigate, useLocation } from 'react-router-dom'
import { IconChartPie, IconBuildingBank, IconMessageReport } from '@tabler/icons-react'

export default function AdminLayout() {
  const location = useLocation()
  
  // Optional: Redirect /admin to /admin/stats
  if (location.pathname === '/admin' || location.pathname === '/admin/') {
    return <Navigate to="/admin/stats" replace />
  }

  const tabs = [
    { name: 'Dashboard', to: '/admin/stats', icon: <IconChartPie size={18} /> },
    { name: 'Companies', to: '/admin/companies', icon: <IconBuildingBank size={18} /> },
    { name: 'Feedbacks', to: '/admin/feedbacks', icon: <IconMessageReport size={18} /> },
  ]

  return (
    <div className="flex flex-col h-full bg-background max-w-5xl mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-base-200">Admin Portal</h1>
        <p className="text-base-100 text-sm">Manage system users, companies, and content.</p>
      </div>

      <nav className="flex gap-4 border-b border-border mb-6">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.to}
            className={({ isActive }) =>
              `flex items-center gap-2 pb-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-base-100 hover:text-base-200 hover:border-border'
              }`
            }
          >
            {tab.icon}
            {tab.name}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1 bg-card-bg rounded-xl border border-border p-6 shadow-sm overflow-hidden flex flex-col">
        <Outlet />
      </div>
    </div>
  )
}
