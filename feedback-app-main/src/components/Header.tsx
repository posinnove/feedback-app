import { Link } from 'react-router-dom'
import { IconSearch, IconBell, IconHelpCircle, IconChevronDown, IconMenu2, IconX } from '@tabler/icons-react'
import Avatar from './ui/Avatar'

interface HeaderProps {
  onMenuToggle: () => void
  sidebarOpen?: boolean
}

export default function Header({ onMenuToggle, sidebarOpen = false }: HeaderProps) {
  return (
    <header className="bg-white border-b border-border px-4 lg:px-6 py-3 flex items-center justify-between gap-3">
      {/* Mobile menu button — toggles between hamburger and close */}
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
          <input
            type="text"
            placeholder="Search..."
            className="input pl-10"
          />
        </div>
      </div>

      {/* Right Side - Icons and User */}
      <div className="flex items-center gap-2 lg:gap-3 ml-auto">
        {/* Mobile search button */}
        <button className="sm:hidden p-2 text-base-100 hover:text-base-200 transition-colors" aria-label="Search">
          <IconSearch size={20} stroke={1.5} />
        </button>

        {/* Notification Bell */}
        <button className="relative p-2 text-base-100 hover:text-base-200 transition-colors" aria-label="Notifications">
          <IconBell size={20} stroke={1.5} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-rejected rounded-full"></span>
        </button>

        {/* Info / Help — hidden on mobile */}
        <button className="hidden sm:block relative p-2 text-base-100 hover:text-base-200 transition-colors" aria-label="Help">
          <IconHelpCircle size={20} stroke={1.5} />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-3 border-l border-border">
          <Avatar name="Mellow Junior" size="lg" />
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium text-base-200">Mellow Junior</span>
          </div>
          <button className="hidden md:block text-base-100 hover:text-base-200" aria-label="User menu">
            <IconChevronDown size={16} stroke={1.5} />
          </button>
        </div>
      </div>
    </header>
  )
}
