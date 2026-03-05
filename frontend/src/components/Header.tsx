import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  IconSearch, IconBell, IconHelpCircle, IconChevronDown,
  IconMenu2, IconX, IconLogout, IconUser, IconSettings,
} from '@tabler/icons-react'
import Avatar from './ui/Avatar'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearCredentials } from '../store/slices/authSlice'

interface HeaderProps {
  onMenuToggle: () => void
  sidebarOpen?: boolean
}

export default function Header({ onMenuToggle, sidebarOpen = false }: HeaderProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { entity, type, isAuthenticated } = useAppSelector((s) => s.auth)

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleLogout() {
    dispatch(clearCredentials())
    setDropdownOpen(false)
    navigate('/')
  }

  // Display name logic
  const displayName = entity
    ? type === 'company'
      ? (entity.name ?? entity.email ?? 'Company')
      : `${entity.firstName ?? ''} ${entity.lastName ?? ''}`.trim() || entity.username || entity.email || 'User'
    : ''

  return (
    <header className="bg-white border-b border-border px-4 lg:px-6 py-3 flex items-center justify-between gap-3 sticky top-0 z-30">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 text-base-100 hover:text-base-200 transition-colors"
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
      >
        {sidebarOpen ? <IconX size={22} stroke={1.5} /> : <IconMenu2 size={22} stroke={1.5} />}
      </button>

      {/* Brand */}
      <Link to="/" className="text-xl font-bold text-primary-600 tracking-tight mr-4 lg:mr-6">
        VOXELLA
      </Link>

      {/* Search Bar */}
      <div className="hidden sm:block flex-1 max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch size={18} stroke={1.5} className="text-base-100" />
          </div>
          <input type="text" placeholder="Search..." className="input pl-10" />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 lg:gap-3 ml-auto">
        {/* Mobile search */}
        <button className="sm:hidden p-2 text-base-100 hover:text-base-200 transition-colors" aria-label="Search">
          <IconSearch size={20} stroke={1.5} />
        </button>

        {/* Notification Bell — only when authenticated */}
        {isAuthenticated && (
          <button className="relative p-2 text-base-100 hover:text-base-200 transition-colors" aria-label="Notifications">
            <IconBell size={20} stroke={1.5} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-rejected rounded-full" />
          </button>
        )}

        {/* Help — hidden on mobile */}
        <button className="hidden sm:block relative p-2 text-base-100 hover:text-base-200 transition-colors" aria-label="Help">
          <IconHelpCircle size={20} stroke={1.5} />
        </button>

        {/* Auth state conditional */}
        {isAuthenticated && entity ? (
          /* ── Authenticated: Profile dropdown ── */
          <div
            className="relative flex items-center gap-2 lg:gap-3 pl-2 lg:pl-3 border-l border-border"
            ref={dropdownRef}
          >
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label="User menu"
            >
              <Avatar name={displayName} size="lg" />
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-base-200 leading-tight">{displayName}</span>
                <span className="text-xs text-base-100 capitalize">{type}</span>
              </div>
              <IconChevronDown
                size={16}
                stroke={1.5}
                className={`hidden md:block text-base-100 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-border rounded-xl shadow-lg py-1 z-50">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-medium text-base-200 truncate">{displayName}</p>
                  <p className="text-xs text-base-100 truncate mt-0.5">{entity.email}</p>
                </div>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-base-200 hover:bg-gray-50 transition-colors"
                  onClick={() => { setDropdownOpen(false); navigate(type === 'company' ? '/dashboard' : '/profile') }}
                >
                  <IconUser size={16} stroke={1.5} className="text-base-100" />
                  {type === 'company' ? 'Dashboard' : 'Profile'}
                </button>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-base-200 hover:bg-gray-50 transition-colors"
                  onClick={() => { setDropdownOpen(false) }}
                >
                  <IconSettings size={16} stroke={1.5} className="text-base-100" />
                  Settings
                </button>
                <div className="border-t border-border mt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <IconLogout size={16} stroke={1.5} />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── Unauthenticated: Login + Signup buttons ── */
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
