const RichTextEditor = () => {
  return (
    <div className="border rounded-md">
      {/* Toolbar */}
      <div className="flex gap-2 px-2 py-1 border-b text-xs text-gray-600">
        <button>B</button>
        <button>I</button>
        <button>U</button>
        <button>•</button>
        <button>≡</button>
      </div>

      {/* Text area */}
      <textarea
        placeholder="Write your feedback..."
        className="w-full min-h-[140px] px-3 py-2 text-sm outline-none"
      />
    </div>
  )
}

export default RichTextEditor
