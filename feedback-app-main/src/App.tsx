import { Routes, Route } from 'react-router-dom'
import PublicFeedbackBoard from './components/PublicFeedbackBoard'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import CompanyBoardPage from './pages/CompanyBoardPage'
import { mockFeedbacks } from './data/mockFeedback'

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <PublicFeedbackBoard feedbacks={mockFeedbacks} />
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />} />
      <Route path="/company/:slug" element={<CompanyBoardPage />} />
    </Routes>
  )
}

export default App

