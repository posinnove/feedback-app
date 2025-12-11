import FeedbackMedia from '../components/feedback/FeedbackMedia'
import FeedbackActionsBar from '../components/feedback/FeedbackActionsBar'
import CommentList from '../components/feedback/CommentList'
import CommentInput from '../components/feedback/CommentInput'
import { RiArrowDropRightLine } from 'react-icons/ri'

const FeedbackDetailPage = () => {
  return (
    <section className="bg-gray-50 max-w-6xl mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      {/* <div className="text-xs font-semibold text-gray-500">
        <span>Home</span> | <span>Feedback Posts</span> | <span>#ab0de10</span>
      </div> */}
      <div className="flex items-center text-xs font-semibold text-gray-500">
        <a href="#" onClick={(e) => e.preventDefault()}>
          Home
        </a>
        <RiArrowDropRightLine className="text-2xl mt-0.5" />
        <a href="#" onClick={(e) => e.preventDefault()}>
          Feedback Posts
        </a>
        <RiArrowDropRightLine className="text-2xl mt-0.5" />
        <a href="#" onClick={(e) => e.preventDefault()}>
          #ab0de10
        </a>
      </div>

      {/* Title + Edit */}
      <div className="flex justify-between items-start gap-4">
        <h1 className="text-xl md:text-2xl font-semibold max-w-3xl">
          Deploying cloud solutions for scalability and continuous integrity boosting revenue and
          good quality
        </h1>

        <button className="text-sm px-4 py-2 rounded-md border bg-white hover:bg-gray-100">
          Edit Post
        </button>
      </div>

      {/* Media */}
      <FeedbackMedia />

      {/* Actions */}
      <FeedbackActionsBar />

      {/* Comments */}
      <div className="space-y-4">
        <CommentList />
        <CommentInput />
      </div>
    </section>
  )
}

export default FeedbackDetailPage
