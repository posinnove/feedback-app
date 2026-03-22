import { useEffect, useMemo, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  IconPlus,
  // IconChevronUp,
  // IconCompass,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from '@tabler/icons-react'
import CompanyListItem from './ui/CompanyListItem'
import { Button } from './ui/button'
import { useGetFollowedCompaniesQuery } from '../store/api/companyApi'
import { useAppSelector } from '../store/hooks'
import { NAV_ITEMS, KANBAN_NAV_ITEM } from '../utils/navItems'
import { useGsapStagger } from '../utils/gsapMotion'
import { motionProfile } from '../utils/motionProfile'

interface SidebarProps {
  open: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export default function Sidebar({ open, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation()
  const { isAuthenticated, type } = useAppSelector((s) => s.auth)
  const isCompanyUser = isAuthenticated && type === 'company'
  const { data: followedCompanies, isLoading: companiesLoading } = useGetFollowedCompaniesQuery(
    undefined,
    { skip: !isAuthenticated || isCompanyUser }
  )

  const prevPathname = useRef(location.pathname)
  const mobileDrawerRef = useRef<HTMLElement | null>(null)

  useGsapStagger(mobileDrawerRef, '[data-gsap-drawer-item]', [open, location.pathname], {
    x: motionProfile.sidebar.drawerItems.x,
    duration: motionProfile.sidebar.drawerItems.duration,
    stagger: motionProfile.sidebar.drawerItems.stagger,
    enabled: open,
  })
  useEffect(() => {
    if (prevPathname.current !== location.pathname) {
      prevPathname.current = location.pathname
      onClose()
    }
  }, [location.pathname, onClose])

  const followedCompanyList = useMemo(() => followedCompanies ?? [], [followedCompanies])

  const filteredNavItems = useMemo(() => {
    return NAV_ITEMS.filter((item) => {
      // Hide "Explore Companies" for company users
      if (isCompanyUser && item.path === '/explore') return false
      return true
    })
  }, [isCompanyUser])

  const renderSidebarContent = (isCollapsed: boolean, isDesktop: boolean) => (
    <>
      {isDesktop && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onToggleCollapse}
          className="absolute top-4 -right-3 z-20 h-6 w-6 rounded-full border border-border bg-card-bg p-0 text-base-100 hover:bg-border/50 hover:text-base-200"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <IconLayoutSidebarLeftExpand size={14} stroke={1.8} />
          ) : (
            <IconLayoutSidebarLeftCollapse size={14} stroke={1.8} />
          )}
        </Button>
      )}

      {/* Navigation Header - Fixed */}
      <nav className="px-2 pt-4 shrink-0">
        <div className="space-y-0.5">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                data-gsap-drawer-item
                className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isCollapsed ? 'justify-center px-2' : ''} ${
                  isActive ? 'bg-active font-medium' : 'hover:bg-border/50'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className={`transition-all duration-150`}>{item.label}</span>
                )}
              </Link>
            )
          })}
          {isCompanyUser && (
            <Link
              to={KANBAN_NAV_ITEM.path}
              data-gsap-drawer-item
              className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isCollapsed ? 'justify-center px-2' : ''} ${
                location.pathname === KANBAN_NAV_ITEM.path
                  ? 'bg-active font-medium'
                  : 'hover:bg-border/50'
              }`}
              title={isCollapsed ? KANBAN_NAV_ITEM.label : undefined}
            >
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                {KANBAN_NAV_ITEM.icon}
              </span>
              {!isCollapsed && (
                <span className={`transition-all duration-150`}>{KANBAN_NAV_ITEM.label}</span>
              )}
            </Link>
          )}
        </div>

        {!isCompanyUser && (
          <Link
            to="/request-feedback"
            data-gsap-drawer-item
            className={`group flex items-center gap-3 px-3 py-2 mt-2 rounded-lg text-sm text-base-200 hover:bg-border/50 transition-all duration-200 ${isCollapsed ? 'justify-center px-2' : ''}`}
            title={isCollapsed ? 'Provide Feedback' : undefined}
          >
            <IconPlus
              size={20}
              stroke={1.5}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
            <span
              className={`transition-all duration-150 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'opacity-100'}`}
            >
              Provide Feedback
            </span>
          </Link>
        )}

        {!isAuthenticated && !isDesktop && !isCollapsed && (
          <div data-gsap-drawer-item className="mt-3 grid grid-cols-2 gap-2 px-1">
            <Link
              to="/auth/login"
              className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-sm font-semibold text-base-200 hover:bg-border/50 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/auth/register"
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-800 transition-colors"
            >
              Sign up
            </Link>
          </div>
        )}
      </nav>

      {/* Companies Section Header - Fixed */}
      {isAuthenticated && !isCompanyUser && (
        <div className={`px-3 mt-6 mb-2 shrink-0 ${isCollapsed ? 'hidden' : ''}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-base-100 uppercase tracking-wider">
              Followed Companies
            </h3>
            {/* <button
              className="text-base-100 hover:text-base-200 transition-colors"
              aria-label="Toggle companies"
            >
              <IconChevronUp size={14} stroke={1.5} />
            </button> */}
          </div>
        </div>
      )}

      {/* <Link
        to="/explore"
        className={`flex items-center gap-3 px-3 py-2 text-sm text-base-200 hover:bg-border/50 transition-colors mb-1 shrink-0 mx-2 rounded-lg ${isCollapsed ? 'hidden' : ''}`}
      >
        <IconCompass size={20} stroke={1.5} />
        Explore Companies
      </Link> */}

      {/* Companies List - Scrollable */}
      {isAuthenticated && !isCompanyUser && (
        <div className={`flex-1 overflow-y-auto px-2 ${isCollapsed ? 'hidden' : ''}`}>
          <div className="space-y-0.5">
            {companiesLoading ? (
              <div className="px-3 py-2 text-xs text-base-100">Loading...</div>
            ) : followedCompanyList.length === 0 ? (
              <div className="px-3 py-2 text-xs text-base-100">
                No followed companies yet. Visit Explore to follow.
              </div>
            ) : (
              followedCompanyList.map((company) => (
                <CompanyListItem
                  key={company.slug}
                  name={company.name}
                  slug={company.slug}
                  logo={company.logoUrl ?? undefined}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Spacer to keep footer pinned to the bottom */}
      <div className="flex-1" />

      {/* Footer */}
      <div className={`p-4 border-t border-border shrink-0 ${isCollapsed ? 'px-2 py-3' : ''}`}>
        {isCollapsed ? (
          <p className="text-[10px] text-base-100 text-center" title="Voxella, Inc.">
            © 2026
          </p>
        ) : (
          <p className="text-xs text-base-100">Voxella, Inc. © 2026. All rights reserved.</p>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        className={`fixed inset-0 top-14.25 z-40 bg-black/50 lg:hidden transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Mobile Sidebar */}
      <aside
        ref={mobileDrawerRef}
        className={`lg:hidden fixed top-14.25 bottom-0 right-0 z-50 w-[86vw] max-w-80 bg-sidebar-bg border-l border-border flex flex-col shadow-xl transition-transform duration-300 ease-out will-change-transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
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
