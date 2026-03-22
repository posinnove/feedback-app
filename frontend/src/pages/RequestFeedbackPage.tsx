import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { IconMessageCirclePlus } from '@tabler/icons-react'
import {
  useGetCompaniesQuery,
  useGetFeedbackTypesQuery,
  useRequestCompanyFeedbackMutation,
} from '../store/api/companyApi'
import { useAppSelector } from '../store/hooks'
import { uploadFileToCloudinary } from '../utils/cloudinaryUpload'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'

export default function RequestFeedbackPage() {
  const navigate = useNavigate()
  const quillRef = useRef<ReactQuill | null>(null)
  const [searchParams] = useSearchParams()
  const requestedCompany = searchParams.get('company') ?? ''

  const { isAuthenticated, type } = useAppSelector((state) => state.auth)
  const { data: companies = [], isLoading: isLoadingCompanies } = useGetCompaniesQuery()
  const { data: feedbackTypesData, isLoading: isLoadingFeedbackTypes } = useGetFeedbackTypesQuery()
  const [requestCompanyFeedback, { isLoading: isSubmitting }] = useRequestCompanyFeedbackMutation()
  const feedbackTypes = feedbackTypesData?.feedbackTypes ?? []

  const initialCompanySlug = useMemo(() => {
    if (requestedCompany && companies.some((company) => company.slug === requestedCompany)) {
      return requestedCompany
    }
    return ''
  }, [companies, requestedCompany])

  const [companySlug, setCompanySlug] = useState('')
  const [companyQuery, setCompanyQuery] = useState('')
  const [showCompanyOptions, setShowCompanyOptions] = useState(false)
  const [feedbackTypeId, setFeedbackTypeId] = useState<number | null>(null)
  const [visibility, setVisibility] = useState<'public' | 'anonymous' | null>(
    isAuthenticated ? null : 'anonymous'
  )
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const selectedCompanySlug = companySlug || initialCompanySlug
  const selectedFeedbackTypeId = feedbackTypeId ?? feedbackTypes[0]?.id ?? null
  const selectedFeedbackTypeValue = selectedFeedbackTypeId ? String(selectedFeedbackTypeId) : ''
  const selectedCompanyName =
    companies.find((company) => company.slug === selectedCompanySlug)?.name ?? ''
  const companyInputValue = companyQuery || selectedCompanyName
  const finalVisibility = isAuthenticated ? visibility : 'anonymous'

  const selectCompany = useCallback((slug: string, name: string) => {
    setCompanySlug(slug)
    setCompanyQuery(name)
    setShowCompanyOptions(false)
  }, [])

  const uploadAndInsertImage = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Only image files are supported.')
      return
    }

    setIsUploadingImage(true)
    setErrorMessage(null)

    try {
      const uploaded = await uploadFileToCloudinary(file, 'feedback-description-images')
      if (!uploaded) {
        setErrorMessage('Failed to upload image. Please try again.')
        return
      }

      const editor = quillRef.current?.getEditor()
      if (!editor) return

      const range = editor.getSelection(true)
      const index = range?.index ?? editor.getLength()
      editor.insertEmbed(index, 'image', uploaded.url, 'user')
      editor.setSelection(index + 1)
    } finally {
      setIsUploadingImage(false)
    }
  }, [])

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      await uploadAndInsertImage(file)
    }

    input.click()
  }, [uploadAndInsertImage])

  useEffect(() => {
    const editor = quillRef.current?.getEditor()
    const root = editor?.root
    if (!root) return

    const handleDrop = (event: DragEvent) => {
      const files = Array.from(event.dataTransfer?.files ?? [])
      const imageFile = files.find((file) => file.type.startsWith('image/'))
      if (!imageFile) return

      event.preventDefault()
      void uploadAndInsertImage(imageFile)
    }

    const handlePaste = (event: ClipboardEvent) => {
      const files = Array.from(event.clipboardData?.files ?? [])
      const imageFile = files.find((file) => file.type.startsWith('image/'))
      if (!imageFile) return

      event.preventDefault()
      void uploadAndInsertImage(imageFile)
    }

    root.addEventListener('drop', handleDrop)
    root.addEventListener('paste', handlePaste)

    return () => {
      root.removeEventListener('drop', handleDrop)
      root.removeEventListener('paste', handlePaste)
    }
  }, [uploadAndInsertImage])

  const quillModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image', 'blockquote', 'code-block'],
          ['clean'],
        ],
        handlers: {
          image: handleImageUpload,
        },
      },
    }),
    [handleImageUpload]
  )

  const filteredCompanies = useMemo(() => {
    const query = companyQuery.trim().toLowerCase()
    if (!query) return companies.slice(0, 8)
    return companies.filter((company) => company.name.toLowerCase().includes(query)).slice(0, 8)
  }, [companies, companyQuery])

  if (isAuthenticated && type !== 'user') {
    return (
      <div className="bg-background min-h-full">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="bg-card-bg border border-border rounded-xl p-5">
            <h1 className="text-xl font-bold text-base-200">Provide Feedback</h1>
            <p className="text-sm text-base-100 mt-2">
              Only user accounts can provide feedback to companies.
            </p>
          </div>
        </div>
      </div>
    )
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSuccessMessage(null)
    setErrorMessage(null)

    if (!selectedCompanySlug) {
      setErrorMessage('Please choose a company')
      return
    }

    if (!selectedFeedbackTypeId) {
      setErrorMessage('Please choose a feedback type')
      return
    }

    if (!finalVisibility) {
      setErrorMessage('Please choose visibility: anonymous or public')
      return
    }

    if (title.trim().length < 5) {
      setErrorMessage('Title must be at least 5 characters long')
      return
    }

    const plainTextDescription = description.replace(/<[^>]*>/g, '').trim()
    if (plainTextDescription.length > 1000) {
      setErrorMessage('Description must be at most 1000 characters')
      return
    }

    try {
      await requestCompanyFeedback({
        slug: selectedCompanySlug,
        feedbackTypeId: selectedFeedbackTypeId,
        title,
        description,
        visibility: finalVisibility,
      }).unwrap()

      setSuccessMessage('Feedback request submitted successfully')
      setTitle('')
      setDescription('')
      navigate(`/company/${selectedCompanySlug}`)
    } catch (err: unknown) {
      const message =
        typeof err === 'object' &&
        err !== null &&
        'data' in err &&
        typeof (err as { data?: { message?: unknown } }).data?.message === 'string'
          ? (err as { data: { message: string } }).data.message
          : 'Failed to submit feedback request'
      setErrorMessage(message)
    }
  }

  return (
    <div className="bg-background min-h-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-card-bg border border-border rounded-xl p-5 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
              <IconMessageCirclePlus size={20} stroke={1.8} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-base-200">Provide Feedback</h1>
              <p className="text-sm text-base-100 mt-1">
                Submit feedback about a specific company.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card-bg border border-border rounded-xl p-5 space-y-4"
        >
          <div>
            <label className="block text-xs text-base-100 mb-1.5">Title</label>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What should this company build or improve?"
              required
              minLength={5}
            />
          </div>

          <div>
            <label className="block text-xs text-base-100 mb-1.5">Description</label>
            <div className="request-feedback-editor rounded-lg border border-border overflow-hidden bg-background">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={description}
                onChange={setDescription}
                placeholder="Add details, context, examples, and expected outcome..."
                modules={quillModules}
              />
            </div>
            <p className="text-xs text-base-100 mt-1">Max 1000 plain-text characters.</p>
            {/* <p className="text-xs text-base-100 mt-1">
              You can paste, drag-and-drop, or use the toolbar image button.
            </p> */}
            {isUploadingImage ? (
              <p className="text-xs text-base-100 mt-1">Uploading image...</p>
            ) : null}
          </div>

          <div>
            <label className="block text-xs text-base-100 mb-1.5">Company</label>
            <div className="relative">
              <Input
                value={companyInputValue}
                onChange={(event) => {
                  setCompanyQuery(event.target.value)
                  setCompanySlug('')
                  setShowCompanyOptions(true)
                }}
                onFocus={() => setShowCompanyOptions(true)}
                onBlur={() => {
                  setTimeout(() => setShowCompanyOptions(false), 120)
                }}
                placeholder={isLoadingCompanies ? 'Loading companies...' : 'Search company by name'}
                disabled={isLoadingCompanies || companies.length === 0}
              />

              {showCompanyOptions && !isLoadingCompanies && filteredCompanies.length > 0 ? (
                <div className="absolute z-20 mt-1 w-full bg-card-bg border border-border rounded-lg shadow-lg max-h-56 overflow-auto">
                  {filteredCompanies.map((company) => (
                    <Button
                      key={company.slug}
                      type="button"
                      variant="ghost"
                      size="sm"
                      onMouseDown={(event) => {
                        event.preventDefault()
                        selectCompany(company.slug, company.name)
                      }}
                      onClick={() => selectCompany(company.slug, company.name)}
                      className="h-auto w-full justify-start px-3 py-2 text-left text-sm font-normal text-base-200 transition-colors hover:bg-border/50"
                    >
                      {company.name}
                    </Button>
                  ))}
                </div>
              ) : null}
            </div>
            {!isLoadingCompanies && companies.length === 0 ? (
              <p className="text-xs text-base-100 mt-1">No companies available.</p>
            ) : null}
            {companyQuery && !filteredCompanies.length ? (
              <p className="text-xs text-base-100 mt-1">No companies found.</p>
            ) : null}
          </div>

          <div>
            <label className="block text-xs text-base-100 mb-1.5">Feedback Type</label>
            <Select
              value={selectedFeedbackTypeValue}
              onValueChange={(value) => setFeedbackTypeId(Number.parseInt(value, 10))}
              disabled={isLoadingFeedbackTypes || feedbackTypes.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingFeedbackTypes ? 'Loading feedback types...' : 'Select a feedback type'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {feedbackTypes.map((feedbackType) => (
                  <SelectItem key={feedbackType.id} value={String(feedbackType.id)}>
                    {feedbackType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isLoadingFeedbackTypes && feedbackTypes.length === 0 ? (
              <p className="text-xs text-base-100 mt-1">No feedback types available.</p>
            ) : null}
          </div>

          <div>
            <label className="block text-xs text-base-100 mb-1.5">Visibility</label>
            {/* <p className="text-xs text-base-100 mb-2">Choose how your name appears on feedback.</p> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setVisibility('anonymous')}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  visibility === 'anonymous'
                    ? 'border-primary-600 bg-primary-100 text-primary-700'
                    : 'border-border text-base-200 hover:bg-border/50'
                }`}
              >
                Anonymous
                <div className="text-xs text-base-100 mt-1">Your name will be hidden</div>
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setVisibility('public')}
                disabled={!isAuthenticated}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  visibility === 'public'
                    ? 'border-primary-600 bg-primary-100 text-primary-700'
                    : 'border-border text-base-200 hover:bg-border/50 disabled:cursor-not-allowed disabled:opacity-60'
                }`}
              >
                Public
                <div className="text-xs text-base-100 mt-1">Your name may be visible</div>
              </Button>
            </div>
            {!isAuthenticated ? (
              <p className="text-xs text-base-100 mt-2">
                You are submitting as a guest. Only anonymous feedback is available.
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between pt-1">
            {/* <span className="text-xs text-base-100">
              Rich text formatting is supported for your request details.
            </span> */}
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !selectedCompanySlug ||
                !selectedFeedbackTypeId ||
                !finalVisibility ||
                title.trim().length < 5
              }
              className="px-4"
            >
              {isSubmitting ? 'Submitting...' : 'Submit request'}
            </Button>
          </div>

          {successMessage ? <p className="text-sm text-green-600">{successMessage}</p> : null}
          {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}
        </form>
      </div>
    </div>
  )
}
