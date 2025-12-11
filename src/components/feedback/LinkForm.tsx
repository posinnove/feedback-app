import TagSelector from './TagSelector'
import FeedbackActions from './FeedbackActions'

const LinkForm = () => {
  return (
    <div className="p-4 space-y-4">
      {/* Title */}
      <input
        type="text"
        placeholder="Feedback Title"
        className="w-full border rounded-md px-3 py-2 text-sm outline-none"
      />

      {/* Link */}
      <input
        type="url"
        placeholder="Paste a link (https://...)"
        className="w-full border rounded-md px-3 py-2 text-sm outline-none"
      />

      {/* Description */}
      <textarea
        placeholder="Why are you sharing this link?"
        className="w-full min-h-[100px] border rounded-md text-xs text-gray-600 px-3 py-2 outline-none"
      />

      {/* Tags */}
      <TagSelector />

      {/* Actions */}
      <FeedbackActions />
    </div>
  )
}

export default LinkForm
