import { useRef, useState } from 'react'
import TagSelector from './TagSelector'
import FeedbackActions from './FeedbackActions'

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/jpg',
  'video/mkv',
  'video/mp4',
]

const ImageVideoForm = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log('Selected file:', file)
  }

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only PNG, JPG, and MP4 files are allowed.'
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB.'
    }

    return null
  }

  const uploadToCloudinary = async (file: File) => {
    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const data = await res.json()
    setUploadedUrl(data.secure_url)
    setUploading(false)
  }

  const handleFile = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    await uploadToCloudinary(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="p-4 space-y-4">
      {/* Title */}
      <input
        type="text"
        placeholder="Feedback Title"
        className="w-full border rounded-md px-3 py-2 text-sm outline-none"
      />

      {/* Media upload */}
      <>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,video/mp4"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Clickable upload box */}
        <div
          onClick={handleClick}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-dashed border rounded-md p-6 text-center text-xs cursor-pointer transition ${
            isDragging
              ? 'border-blue-500 bg-blue-50 text-blue-600'
              : 'border-gray-300 text-gray-500'
          }`}
        >
          {uploading ? (
            <p className="text-blue-600">Uploading...</p>
          ) : uploadedUrl ? (
            <p className="text-green-600">File uploaded successfully</p>
          ) : (
            <>
              Click to upload or drag & drop
              <br />
              PNG, JPG, MP4 (MAX 10MB)
            </>
          )}
        </div>

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        {uploadedUrl && (
          <p className="text-xs mt-2 break-all text-gray-600">Uploaded URL: {uploadedUrl}</p>
        )}
      </>

      {/* Caption */}
      <textarea
        placeholder="Add a caption or explanation..."
        className="w-full min-h-[100px] border rounded-md text-xs text-gray-600 px-3 py-2 outline-none"
      />

      {/* Tags */}
      <TagSelector />

      {/* Actions */}
      <FeedbackActions />
    </div>
  )
}

export default ImageVideoForm
