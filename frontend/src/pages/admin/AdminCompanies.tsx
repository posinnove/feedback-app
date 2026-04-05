import {
  useGetAdminCompaniesQuery,
  useVerifyAdminCompanyMutation,
  useDeleteAdminCompanyMutation,
  useCreateAdminCompanyMutation,
  useUpdateAdminCompanyMutation,
  type AdminCompany,
} from '../../store/api/adminApi'
import { Button } from '../../components/ui/button'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useState, useEffect } from 'react'
import { IconSearch } from '@tabler/icons-react'
import { uploadFileToCloudinary } from '../../utils/cloudinaryUpload'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Badge } from '../../components/ui/badge'
import { Checkbox } from '../../components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'

export default function AdminCompanies() {
  const emptyForm = {
    name: '',
    email: '',
    location: '',
    website: '',
    description: '',
    logoUrl: '',
    isEmailVerified: true,
    isApproved: true,
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null)
  const [formState, setFormState] = useState(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const {
    data: companies,
    isLoading,
    isFetching,
  } = useGetAdminCompaniesQuery(debouncedSearch || undefined)
  const [verifyCompany] = useVerifyAdminCompanyMutation()
  const [deleteCompany] = useDeleteAdminCompanyMutation()
  const [createCompany, { isLoading: isCreatingCompany }] = useCreateAdminCompanyMutation()
  const [updateCompany, { isLoading: isUpdatingCompany }] = useUpdateAdminCompanyMutation()
  const [loadingId, setLoadingId] = useState<number | null>(null)

  if (isLoading && !isFetching) return <LoadingSpinner />

  const handleToggleVerification = async (id: number, currentStatus: boolean) => {
    setLoadingId(id)
    try {
      await verifyCompany({ id, status: !currentStatus }).unwrap()
    } finally {
      setLoadingId(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return

    setLoadingId(id)
    try {
      await deleteCompany(id).unwrap()
    } finally {
      setLoadingId(null)
    }
  }

  function closeForm() {
    setFormOpen(false)
    setEditingCompanyId(null)
    setFormState(emptyForm)
    setFormError(null)
  }

  function openEditForm(company: AdminCompany) {
    setEditingCompanyId(company.id)
    setFormState({
      name: company.name,
      email: company.email,
      location: company.location ?? '',
      website: company.website ?? '',
      description: company.description ?? '',
      logoUrl: company.logoUrl ?? '',
      isEmailVerified: company.isEmailVerified,
      isApproved: company.isApproved,
    })
    setFormError(null)
    setFormOpen(true)
  }

  async function handleLogoUpload(file: File) {
    if (!file.type.startsWith('image/')) {
      setFormError('Please choose an image file for logo.')
      return
    }

    setIsUploadingLogo(true)
    setFormError(null)
    try {
      const uploaded = await uploadFileToCloudinary(file, 'company-logos')
      if (!uploaded?.url) {
        setFormError('Logo upload failed. Please try again.')
        return
      }
      setFormState((prev) => ({ ...prev, logoUrl: uploaded.url }))
    } finally {
      setIsUploadingLogo(false)
    }
  }

  async function handleSubmitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    if (!formState.name.trim()) {
      setFormError('Company name is required.')
      return
    }

    if (!formState.email.trim()) {
      setFormError('Company email is required.')
      return
    }

    const payload = {
      name: formState.name.trim(),
      email: formState.email.trim(),
      location: formState.location.trim() || undefined,
      website: formState.website.trim() || undefined,
      description: formState.description.trim() || undefined,
      logoUrl: formState.logoUrl.trim() || undefined,
      isEmailVerified: formState.isEmailVerified,
      isApproved: formState.isApproved,
    }

    try {
      if (editingCompanyId) {
        await updateCompany({ id: editingCompanyId, body: payload }).unwrap()
      } else {
        await createCompany(payload).unwrap()
      }

      closeForm()
    } catch (err: unknown) {
      const message =
        typeof err === 'object' &&
        err !== null &&
        'data' in err &&
        typeof (err as { data?: { message?: unknown } }).data?.message === 'string'
          ? (err as { data: { message: string } }).data.message
          : 'Failed to save company details'
      setFormError(message)
    }
  }

  const isSubmittingForm = isCreatingCompany || isUpdatingCompany

  return (
    <div className="flex flex-col h-full space-y-4 max-h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <h2 className="text-lg font-semibold text-base-200">Manage Companies</h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch size={16} className="text-base-100" />
          </div>
          <Input
            type="text"
            placeholder="Search companies..."
            className="w-full sm:w-64 pl-9 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeForm()
          } else {
            setFormOpen(true)
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto custom-scroll">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {editingCompanyId ? 'Edit Company' : 'Add Company'}
            </DialogTitle>
            <DialogDescription>
              Manage company profile details, verification status, and logo.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="Company name"
                className="bg-card-bg"
                value={formState.name}
                onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
              />
              <Input
                type="email"
                placeholder="Company email"
                className="bg-card-bg"
                value={formState.email}
                onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
              />
              <Input
                type="text"
                placeholder="Location"
                className="bg-card-bg"
                value={formState.location}
                onChange={(e) => setFormState((prev) => ({ ...prev, location: e.target.value }))}
              />
              <Input
                type="text"
                placeholder="Website"
                className="bg-card-bg"
                value={formState.website}
                onChange={(e) => setFormState((prev) => ({ ...prev, website: e.target.value }))}
              />
            </div>

            <Textarea
              placeholder="Description"
              className="w-full min-h-20 bg-card-bg"
              value={formState.description}
              onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
            />

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-start">
              <Input
                type="text"
                placeholder="Logo URL"
                className="bg-card-bg"
                value={formState.logoUrl}
                onChange={(e) => setFormState((prev) => ({ ...prev, logoUrl: e.target.value }))}
              />
              <label className="inline-flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) void handleLogoUpload(file)
                  }}
                />
                <span className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card-bg px-3 text-sm font-medium hover:bg-border/40 cursor-pointer">
                  {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
                </span>
              </label>
            </div>

            <div className="flex items-center gap-5 text-sm">
              <label className="inline-flex items-center gap-2 text-base-200">
                <Checkbox
                  checked={formState.isApproved}
                  onCheckedChange={(checked) =>
                    setFormState((prev) => ({ ...prev, isApproved: checked === true }))
                  }
                />
                Approved
              </label>
              <label className="inline-flex items-center gap-2 text-base-200">
                <Checkbox
                  checked={formState.isEmailVerified}
                  onCheckedChange={(checked) =>
                    setFormState((prev) => ({ ...prev, isEmailVerified: checked === true }))
                  }
                />
                Email Verified
              </label>
            </div>

            {formError ? <p className="text-sm text-red-500">{formError}</p> : null}

            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={isSubmittingForm || isUploadingLogo}>
                {isSubmittingForm
                  ? 'Saving...'
                  : editingCompanyId
                    ? 'Save Changes'
                    : 'Create Company'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto overflow-y-auto w-full custom-scroll pr-2 h-full rounded-lg border border-border bg-background/60">
        <table className="w-full text-sm text-left align-middle border-collapse rounded-lg">
          <thead className="bg-sidebar-bg/80 text-base-200 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium text-center">Subscribers</th>
              <th className="px-4 py-3 font-medium text-center">Email Verified</th>
              <th className="px-4 py-3 font-medium text-center">Approved</th>
              <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!companies?.length ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-base-100 bg-background/50 rounded-b-lg"
                >
                  No companies found.
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr key={company.id} className="hover:bg-border/20">
                  <td className="px-4 py-3 font-medium">{company.name}</td>
                  <td className="px-4 py-3 text-base-100">{company.email}</td>
                  <td className="px-4 py-3 text-center text-base-100 font-semibold">
                    {company.subscriberCount || 0}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      className={
                        company.isEmailVerified
                          ? 'bg-emerald-500/10 text-emerald-600 border-transparent normal-case tracking-normal'
                          : 'bg-yellow-500/10 text-yellow-700 border-transparent normal-case tracking-normal'
                      }
                    >
                      {company.isEmailVerified ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      className={
                        company.isApproved
                          ? 'bg-emerald-500/10 text-emerald-600 border-transparent normal-case tracking-normal'
                          : 'bg-red-500/10 text-red-600 border-transparent normal-case tracking-normal'
                      }
                    >
                      {company.isApproved ? 'Approved' : 'Pending'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 flex items-center justify-end gap-2 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-xs"
                      onClick={() => openEditForm(company)}
                      disabled={loadingId === company.id}
                    >
                      Edit
                    </Button>
                    <Button
                      variant={company.isApproved ? 'secondary' : 'default'}
                      size="sm"
                      className={
                        company.isApproved
                          ? 'text-xs'
                          : 'text-xs bg-primary-600 hover:bg-primary-700'
                      }
                      onClick={() => handleToggleVerification(company.id, company.isApproved)}
                      disabled={loadingId === company.id}
                    >
                      {company.isApproved ? 'Revoke' : 'Approve'}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
                      onClick={() => handleDelete(company.id)}
                      disabled={loadingId === company.id}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
