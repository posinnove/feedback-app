import { Navigate } from 'react-router-dom'
import { useState } from 'react'
import { IconUserCircle } from '@tabler/icons-react'
import Avatar from '../components/ui/Avatar'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setCredentials } from '../store/slices/authSlice'
import type { AuthUser } from '../store/slices/authSlice'
import { useUpdateMeUserProfileMutation } from '../store/api/userAuthApi'
import { useUpdateMeCompanyProfileMutation } from '../store/api/companyAuthApi'
import { uploadFileToCloudinary } from '../utils/cloudinaryUpload'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Button } from '../components/ui/button'

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const { entity, type, accessToken, isAuthenticated } = useAppSelector((s) => s.auth)
  const [updateMeUserProfile, { isLoading: isSavingUser }] = useUpdateMeUserProfileMutation()
  const [updateMeCompanyProfile, { isLoading: isSavingCompany }] =
    useUpdateMeCompanyProfileMutation()
  const isReady = Boolean(isAuthenticated && entity && type && accessToken)

  const [form, setForm] = useState({
    firstName: entity?.firstName ?? '',
    lastName: entity?.lastName ?? '',
    phoneNumber: entity?.phoneNumber ?? '',
    name: entity?.name ?? '',
    location: entity?.location ?? '',
    website: entity?.website ?? '',
    description: entity?.description ?? '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    entity?.avatarUrl ?? entity?.logoUrl ?? null
  )
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isReady || !entity || !type || !accessToken) {
    return <Navigate to="/auth/login" replace />
  }

  const currentEntity = entity
  const currentType = type
  const currentAccessToken = accessToken

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      let imageUrl: string | undefined
      if (imageFile) {
        setIsUploadingImage(true)
        const uploadFolder = currentType === 'company' ? 'profiles/companies' : 'profiles/users'
        const uploaded = await uploadFileToCloudinary(imageFile, uploadFolder)
        setIsUploadingImage(false)
        if (!uploaded?.url) {
          setError('Failed to upload profile image. Please try again.')
          return
        }
        imageUrl = uploaded.url
      }

      const updatedEntity: AuthUser =
        currentType === 'company'
          ? await updateMeCompanyProfile({
              name: form.name,
              location: form.location,
              website: form.website,
              description: form.description,
              ...(imageUrl ? { logoUrl: imageUrl } : {}),
            }).unwrap()
          : await updateMeUserProfile({
              firstName: form.firstName,
              lastName: form.lastName,
              phoneNumber: form.phoneNumber,
              ...(imageUrl ? { avatarUrl: imageUrl } : {}),
            }).unwrap()

      dispatch(
        setCredentials({
          entity: updatedEntity,
          type: currentType,
          accessToken: currentAccessToken,
        })
      )
    } catch (err) {
      setIsUploadingImage(false)
      const message =
        typeof err === 'object' &&
        err !== null &&
        'data' in err &&
        typeof (err as { data?: { message?: unknown } }).data?.message === 'string'
          ? (err as { data: { message: string } }).data.message
          : 'Failed to save profile changes'
      setError(message)
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    if (!file) {
      setImageFile(null)
      setImagePreviewUrl(currentEntity.avatarUrl ?? currentEntity.logoUrl ?? null)
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Profile image must be an image file')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Profile image must be smaller than 5MB')
      event.target.value = ''
      return
    }

    setError(null)
    setImageFile(file)
    setImagePreviewUrl(URL.createObjectURL(file))
  }

  const isSaving = isSavingUser || isSavingCompany || isUploadingImage

  return (
    <div className="bg-background min-h-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-card-bg border border-border rounded-xl p-5 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
              <IconUserCircle size={22} stroke={1.6} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-base-200">Profile</h1>
              <p className="text-sm text-base-100 mt-1">Manage your public profile information.</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSave}
          className="bg-card-bg border border-border rounded-xl p-5 space-y-4"
        >
          <div>
            <label className="block text-xs text-base-100 mb-1.5">
              {currentType === 'company' ? 'Company Logo' : 'Profile Picture'}
            </label>
            <div className="flex items-center gap-3">
              <Avatar
                name={
                  currentType === 'company'
                    ? form.name || entity.email
                    : `${form.firstName} ${form.lastName}`.trim() || entity.email
                }
                avatar={imagePreviewUrl ?? undefined}
                size="lg"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="py-1.5 file:mr-3 file:rounded-md file:border-0 file:bg-primary-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-base-100 mb-1.5">Email</label>
            <Input value={entity.email} disabled className="opacity-70 cursor-not-allowed" />
          </div>

          {currentType === 'company' ? (
            <>
              <div>
                <label className="block text-xs text-base-100 mb-1.5">Company Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-base-100 mb-1.5">Location</label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-xs text-base-100 mb-1.5">Website</label>
                <Input
                  value={form.website}
                  onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                  placeholder="https://company.com"
                />
              </div>
              <div>
                <label className="block text-xs text-base-100 mb-1.5">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="min-h-24"
                  placeholder="Tell users about your company"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-base-100 mb-1.5">First Name</label>
                  <Input
                    value={form.firstName}
                    onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-base-100 mb-1.5">Last Name</label>
                  <Input
                    value={form.lastName}
                    onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-base-100 mb-1.5">Phone Number</label>
                <Input
                  value={form.phoneNumber}
                  onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                  placeholder="+1 555 000 0000"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button type="submit" disabled={isSaving} className="px-4">
              Save profile
            </Button>
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </form>
      </div>
    </div>
  )
}
