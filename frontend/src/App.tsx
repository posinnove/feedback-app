import { lazy, Suspense, useState, useCallback, useEffect, useRef } from 'react'
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import LoadingSpinner from './components/LoadingSpinner'
import { useAppSelector, useAppDispatch } from './store/hooks'
import { clearCredentials, setAuthError } from './store/slices/authSlice'
import { useLogoutMutation } from './store/api/authApi'

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000

const AuthModal = lazy(() => import('./components/auth/AuthModal'))
const CompanyBoardPage = lazy(() => import('./pages/CompanyBoardPage'))
const RequestDetailPage = lazy(() => import('./pages/RequestDetailPage'))
const PopularPage = lazy(() => import('./pages/PopularPage'))
const ExplorePage = lazy(() => import('./pages/ExplorePage'))
const AllPage = lazy(() => import('./pages/AllPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const RequestFeedbackPage = lazy(() => import('./pages/RequestFeedbackPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const PublicFeedPage = lazy(() => import('./pages/PublicFeedPage'))
const CompanyPortalPage = lazy(() => import('./pages/CompanyPortalPage'))
const LandingPage = lazy(() => import('./pages/LandingPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'))
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage'))

type ThemeMode = 'system' | 'light' | 'dark'

function FeedEntryPage() {
  const authType = useAppSelector((state) => state.auth.type)

  if (authType === 'company') {
    return <CompanyPortalPage />
  }

  return <PublicFeedPage sort="trending" />
}

function AppLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const authThemeMode = useAppSelector((state) => state.auth.entity?.themeMode)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved === 'true'
  })
  const [logout] = useLogoutMutation()
  const inactivityTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed))
  }, [sidebarCollapsed])

  useEffect(() => {
    const root = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const themeMode: ThemeMode = authThemeMode ?? 'system'

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
  }, [authThemeMode])

  useEffect(() => {
    if (!isAuthenticated) {
      if (inactivityTimeoutRef.current !== null) {
        window.clearTimeout(inactivityTimeoutRef.current)
      }
      return
    }

    const resetInactivityTimer = () => {
      if (inactivityTimeoutRef.current !== null) {
        window.clearTimeout(inactivityTimeoutRef.current)
      }

      inactivityTimeoutRef.current = window.setTimeout(() => {
        void logout()
        dispatch(clearCredentials())
        navigate('/auth/login?reason=session-timeout', { replace: true })
      }, INACTIVITY_TIMEOUT_MS)
    }

    const events: Array<keyof WindowEventMap> = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
    ]

    events.forEach((eventName) => {
      window.addEventListener(eventName, resetInactivityTimer)
    })

    resetInactivityTimer()

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, resetInactivityTimer)
      })

      if (inactivityTimeoutRef.current !== null) {
        window.clearTimeout(inactivityTimeoutRef.current)
      }
    }
  }, [dispatch, isAuthenticated, logout, navigate])

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
      <Header onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar
          open={sidebarOpen}
          onClose={closeSidebar}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />
        <main className={`flex-1 min-h-0 w-full overflow-y-auto custom-scroll`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function App() {
  const dispatch = useAppDispatch()
  const hasAuthError = useAppSelector((state) => state.auth.hasAuthError)

  function handleCloseAuthModal() {
    dispatch(setAuthError(false))
  }

  return (
    <>
      {hasAuthError && (
        <Suspense fallback={null}>
          <AuthModal open={hasAuthError} mode="login" onClose={handleCloseAuthModal} />
        </Suspense>
      )}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Auth modal routes on top of landing */}
          <Route path="/auth/login" element={<LandingPage />} />
          <Route path="/auth/register" element={<LandingPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/verify-email" element={<VerifyEmailPage />} />

          {/* Main app shell */}
          <Route element={<AppLayout />}>
            <Route path="/feed" element={<FeedEntryPage />} />
            <Route path="/popular" element={<PopularPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/all" element={<AllPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/request-feedback" element={<RequestFeedbackPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/portal-kanban" element={<CompanyPortalPage />} />
            <Route path="/company/:slug" element={<CompanyBoardPage />} />
            <Route path="/request/:id" element={<RequestDetailPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
