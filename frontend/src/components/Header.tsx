import { Link } from 'react-router-dom'
import {
  IconSearch,
  IconBell,
  IconHelpCircle,
  IconChevronDown,
  IconMenu2,
  IconX,
  IconSun,
  IconMoon,
  IconDeviceDesktop,
} from '@tabler/icons-react'
import Avatar from './ui/Avatar'

type ThemeMode = 'system' | 'light' | 'dark'

interface HeaderProps {
  onMenuToggle: () => void
  sidebarOpen: boolean
  themeMode: ThemeMode
  onThemeModeChange: (mode: ThemeMode) => void
}

export default function Header({
  onMenuToggle,
  sidebarOpen,
  themeMode,
  onThemeModeChange,
}: HeaderProps) {
  const iconButtonClass =
    'p-2 cursor-pointer rounded-lg text-base-100 hover:text-base-200 hover:bg-border/50 transition-colors'

  const handleThemeCycle = () => {
    const nextMode: Record<ThemeMode, ThemeMode> = {
      system: 'light',
      light: 'dark',
      dark: 'system',
    }
    onThemeModeChange(nextMode[themeMode])
  }

  const themeLabel: Record<ThemeMode, string> = {
    system: 'Theme: System',
    light: 'Theme: Light',
    dark: 'Theme: Dark',
  }

  const ThemeIcon =
    themeMode === 'system' ? IconDeviceDesktop : themeMode === 'light' ? IconSun : IconMoon

  return (
    <header className="bg-card-bg border-b border-border px-4 lg:px-6 py-3 flex items-center justify-between gap-3">
      {/* Mobile menu button — toggles between hamburger and close */}
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
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch size={18} stroke={1.5} className="text-base-100" />
          </div>
          <input type="text" placeholder="Search..." className="input pl-10" />
        </div>
      </div>

      {/* Right Side - Icons and User */}
      <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 ml-auto">
        {/* Mobile search button */}
        <button className={`sm:hidden ${iconButtonClass}`} aria-label="Search">
          <IconSearch size={20} stroke={1.5} />
        </button>

        {/* Notification Bell */}
        <button className={`relative ${iconButtonClass}`} aria-label="Notifications">
          <IconBell size={20} stroke={1.5} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-rejected rounded-full"></span>
        </button>

        {/* Theme Mode: System -> Light -> Dark */}
        <button
          onClick={handleThemeCycle}
          className={`relative ${iconButtonClass}`}
          aria-label={themeLabel[themeMode]}
          title={`${themeLabel[themeMode]} (click to change)`}
        >
          <ThemeIcon size={20} stroke={1.5} />
        </button>

        {/* Info / Help — hidden on mobile */}
        <button className={`hidden sm:block relative ${iconButtonClass}`} aria-label="Help">
          <IconHelpCircle size={20} stroke={1.5} />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-3 border-l border-border">
          <Avatar name="Mellow Junior" size="lg" />
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium text-base-200">Mellow Junior</span>
          </div>
          <button
            className="hidden md:block p-1.5 cursor-pointer rounded-md text-base-100 hover:text-base-200 hover:bg-border/50 transition-colors"
            aria-label="User menu"
          >
            <IconChevronDown size={16} stroke={1.5} />
          </button>
        </div>
      </div>
    </header>
  )
}
