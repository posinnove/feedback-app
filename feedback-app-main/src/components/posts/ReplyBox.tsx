import { useState } from 'react'

interface Props {
  onSubmit: (message: string) => void
}

export default function ReplyBox({ onSubmit }: Props) {
  const [message, setMessage] = useState('')

  return (
    <div className="space-y-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a reply..."
        className="w-full border rounded-lg p-2 text-sm"
      />
      <button
        onClick={() => {
          if (!message.trim()) return
          onSubmit(message)
          setMessage('')
        }}
        className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm"
      >
        Reply
      </button>
    </div>
  )
}
