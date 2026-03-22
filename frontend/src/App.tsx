import { useState, useCallback, useEffect } from 'react'
import { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAppSelector } from './store/hooks'
import PublicFeedbackBoard from './components/PublicFeedbackBoard'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import CompanyBoardPage from './pages/CompanyBoardPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import VerifyEmailPage from './pages/auth/VerifyEmailPage'
import CompanyDashboardLayout from './layouts/CompanyDashboardLayout'
import CompanyDashboardPage from './pages/CompanyDashboardPage'
import BusinessProfilePage from './pages/BusinessProfilePage'
import { mockFeedbacks } from './data/mockFeedback'

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, type } = useAppSelector((s) => s.auth)

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  useEffect(() => {
    if (isAuthenticated && type === 'company' && location.pathname === '/') {
      navigate('/company/dashboard', { replace: true })
    }
  }, [isAuthenticated, type, location.pathname, navigate])

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Header onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 overflow-y-auto">
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
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/verify-email" element={<VerifyEmailPage />} />

      {/* Main app shell */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<PublicFeedbackBoard feedbacks={mockFeedbacks} />} />
        <Route path="/company/:slug" element={<CompanyBoardPage />} />
      </Route>

      {/* Company Dashboard Shell */}
      <Route path="/company/dashboard" element={<CompanyDashboardLayout />}>
        <Route index element={<CompanyDashboardPage />} />
        <Route path="profile" element={<BusinessProfilePage />} />
      </Route>
    </Routes>
  )
}

export default App
