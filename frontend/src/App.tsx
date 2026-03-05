import { useState, useCallback, useEffect } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import PublicFeedbackBoard from './components/PublicFeedbackBoard'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import CompanyBoardPage from './pages/CompanyBoardPage'
import RequestDetailPage from './pages/RequestDetailPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import VerifyEmailPage from './pages/auth/VerifyEmailPage'
import { mockFeedbacks } from './data/mockFeedback'

type ThemeMode = 'system' | 'light' | 'dark'

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved === 'true'
  })
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode')
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved
    }
    return 'system'
  })

  useEffect(() => {
    localStorage.setItem('theme-mode', themeMode)
  }, [themeMode])

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed))
  }, [sidebarCollapsed])

  useEffect(() => {
    const root = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      if (themeMode === 'system') {
        root.removeAttribute('data-theme')
        root.style.colorScheme = mediaQuery.matches ? 'dark' : 'light'
        return
      }

      root.setAttribute('data-theme', themeMode)
      root.style.colorScheme = themeMode
    }

    applyTheme()

    if (themeMode === 'system') {
      mediaQuery.addEventListener('change', applyTheme)
      return () => mediaQuery.removeEventListener('change', applyTheme)
    }

    return undefined
  }, [themeMode])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  const toggleSidebarCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Header
        onMenuToggle={toggleSidebar}
        sidebarOpen={sidebarOpen}
        themeMode={themeMode}
        onThemeModeChange={setThemeMode}
      />
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar
          open={sidebarOpen}
          onClose={closeSidebar}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />
        <main
          className={`flex-1 min-h-0 w-full overflow-y-auto custom-scroll`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      {/* Auth pages — full-screen, no sidebar/header shell */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/verify-email" element={<VerifyEmailPage />} />

      {/* Main app shell */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<PublicFeedbackBoard feedbacks={mockFeedbacks} />} />
        <Route path="/company/:slug" element={<CompanyBoardPage />} />
        <Route path="/request/:id" element={<RequestDetailPage />} />
      </Route>
    </Routes>
  )
}

export default App
