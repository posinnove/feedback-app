import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { IconMessageCirclePlus } from '@tabler/icons-react'
import {
  useGetCompaniesQuery,
  useGetFeedbackTypesQuery,
  useRequestCompanyFeedbackMutation,
} from '../store/api/companyApi'
import { useAppSelector } from '../store/hooks'

export default function RequestFeedbackPage() {
  const navigate = useNavigate()
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
  const [visibility, setVisibility] = useState<'public' | 'anonymous' | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const selectedCompanySlug = companySlug || initialCompanySlug
  const selectedFeedbackTypeId = feedbackTypeId ?? feedbackTypes[0]?.id ?? null
  const selectedCompanyName =
    companies.find((company) => company.slug === selectedCompanySlug)?.name ?? ''
  const companyInputValue = companyQuery || selectedCompanyName

  const filteredCompanies = useMemo(() => {
    const query = companyQuery.trim().toLowerCase()
    if (!query) return companies.slice(0, 8)
    return companies.filter((company) => company.name.toLowerCase().includes(query)).slice(0, 8)
  }, [companies, companyQuery])

  if (!isAuthenticated) {
    return <Navigate to="/auth/login?reason=request-feedback" replace />
  }

  if (type !== 'user') {
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

    if (!visibility) {
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
        visibility,
      }).unwrap()

      setSuccessMessage('Feedback request submitted successfully')
      setTitle('')
      setDescription('')
      navigate(`/company/${selectedCompanySlug}`)
    } catch (err) {
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
            <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
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
            <label className="block text-xs text-base-100 mb-1.5">Company</label>
            <div className="relative">
              <input
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
                className="input"
                placeholder={isLoadingCompanies ? 'Loading companies...' : 'Search company by name'}
                disabled={isLoadingCompanies || companies.length === 0}
              />

              {showCompanyOptions && !isLoadingCompanies && filteredCompanies.length > 0 ? (
                <div className="absolute z-20 mt-1 w-full bg-card-bg border border-border rounded-lg shadow-lg max-h-56 overflow-auto">
                  {filteredCompanies.map((company) => (
                    <button
                      key={company.slug}
                      type="button"
                      onClick={() => {
                        setCompanySlug(company.slug)
                        setCompanyQuery(company.name)
                        setShowCompanyOptions(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-base-200 hover:bg-border/50 transition-colors"
                    >
                      {company.name}
                    </button>
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
            <select
              value={selectedFeedbackTypeId ?? ''}
              onChange={(event) => setFeedbackTypeId(Number.parseInt(event.target.value, 10))}
              className="input"
              disabled={isLoadingFeedbackTypes || feedbackTypes.length === 0}
            >
              {!feedbackTypes.length ? <option value="">No feedback types available</option> : null}
              {feedbackTypes.map((feedbackType) => (
                <option key={feedbackType.id} value={feedbackType.id}>
                  {feedbackType.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-base-100 mb-1.5">Visibility</label>
            <p className="text-xs text-base-100 mb-2">Choose how your name appears on feedback.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setVisibility('anonymous')}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  visibility === 'anonymous'
                    ? 'border-primary-600 bg-primary-100 text-primary-700'
                    : 'border-border text-base-200 hover:bg-border/50'
                }`}
              >
                Anonymous
                <div className="text-xs text-base-100 mt-1">Your name will be hidden</div>
              </button>
              <button
                type="button"
                onClick={() => setVisibility('public')}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  visibility === 'public'
                    ? 'border-primary-600 bg-primary-100 text-primary-700'
                    : 'border-border text-base-200 hover:bg-border/50'
                }`}
              >
                Public
                <div className="text-xs text-base-100 mt-1">Your name will be visible</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-base-100 mb-1.5">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="input"
              placeholder="What should this company build or improve?"
              required
              minLength={5}
            />
          </div>

          <div>
            <label className="block text-xs text-base-100 mb-1.5">Description</label>
            <div className="rounded-lg border border-border overflow-hidden bg-background">
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                placeholder="Add details, context, examples, and expected outcome..."
                modules={{
                  toolbar: [
                    [{ header: [2, 3, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'blockquote', 'code-block'],
                    ['clean'],
                  ],
                }}
              />
            </div>
            <p className="text-xs text-base-100 mt-1">Max 1000 plain-text characters.</p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-base-100">
              Rich text formatting is supported for your request details.
            </span>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !selectedCompanySlug ||
                !selectedFeedbackTypeId ||
                !visibility ||
                title.trim().length < 5
              }
              className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit request'}
            </button>
          </div>

          {successMessage ? <p className="text-sm text-green-600">{successMessage}</p> : null}
          {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}
        </form>
      </div>
    </div>
  )
}
