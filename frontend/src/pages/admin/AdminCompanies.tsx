import { useGetAdminCompaniesQuery, useVerifyAdminCompanyMutation, useDeleteAdminCompanyMutation } from '../../store/api/adminApi'
import { Button } from '../../components/ui/button'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useState, useEffect } from 'react'
import { IconSearch } from '@tabler/icons-react'

export default function AdminCompanies() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data: companies, isLoading, isFetching } = useGetAdminCompaniesQuery(debouncedSearch || undefined)
  const [verifyCompany] = useVerifyAdminCompanyMutation()
  const [deleteCompany] = useDeleteAdminCompanyMutation()
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

  return (
    <div className="flex flex-col h-full space-y-4 max-h-[100%]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <h2 className="text-lg font-semibold text-base-200">Manage Companies</h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch size={16} className="text-base-100" />
          </div>
          <input
            type="text"
            placeholder="Search companies..."
            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto overflow-y-auto w-full custom-scroll pr-2 h-full">
        <table className="w-full text-sm text-left align-middle border-collapse rounded-lg">
          <thead className="bg-border/30 text-base-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium text-center">Email Verified</th>
              <th className="px-4 py-3 font-medium text-center">Approved</th>
              <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!companies?.length ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-base-100 bg-background/50 rounded-b-lg">No companies found.</td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr key={company.id} className="hover:bg-border/10">
                  <td className="px-4 py-3 font-medium">{company.name}</td>
                  <td className="px-4 py-3 text-base-100">{company.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        company.isEmailVerified ? 'bg-emerald-500/10 text-emerald-600' : 'bg-yellow-500/10 text-yellow-600'
                      }`}
                    >
                      {company.isEmailVerified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        company.isApproved ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                      }`}
                    >
                      {company.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center justify-end gap-2 text-right">
                    <Button
                      variant={company.isApproved ? 'secondary' : 'default'}
                      size="sm"
                      className={company.isApproved ? 'text-xs' : 'text-xs bg-primary-600 hover:bg-primary-700'}
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
