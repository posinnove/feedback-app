const FeedbackActions = () => {
  return (
    <div>
      <div className="flex justify-end items-center pt-2">
        <div className="flex gap-2">
          <button className="border border-blue-600 text-blue-600 px-2 py-1 md:px-4 md:py-2 rounded-full text-sm hover:bg-blue-600 hover:text-white whitespace-nowrap cursor-pointer duration-300">
            Save Draft
          </button>
          <button className="border border-blue-600 bg-blue-600 hover:bg-transparent hover:text-blue-600 text-white px-4 py-2 rounded-full text-sm cursor-pointer duration-300">
            Post
          </button>
        </div>
      </div>

      <div className="mt-2">
        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
          <input type="checkbox" />
          Send me post reply notifications
        </label>
      </div>
    </div>
  )
}

export default FeedbackActions
