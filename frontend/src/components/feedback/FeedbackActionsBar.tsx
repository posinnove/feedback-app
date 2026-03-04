import { IoIosShareAlt } from 'react-icons/io'

const FeedbackActionsBar = () => {
  return (
    <div className="flex items-center gap-4">
      <button className="text-xs px-3 py-1 rounded-full border bg-white hover:bg-gray-100">
        <IoIosShareAlt className="inline mr-1" />
        Share
      </button>

      <input
        type="text"
        placeholder="Respond as Admin"
        className="flex-1 border rounded-full px-4 py-2 text-xs outline-none"
      />
    </div>
  )
}

export default FeedbackActionsBar
