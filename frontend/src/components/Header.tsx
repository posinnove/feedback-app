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
import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Avatar from './ui/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { PopoverHeader } from './ui/popover-header'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { InteractiveRow } from './ui/interactive-row'
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
    'h-9 w-9 rounded-lg p-0 text-base-100 hover:text-base-200 hover:bg-border/50'

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

  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '')
  const [debouncedSearch, setDebouncedSearch] = useState((searchParams.get('q') ?? '').trim())
  const [searchPopoverOpen, setSearchPopoverOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

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

  function handleLogout() {
    void logout()
    dispatch(clearCredentials())
    setNotificationsOpen(false)
    navigate('/')
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
    setSearchPopoverOpen(false)
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
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onMenuToggle}
        className={`lg:hidden ${iconButtonClass}`}
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
      >
        {sidebarOpen ? <IconX size={22} stroke={1.5} /> : <IconMenu2 size={22} stroke={1.5} />}
      </Button>

      {/* Brand */}
      <div className="shrink-0 w-[13%]">
        <Link to="/" className="text-2xl font-bold text-primary-600 tracking-tight">
          VOXELLA
        </Link>
      </div>

      {/* Search Bar */}
      <div className="hidden md:block flex-1 min-w-0 max-w-xl ml-11">
        <Popover open={searchPopoverOpen} onOpenChange={setSearchPopoverOpen}>
          <PopoverTrigger asChild>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconSearch size={18} stroke={1.5} className="text-base-100" />
              </div>
              <Input
                type="text"
                placeholder="Search companies, feedback, replies..."
                className="pl-10"
                value={searchInput}
                onFocus={() => {
                  if (searchInput.trim().length >= 2) {
                    setSearchPopoverOpen(true)
                  }
                }}
                onChange={(event) => {
                  const value = event.target.value
                  setSearchInput(value)
                  setSearchPopoverOpen(value.trim().length >= 2)
                }}
              />
            </form>
          </PopoverTrigger>

          {searchPopoverOpen && debouncedSearch.length >= 2 && (
            <PopoverContent
              align="start"
              className="w-(--radix-popover-trigger-width) max-w-none overflow-hidden p-0"
            >
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
                        <InteractiveRow
                          key={`company-${company.id}`}
                          className="px-2 py-2"
                          onClick={() => {
                            setSearchPopoverOpen(false)
                            navigate(`/company/${company.slug}`)
                          }}
                        >
                          <p className="text-sm font-medium text-base-200">{company.name}</p>
                          <p className="text-xs text-base-100 line-clamp-1">
                            {company.description?.replace(/<[^>]*>/g, ' ') || 'No description'}
                          </p>
                        </InteractiveRow>
                      ))}
                    </div>
                  )}

                  {(searchResults?.feedbacks.length ?? 0) > 0 && (
                    <div className="p-2 border-b border-border">
                      <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-base-100">
                        Feedback requests
                      </p>
                      {searchResults?.feedbacks.slice(0, 4).map((feedback) => (
                        <InteractiveRow
                          key={`feedback-${feedback.id}`}
                          className="px-2 py-2"
                          onClick={() => {
                            setSearchPopoverOpen(false)
                            navigate(`/request/${feedback.id}`)
                          }}
                        >
                          <p className="text-sm font-medium text-base-200 line-clamp-1">
                            {feedback.title}
                          </p>
                          <p className="text-xs text-base-100 line-clamp-1">
                            {feedback.company.name}
                          </p>
                        </InteractiveRow>
                      ))}
                    </div>
                  )}

                  {(searchResults?.replies.length ?? 0) > 0 && (
                    <div className="p-2">
                      <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-base-100">
                        Replies
                      </p>
                      {searchResults?.replies.slice(0, 4).map((reply) => (
                        <InteractiveRow
                          key={`reply-${reply.id}`}
                          className="px-2 py-2"
                          onClick={() => {
                            setSearchPopoverOpen(false)
                            navigate(`/request/${reply.feedbackId}`)
                          }}
                        >
                          <p className="text-sm font-medium text-base-200 line-clamp-1">
                            {reply.feedbackTitle}
                          </p>
                          <p className="text-xs text-base-100 line-clamp-1">
                            {reply.content.replace(/<[^>]*>/g, ' ')}
                          </p>
                        </InteractiveRow>
                      ))}
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto w-full justify-start rounded-none border-t border-border px-4 py-2.5 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-100/30"
                    onClick={() => {
                      const query = searchInput.trim()
                      if (query.length < 2) {
                        return
                      }
                      setSearchPopoverOpen(false)
                      navigate(`/search?q=${encodeURIComponent(query)}`)
                    }}
                  >
                    View all results for "{searchInput.trim()}"
                  </Button>
                </div>
              )}
            </PopoverContent>
          )}
        </Popover>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 ml-auto">
        {/* Mobile search */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`sm:hidden ${iconButtonClass}`}
          aria-label="Search"
          onClick={() => {
            const query = searchInput.trim()
            navigate(`/search${query.length >= 2 ? `?q=${encodeURIComponent(query)}` : ''}`)
          }}
        >
          <IconSearch size={20} stroke={1.5} />
        </Button>

        {/* Notification Bell — only when authenticated */}
        {isAuthenticated && (
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={`relative ${iconButtonClass}`}
                aria-label="Notifications"
              >
                <IconBell size={20} stroke={1.5} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-status-rejected text-white text-[10px] leading-none flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-88 max-w-[85vw] overflow-hidden p-0">
              <PopoverHeader title="Notifications" meta={`${unreadCount} unread`} />

              {isFetchingNotifications ? (
                <p className="px-4 py-3 text-sm text-base-100">Loading notifications...</p>
              ) : notificationItems.length === 0 ? (
                <p className="px-4 py-3 text-sm text-base-100">No new notifications yet.</p>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {notificationItems.map((item) => {
                    return (
                      <InteractiveRow
                        key={`notification-${item.id}`}
                        className="rounded-none border-b border-border px-4 py-3 last:border-b-0 hover:bg-border/30"
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
                      </InteractiveRow>
                    )
                  })}
                </div>
              )}
            </PopoverContent>
          </Popover>
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
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`hidden sm:inline-flex relative ${iconButtonClass}`}
          aria-label="Help"
        >
          <IconHelpCircle size={20} stroke={1.5} />
        </Button>

        {/* Auth state conditional */}
        {isAuthenticated && entity ? (
          /* Authenticated: Profile dropdown */
          <div className="relative flex items-center gap-2 lg:gap-3 pl-2 lg:pl-3 border-l border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 gap-2 px-1.5 hover:opacity-80"
                  aria-label="User menu"
                >
                  <Avatar
                    name={displayName}
                    avatar={entity.avatarUrl ?? entity.logoUrl ?? undefined}
                    size="lg"
                  />
                  <IconChevronDown
                    size={16}
                    stroke={1.5}
                    className="hidden md:block text-base-100"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium text-base-200 truncate">{displayName}</p>
                  <p className="text-xs text-base-100 mt-0.5">{emailValue}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    navigate('/profile')
                  }}
                >
                  <IconUser size={16} stroke={1.5} className="text-base-100" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    navigate('/settings')
                  }}
                >
                  <IconSettings size={16} stroke={1.5} className="text-base-100" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-status-rejected focus:bg-status-rejected/10"
                >
                  <IconLogout size={16} stroke={1.5} />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          /* Unauthenticated: Login + Signup buttons */
          <div className="flex items-center gap-2 pl-2 lg:pl-3 border-l border-border">
            <Link to="/auth/login" className="inline-flex items-center">
              <Button variant="ghost" size="sm" className="px-3">
                Sign in
              </Button>
            </Link>
            <Link to="/auth/register" className="inline-flex items-center">
              <Button size="sm" className="rounded-full px-4">
                Sign up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
