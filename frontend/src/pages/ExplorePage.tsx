import { IconCompass, IconUsers, IconArrowRight } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router-dom'
import {
  useFollowCompanyMutation,
  useGetCompaniesQuery,
  useGetFollowedCompaniesQuery,
  useUnfollowCompanyMutation,
} from '../store/api/companyApi'
import { useAppSelector } from '../store/hooks'

export default function ExplorePage() {
  const { data: companies, isLoading } = useGetCompaniesQuery()
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const { data: followedCompanies } = useGetFollowedCompaniesQuery(undefined, {
    skip: !isAuthenticated,
  })
  const [followCompany, { isLoading: followLoading }] = useFollowCompanyMutation()
  const [unfollowCompany, { isLoading: unfollowLoading }] = useUnfollowCompanyMutation()
  const navigate = useNavigate()

  const followedSlugs = new Set((followedCompanies ?? []).map((company) => company.slug))

  async function handleFollowToggle(slug: string, followed: boolean) {
    if (!isAuthenticated) {
      navigate('/auth/login?reason=follow')
      return
    }

    if (followed) {
      await unfollowCompany(slug)
      return
    }

    await followCompany(slug)
  }

  function handleOpenRequestForm(slug: string) {
    if (!isAuthenticated) {
      navigate('/auth/login?reason=request-feedback')
      return
    }
    navigate(`/request-feedback?company=${slug}`)
  }

  return (
    <div className="bg-background min-h-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-card-bg border border-border rounded-xl p-5 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
              <IconCompass size={20} stroke={1.6} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-base-200">Explore Companies</h1>
              <p className="text-sm text-base-100 mt-1">
                Follow companies to pin them in your sidebar for quick access.
              </p>
              <p className="text-xs text-base-100 mt-2">
                Following {(followedCompanies ?? []).length} companies
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card-bg border border-border rounded-xl p-3 sm:p-4">
          {isLoading ? (
            <p className="px-3 py-2 text-sm text-base-100">Loading companies...</p>
          ) : companies && companies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {companies.map((company) => {
                const followed = followedSlugs.has(company.slug)
                return (
                  <div
                    key={company.slug}
                    className="border border-border rounded-xl p-4 bg-background hover:border-primary-600/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="text-base font-semibold text-base-200 truncate">
                          {company.name}
                        </h2>
                        <p className="text-sm text-base-100 mt-1 line-clamp-2">
                          {company.description ?? 'No description yet.'}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={followLoading || unfollowLoading}
                        onClick={() => void handleFollowToggle(company.slug, followed)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                          followed
                            ? 'bg-primary-100 text-primary-600 hover:bg-primary-100/70 border border-primary-600/30'
                            : 'bg-primary-600 text-white hover:bg-primary-800'
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {followed ? 'Unfollow' : 'Follow'}
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 text-xs text-base-100">
                        <IconUsers size={14} stroke={1.7} />
                        <span className="font-semibold text-base-200">
                          {(company.followerCount ?? 0).toLocaleString()}
                        </span>
                        <span>members</span>
                      </div>
                      <Link
                        to={`/company/${company.slug}`}
                        className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline"
                      >
                        View company
                        <IconArrowRight size={12} stroke={1.8} />
                      </Link>
                    </div>

                    <div className="mt-3 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleOpenRequestForm(company.slug)}
                        className="px-3 py-1.5 hover:cursor-pointer rounded-lg text-xs font-semibold bg-primary-600 text-white hover:bg-primary-800 transition-colors"
                      >
                        Provide feedback
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="px-3 py-2 text-sm text-base-100">No companies available yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
