import { useState, useCallback } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import PublicFeedbackBoard from './components/PublicFeedbackBoard'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import CompanyBoardPage from './pages/CompanyBoardPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import VerifyEmailPage from './pages/auth/VerifyEmailPage'
import { mockFeedbacks } from './data/mockFeedback'

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="flex flex-1 relative">
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
      <Route path="/auth/verify-email" element={<VerifyEmailPage />} />

      {/* Main app shell */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<PublicFeedbackBoard feedbacks={mockFeedbacks} />} />
        <Route path="/company/:slug" element={<CompanyBoardPage />} />
      </Route>
    </Routes>
  )
}

export default App