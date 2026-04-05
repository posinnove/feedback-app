import { lazy, Suspense, useState, useCallback, useEffect, useRef } from 'react'
import {
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import LoadingSpinner from './components/LoadingSpinner'
import { useAppSelector, useAppDispatch } from './store/hooks'
import { clearCredentials, setAuthError, setAccessToken } from './store/slices/authSlice'
import { useLogoutMutation, useRefreshTokenMutation } from './store/api/authApi'
import { useGsapReveal } from './utils/gsapMotion'
import { motionProfile } from './utils/motionProfile'
import { useGoogleSilentLogin } from './hooks/useGoogleSilentLogin'

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
const HelpPage = lazy(() => import('./pages/HelpPage'))
const PublicFeedPage = lazy(() => import('./pages/PublicFeedPage'))
const CompanyPortalPage = lazy(() => import('./pages/CompanyPortalPage'))
const LandingPage = lazy(() => import('./pages/LandingPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'))
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage'))

// Admin Pages
const AdminRoute = lazy(() => import('./components/auth/AdminRoute'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminCompanies = lazy(() => import('./pages/admin/AdminCompanies'))
const AdminFeedbacks = lazy(() => import('./pages/admin/AdminFeedbacks'))

type ThemeMode = 'system' | 'light' | 'dark'

function FeedEntryPage() {
  return <PublicFeedPage sort="trending" />
}

function LegacyCompanyRedirect() {
  const { slug } = useParams<{ slug: string }>()

  if (!slug) {
    return <Navigate to="/feed" replace />
  }

  return <Navigate to={`/${slug}`} replace />
}

function AppLayout() {
  const dispatch = useAppDispatch()
  const location = useLocation()
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
  const mainRef = useRef<HTMLElement | null>(null)

  useGsapReveal(mainRef, [location.pathname], {
    y: motionProfile.route.y,
    duration: motionProfile.route.duration,
  })

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
        <main ref={mainRef} className={`flex-1 min-h-0 w-full overflow-y-auto custom-scroll px-2 lg:px-0`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function App() {
  const dispatch = useAppDispatch()
  const hasAuthError = useAppSelector((state) => state.auth.hasAuthError)
  const { entity, accessToken } = useAppSelector((state) => state.auth)
  const [refreshToken] = useRefreshTokenMutation()
  const [isRestoring, setIsRestoring] = useState(!!entity && !accessToken)

  useEffect(() => {
    if (entity && !accessToken) {
      refreshToken()
        .unwrap()
        .then((res) => {
          dispatch(setAccessToken(res.accessToken))
        })
        .catch(() => {
          dispatch(clearCredentials())
        })
        .finally(() => {
          setIsRestoring(false)
        })
    } else {
      setIsRestoring(false)
    }
  }, [entity, accessToken, refreshToken, dispatch])

  // Initialize silent Google login at app level
  useGoogleSilentLogin()

  function handleCloseAuthModal() {
    dispatch(setAuthError(false))
  }

  if (isRestoring) {
    return <LoadingSpinner />
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
            <Route path="/help" element={<HelpPage />} />
            <Route path="/portal-kanban" element={<CompanyPortalPage />} />
            <Route path="/company/:slug" element={<LegacyCompanyRedirect />} />
            <Route path="/request/:id" element={<RequestDetailPage />} />
            <Route path="/:slug" element={<CompanyBoardPage />} />

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="stats" element={<AdminDashboard />} />
                <Route path="companies" element={<AdminCompanies />} />
                <Route path="feedbacks" element={<AdminFeedbacks />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
