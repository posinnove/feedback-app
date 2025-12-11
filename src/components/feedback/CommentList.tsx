interface Comment {
  id: string
  author: string
  message: string
  createdAt: string
}

const comments: Comment[] = [
  {
    id: '1',
    author: 'Mellow Junior',
    message: 'The product is good looking. I want to test it on my side as well.',
    createdAt: '2 days ago',
  },
  {
    id: '2',
    author: 'Iris Mwezi',
    message: 'It looks well structured, but I’d love to see a comparison with competitors.',
    createdAt: '1 day ago',
  },
]

const CommentList = () => {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-300" />

          <div className="bg-white border rounded-md p-3 text-xs flex-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{comment.author}</span>
              <span className="text-gray-400">{comment.createdAt}</span>
            </div>

            <p className="mt-1 text-gray-600">{comment.message}</p>

            <button className="text-blue-600 text-xs mt-2">Reply</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommentList
