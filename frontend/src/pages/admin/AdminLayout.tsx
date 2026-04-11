import { Outlet, NavLink, Navigate, useLocation } from 'react-router-dom'
import { IconChartPie, IconBuildingBank, IconMessageReport, IconPlus } from '@tabler/icons-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Checkbox } from '../../components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { useCreateAdminCompanyMutation } from '../../store/api/adminApi'
import { uploadFileToCloudinary } from '../../utils/cloudinaryUpload'
import { useState } from 'react'

export default function AdminLayout() {
  const location = useLocation()

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

  const [formOpen, setFormOpen] = useState(false)
  const [formState, setFormState] = useState(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [createCompany, { isLoading: isCreatingCompany }] = useCreateAdminCompanyMutation()

  // Optional: Redirect /admin to /admin/stats
  if (location.pathname === '/admin' || location.pathname === '/admin/') {
    return <Navigate to="/admin/stats" replace />
  }

  const tabs = [
    { name: 'Dashboard', to: '/admin/stats', icon: <IconChartPie size={18} /> },
    { name: 'Companies', to: '/admin/companies', icon: <IconBuildingBank size={18} /> },
    { name: 'Feedbacks', to: '/admin/feedbacks', icon: <IconMessageReport size={18} /> },
  ]

  function closeForm() {
    setFormOpen(false)
    setFormState(emptyForm)
    setFormError(null)
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

    const payload = {
      name: formState.name.trim(),
      email: formState.email.trim() || undefined,
      location: formState.location.trim() || undefined,
      website: formState.website.trim() || undefined,
      description: formState.description.trim() || undefined,
      logoUrl: formState.logoUrl.trim() || undefined,
      isEmailVerified: formState.isEmailVerified,
      isApproved: formState.isApproved,
    }

    try {
      await createCompany(payload).unwrap()
      closeForm()
    } catch (err: unknown) {
      const message =
        typeof err === 'object' &&
        err !== null &&
        'data' in err &&
        typeof (err as { data?: { message?: unknown } }).data?.message === 'string'
          ? (err as { data: { message: string } }).data.message
          : 'Failed to create company'
      setFormError(message)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background max-w-6xl mx-auto p-4 md:p-8 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
              <CardDescription>Manage system users, companies, and content.</CardDescription>
            </div>
            <Button size="sm" className="gap-1" onClick={() => setFormOpen(true)}>
              <IconPlus size={16} />
              Add Company
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <nav className="flex gap-2 flex-wrap border border-border rounded-lg p-1 bg-sidebar-bg/60">
            {tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-card-bg text-base-200 shadow-sm border border-border'
                      : 'text-base-100 hover:text-base-200 hover:bg-border/50'
                  }`
                }
              >
                {tab.icon}
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </CardContent>
      </Card>

      <div className="flex-1 bg-card-bg rounded-xl border border-border p-6 shadow-sm overflow-hidden flex flex-col">
        <Outlet />
      </div>

      <Dialog open={formOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto custom-scroll">
          <DialogHeader>
            <DialogTitle className="text-lg">Add Company</DialogTitle>
            <DialogDescription>Create a new company profile in the system.</DialogDescription>
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
                placeholder="Company email (optional)"
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

            {formError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {formError}
              </div>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingCompany || isUploadingLogo}>
                {isCreatingCompany ? 'Creating...' : 'Create Company'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
