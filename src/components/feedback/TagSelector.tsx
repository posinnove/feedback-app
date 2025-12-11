import { useState } from 'react'

const tags = ['OC', 'Spoiler', 'Gaming', 'Bug', 'Feature']

const TagSelector = () => {
  const [feedbackTags, setFeedbackTags] = useState([])

  const myTags = feedbackTags

  const handleTagToggle = (tag) => {
    console.log(tag)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <button
            key={tag}
            className="text-xs border rounded-full px-3 py-1 text-gray-600 hover:bg-gray-100"
            onClick={(tag) => handleTagToggle(e.current.value)}
          >
            + {tag}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {myTags.map((tag) => (
          <button
            key={tag}
            className="text-xs border rounded-full px-3 py-1 text-gray-600 hover:bg-gray-100"
          >
            + {tag}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TagSelector
