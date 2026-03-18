import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  IconPlus,
  IconChevronUp,
  IconEye,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from '@tabler/icons-react'
import CompanyListItem from './ui/CompanyListItem'
import { useGetCompaniesQuery } from '../store/api/companyApi'
import { NAV_ITEMS } from '../utils/navItems'

interface SidebarProps {
  open: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export default function Sidebar({ open, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation()
  const { data: companies, isLoading: companiesLoading } = useGetCompaniesQuery()

  const prevPathname = useRef(location.pathname)
  useEffect(() => {
    if (prevPathname.current !== location.pathname) {
      prevPathname.current = location.pathname
      onClose()
    }
  }, [location.pathname, onClose])

  const renderSidebarContent = (isCollapsed: boolean, isDesktop: boolean) => (
    <>
      {isDesktop && (
        <button
          onClick={onToggleCollapse}
          className="absolute top-4 -right-3 z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-border bg-card-bg text-base-100 hover:text-base-200 hover:bg-border/50 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <IconLayoutSidebarLeftExpand size={14} stroke={1.8} />
          ) : (
            <IconLayoutSidebarLeftCollapse size={14} stroke={1.8} />
          )}
        </button>
      )}

      {/* Navigation Header - Fixed */}
      <nav className="px-2 pt-4 shrink-0">
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isCollapsed ? 'justify-center px-2' : ''} ${
                  isActive
                    ? 'bg-primary-100 text-primary-600 font-medium'
                    : 'text-base-200 hover:bg-border/50'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {item.icon}
                {!isCollapsed && (
                  <span className={`transition-all duration-150`}>{item.label}</span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Business Account */}
        <Link
          to="/business"
          className={`flex items-center gap-3 px-3 py-2 mt-2 rounded-lg text-sm text-base-200 hover:bg-border/50 transition-colors ${isCollapsed ? 'justify-center px-2' : ''}`}
          title={isCollapsed ? 'Business Account' : undefined}
        >
          <IconPlus size={20} stroke={1.5} />
          <span
            className={`transition-all duration-150 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'opacity-100'}`}
          >
            Business Account
          </span>
        </Link>
      </nav>

      {/* Companies Section Header - Fixed */}
      <div className={`px-3 mt-6 mb-2 shrink-0 ${isCollapsed ? 'hidden' : ''}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-base-100 uppercase tracking-wider">
            Companies
          </h3>
          <button
            className="text-base-100 hover:text-base-200 transition-colors"
            aria-label="Toggle companies"
          >
            <IconChevronUp size={14} stroke={1.5} />
          </button>
        </div>
      </div>

      <Link
        to="/manage-businesses"
        className={`flex items-center gap-3 px-3 py-2 text-sm text-base-200 hover:bg-border/50 transition-colors mb-1 shrink-0 mx-2 rounded-lg ${isCollapsed ? 'hidden' : ''}`}
      >
        <IconEye size={20} stroke={1.5} />
        Manage Businesses
      </Link>

      {/* Companies List - Scrollable */}
      <div className={`flex-1 overflow-y-auto px-2 ${isCollapsed ? 'hidden' : ''}`}>
        <div className="space-y-0.5">
          {companiesLoading ? (
            <div className="px-3 py-2 text-xs text-base-100">Loading...</div>
          ) : (
            companies?.map((company) => (
              <CompanyListItem key={company.slug} name={company.name} slug={company.slug} />
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t border-border shrink-0 ${isCollapsed ? 'px-2 py-3' : ''}`}>
        {isCollapsed ? (
          <p className="text-[10px] text-base-100 text-center" title="Voxella, Inc.">
            © {new Date().getFullYear()}
          </p>
        ) : (
          <p className="text-xs text-base-100">
            Voxella, Inc. © {new Date().getFullYear()}. All rights reserved.
          </p>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Backdrop — mobile only */}
      {open && (
        <div className="fixed inset-0 top-[57px] z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`${open ? 'flex' : 'hidden'} lg:hidden fixed top-[57px] bottom-0 left-0 z-50 w-[86vw] max-w-80 bg-sidebar-bg border-r border-border flex-col shadow-xl`}
      >
        {renderSidebarContent(false, false)}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex absolute top-0 bottom-0 left-0 z-20 ${collapsed ? 'w-16' : 'w-52'} bg-sidebar-bg border-r border-border flex-col relative shadow-none transition-[width]`}
      >
        {renderSidebarContent(collapsed, true)}
      </aside>
    </>
  )
}
