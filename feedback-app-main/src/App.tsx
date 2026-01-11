import FeedbackBoard from './components/FeedbackBoard'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import { mockFeedbacks } from './data/mockFeedback'

function App() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <FeedbackBoard feedbacks={mockFeedbacks} />
      </div>
    </div>
  )
}

export default App
