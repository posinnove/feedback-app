const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  throw new Error('Cloudinary environment variables are not defined')
}

export type CloudinaryUploadResult = {
  url: string
  public_id: string
}

export const uploadFileToCloudinary = async (
  file: File
): Promise<CloudinaryUploadResult | null> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'feedback-uploads')

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      throw new Error(`Cloudinary upload failed with status ${res.status}`)
    }

    const data = await res.json()

    return {
      url: data.secure_url,
      public_id: data.public_id,
    }
  } catch (err) {
    console.error('Cloudinary upload failed:', err)
    return null
  }
}

// How a Component Will Use It
// import { uploadFileToCloudinary } from "@/utils/cloudinary.uploads"

// const results = await Promise.all(
//   files.map(file => uploadFileToCloudinary(file))
// )
