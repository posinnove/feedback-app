const CommentInput = () => {
  return (
    <div className="flex gap-3 items-center">
      <div className="w-8 h-8 rounded-full bg-gray-300" />

      <input
        type="text"
        placeholder="Add a comment..."
        className="flex-1 border rounded-full px-4 py-2 text-xs outline-none"
      />

      <button className="bg-blue-600 text-white text-xs px-4 py-2 rounded-full hover:bg-blue-500">
        Post
      </button>
    </div>
  )
}

export default CommentInput
