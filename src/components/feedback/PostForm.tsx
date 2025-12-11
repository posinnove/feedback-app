import TagSelector from './TagSelector'
import FeedbackActions from './FeedbackActions'

const PostForm = () => {
  return (
    <div className="p-4 space-y-4">
      {/* Title */}
      <input
        type="text"
        placeholder="Feedback Title"
        className="w-full border rounded-md px-3 py-2 text-sm outline-none"
      />

      {/* Editor */}
      <textarea
        placeholder="Write your feedback..."
        className="w-full min-h-[140px] border rounded-md text-xs text-gray-600 px-3 py-2 outline-none"
      />

      {/* Tags */}
      <TagSelector />

      {/* Actions */}
      <FeedbackActions />
    </div>
  )
}

export default PostForm
