import {
  IconSearch,
  IconBell,
  IconHelpCircle,
  IconChevronDown,
  IconMenu2,
  IconX,
  // IconSun,
  // IconMoon,
  // IconDeviceDesktop,
  IconLogout,
  IconUser,
  IconSettings,
} from '@tabler/icons-react'
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Avatar from './ui/Avatar'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearCredentials } from '../store/slices/authSlice'
import { useLogoutMutation } from '../store/api/authApi'
import {
  useAdvancedSearchQuery,
  useGetNotificationsQuery,
  useMarkNotificationsAsReadMutation,
} from '../store/api/companyApi'

// type ThemeMode = 'system' | 'light' | 'dark'

interface HeaderProps {
  onMenuToggle: () => void
  sidebarOpen: boolean
  // themeMode: ThemeMode
  // onThemeModeChange: (mode: ThemeMode) => void
}

export default function Header({
  onMenuToggle,
  sidebarOpen,
  // themeMode,
  // onThemeModeChange,
}: HeaderProps) {
  const iconButtonClass =
    'p-2 cursor-pointer rounded-lg text-base-100 hover:text-base-200 hover:bg-border/50 transition-colors'

  // const handleThemeCycle = () => {
  //   const nextMode: Record<ThemeMode, ThemeMode> = {
  //     system: 'light',
  //     light: 'dark',
  //     dark: 'system',
  //   }
  //   onThemeModeChange(nextMode[themeMode])
  // }

  // const themeLabel: Record<ThemeMode, string> = {
  //   system: 'Theme: System',
  //   light: 'Theme: Light',
  //   dark: 'Theme: Dark',
  // }

  // const ThemeIcon =
  //   themeMode === 'system' ? IconDeviceDesktop : themeMode === 'light' ? IconSun : IconMoon

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { entity, type, isAuthenticated } = useAppSelector((s) => s.auth)

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '')
  const [debouncedSearch, setDebouncedSearch] = useState((searchParams.get('q') ?? '').trim())
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchDropdownRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      setDebouncedSearch(searchInput.trim())
    }, 250)

    return () => clearTimeout(timer)
  }, [searchInput])

  const { data: searchResults, isFetching: isSearching } = useAdvancedSearchQuery(debouncedSearch, {
    skip: debouncedSearch.length < 2,
  })

  const hasSearchResults =
    (searchResults?.companies.length ?? 0) > 0 ||
    (searchResults?.feedbacks.length ?? 0) > 0 ||
    (searchResults?.replies.length ?? 0) > 0

  const {
    data: latestFeed,
    isFetching: isFetchingNotifications,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 30000,
  })
  const [markNotificationsAsRead] = useMarkNotificationsAsReadMutation()
  const [logout] = useLogoutMutation()

  const notificationItems = latestFeed?.notifications ?? []
  const unreadCount = notificationItems.filter((item) => !item.isRead).length

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(e.target as Node)) {
        setSearchDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleLogout() {
    void logout()
    dispatch(clearCredentials())
    setDropdownOpen(false)
    setNotificationsOpen(false)
    navigate('/')
  }

  function openNotifications() {
    setNotificationsOpen((prev) => !prev)
  }

  async function handleNotificationClick(
    notificationId: number,
    feedbackId: number,
    isRead: boolean
  ) {
    setNotificationsOpen(false)
    navigate(`/request/${feedbackId}`)

    if (isRead) {
      return
    }

    try {
      await markNotificationsAsRead({ notificationIds: [notificationId] }).unwrap()
      void refetchNotifications()
    } catch {
      // Keep navigation smooth even if mark-as-read request fails.
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const query = searchInput.trim()
    if (query.length < 2) {
      return
    }
    setSearchDropdownOpen(false)
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  // Display name logic
  const displayName = entity
    ? type === 'company'
      ? (entity.name ?? entity.email ?? 'Company')
      : `${entity.firstName ?? ''} ${entity.lastName ?? ''}`.trim() || entity.email || 'User'
    : ''

  const emailValue = entity?.email ?? ''
  // const truncatedEmail =
  //   emailValue.length > 18 ? `${emailValue.slice(0, 6)}...${emailValue.slice(-9)}` : emailValue

  return (
    <header className="bg-card-bg border-b border-border px-4 lg:px-6 py-3 flex items-center justify-between gap-3 sticky top-0 z-30">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 cursor-pointer rounded-lg text-base-100 hover:text-base-200 hover:bg-border/50 transition-colors"
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
      >
        {sidebarOpen ? <IconX size={22} stroke={1.5} /> : <IconMenu2 size={22} stroke={1.5} />}
      </button>

      {/* Brand */}
      <div className="shrink-0 w-[13%]">
        <Link to="/" className="text-2xl font-bold text-primary-600 tracking-tight">
          VOXELLA
        </Link>
      </div>

      {/* Search Bar */}
      <div className="hidden md:block flex-1 min-w-0 max-w-xl ml-11">
        <div className="relative" ref={searchDropdownRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch size={18} stroke={1.5} className="text-base-100" />
            </div>
            <input
              type="text"
              placeholder="Search companies, feedback, replies..."
              className="input pl-10"
              value={searchInput}
              onFocus={() => {
                if (searchInput.trim().length >= 2) {
                  setSearchDropdownOpen(true)
                }
              }}
              onChange={(event) => {
                const value = event.target.value
                setSearchInput(value)
                setSearchDropdownOpen(value.trim().length >= 2)
              }}
            />
          </form>

          {searchDropdownOpen && debouncedSearch.length >= 2 && (
            <div className="absolute top-full mt-2 w-full bg-card-bg border border-border rounded-xl shadow-lg z-50 overflow-hidden">
              {isSearching ? (
                <p className="px-4 py-3 text-sm text-base-100">Searching...</p>
              ) : !hasSearchResults ? (
                <p className="px-4 py-3 text-sm text-base-100">No matches found.</p>
              ) : (
                <div className="max-h-104 overflow-y-auto">
                  {(searchResults?.companies.length ?? 0) > 0 && (
                    <div className="p-2 border-b border-border">
                      <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-base-100">
                        Companies
                      </p>
                      {searchResults?.companies.slice(0, 4).map((company) => (
                        <button
                          key={`company-${company.id}`}
                          type="button"
                          className="w-full text-left px-2 py-2 rounded-lg hover:bg-border/40 transition-colors"
                          onClick={() => {
                            setSearchDropdownOpen(false)
                            navigate(`/company/${company.slug}`)
                          }}
                        >
                          <p className="text-sm font-medium text-base-200">{company.name}</p>
                          <p className="text-xs text-base-100 line-clamp-1">
                            {company.description?.replace(/<[^>]*>/g, ' ') || 'No description'}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {(searchResults?.feedbacks.length ?? 0) > 0 && (
                    <div className="p-2 border-b border-border">
                      <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-base-100">
                        Feedback requests
                      </p>
                      {searchResults?.feedbacks.slice(0, 4).map((feedback) => (
                        <button
                          key={`feedback-${feedback.id}`}
                          type="button"
                          className="w-full text-left px-2 py-2 rounded-lg hover:bg-border/40 transition-colors"
                          onClick={() => {
                            setSearchDropdownOpen(false)
                            navigate(`/request/${feedback.id}`)
                          }}
                        >
                          <p className="text-sm font-medium text-base-200 line-clamp-1">
                            {feedback.title}
                          </p>
                          <p className="text-xs text-base-100 line-clamp-1">
                            {feedback.company.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {(searchResults?.replies.length ?? 0) > 0 && (
                    <div className="p-2">
                      <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-base-100">
                        Replies
                      </p>
                      {searchResults?.replies.slice(0, 4).map((reply) => (
                        <button
                          key={`reply-${reply.id}`}
                          type="button"
                          className="w-full text-left px-2 py-2 rounded-lg hover:bg-border/40 transition-colors"
                          onClick={() => {
                            setSearchDropdownOpen(false)
                            navigate(`/request/${reply.feedbackId}`)
                          }}
                        >
                          <p className="text-sm font-medium text-base-200 line-clamp-1">
                            {reply.feedbackTitle}
                          </p>
                          <p className="text-xs text-base-100 line-clamp-1">
                            {reply.content.replace(/<[^>]*>/g, ' ')}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    className="w-full border-t border-border text-sm font-medium text-primary-600 px-4 py-2.5 hover:bg-primary-100/30 transition-colors"
                    onClick={() => {
                      const query = searchInput.trim()
                      if (query.length < 2) {
                        return
                      }
                      setSearchDropdownOpen(false)
                      navigate(`/search?q=${encodeURIComponent(query)}`)
                    }}
                  >
                    View all results for "{searchInput.trim()}"
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 ml-auto">
        {/* Mobile search */}
        <button
          className={`sm:hidden ${iconButtonClass}`}
          aria-label="Search"
          onClick={() => {
            const query = searchInput.trim()
            navigate(`/search${query.length >= 2 ? `?q=${encodeURIComponent(query)}` : ''}`)
          }}
        >
          <IconSearch size={20} stroke={1.5} />
        </button>

        {/* Notification Bell — only when authenticated */}
        {isAuthenticated && (
          <div className="relative" ref={notificationsRef}>
            <button
              className={`relative ${iconButtonClass}`}
              aria-label="Notifications"
              onClick={openNotifications}
            >
              <IconBell size={20} stroke={1.5} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-status-rejected text-white text-[10px] leading-none flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-88 max-w-[85vw] bg-card-bg border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-base-200">Notifications</p>
                  <span className="text-xs text-base-100">{unreadCount} unread</span>
                </div>

                {isFetchingNotifications ? (
                  <p className="px-4 py-3 text-sm text-base-100">Loading notifications...</p>
                ) : notificationItems.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-base-100">No new notifications yet.</p>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {notificationItems.map((item) => {
                      return (
                        <button
                          key={`notification-${item.id}`}
                          type="button"
                          className="w-full text-left px-4 py-3 border-b border-border last:border-b-0 hover:bg-border/30 transition-colors"
                          onClick={() =>
                            void handleNotificationClick(item.id, item.feedbackId, item.isRead)
                          }
                        >
                          <div className="flex items-start gap-2">
                            {!item.isRead ? (
                              <span className="mt-1.5 h-2 w-2 rounded-full bg-primary-600 shrink-0" />
                            ) : (
                              <span className="mt-1.5 h-2 w-2 rounded-full bg-border shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-base-200 line-clamp-2">
                                {item.title}
                              </p>
                              <p className="text-xs text-base-100 mt-1 line-clamp-1">
                                {item.feedback?.company?.name ?? 'Unknown company'}
                              </p>
                              {item.message && (
                                <p className="text-xs text-base-100 mt-0.5 line-clamp-1">
                                  {item.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {/* <button
          onClick={handleThemeCycle}
          className={`relative ${iconButtonClass}`}
          aria-label={themeLabel[themeMode]}
          title={`${themeLabel[themeMode]} (click to change)`}
        >
          <ThemeIcon size={20} stroke={1.5} />
        </button> */}
        {/* Help — hidden on mobile */}
        <button className={`hidden sm:block relative ${iconButtonClass}`} aria-label="Help">
          <IconHelpCircle size={20} stroke={1.5} />
        </button>

        {/* Auth state conditional */}
        {isAuthenticated && entity ? (
          /* Authenticated: Profile dropdown */
          <div
            className="relative flex items-center gap-2 lg:gap-3 pl-2 lg:pl-3 border-l border-border"
            ref={dropdownRef}
          >
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity hover:cursor-pointer"
              aria-label="User menu"
            >
              <Avatar
                name={displayName}
                avatar={entity.avatarUrl ?? entity.logoUrl ?? undefined}
                size="lg"
              />
              {/* <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-base-200 leading-tight">
                  {displayName}
                </span>
                <span className="text-xs text-base-100" title={emailValue}>
                  {truncatedEmail}
                </span>
              </div> */}
              <IconChevronDown
                size={16}
                stroke={1.5}
                className={`hidden md:block text-base-100 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-card-bg border border-border rounded-xl shadow-lg py-1 z-50">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-medium text-base-200 truncate">{displayName}</p>
                  <p className="text-xs text-base-100 mt-0.5">{emailValue}</p>
                </div>
                <button
                  className="w-full flex hover:cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-base-200 hover:bg-border/40 transition-colors"
                  onClick={() => {
                    setDropdownOpen(false)
                    navigate('/profile')
                  }}
                >
                  <IconUser size={16} stroke={1.5} className="text-base-100" />
                  Profile
                </button>
                <button
                  className="w-full flex items-center hover:cursor-pointer gap-3 px-4 py-2.5 text-sm text-base-200 hover:bg-border/40 transition-colors"
                  onClick={() => {
                    setDropdownOpen(false)
                    navigate('/settings')
                  }}
                >
                  <IconSettings size={16} stroke={1.5} className="text-base-100" />
                  Settings
                </button>
                <div className="border-t border-border mt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full hover:cursor-pointer flex items-center gap-3 px-4 py-2.5 text-sm text-status-rejected hover:bg-status-rejected/10 transition-colors"
                  >
                    <IconLogout size={16} stroke={1.5} />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Unauthenticated: Login + Signup buttons */
          <div className="flex items-center gap-2 pl-2 lg:pl-3 border-l border-border">
            <Link
              to="/auth/login"
              className="px-3 py-1.5 text-sm font-medium text-base-200 hover:text-primary-600 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/auth/register"
              className="px-4 py-1.5 text-sm font-medium bg-primary-600 text-white rounded-full hover:bg-primary-800 transition-colors"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
