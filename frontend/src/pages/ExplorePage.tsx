import { IconCompass, IconUsers, IconArrowRight } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router-dom'
import {
  useFollowCompanyMutation,
  useGetCompaniesQuery,
  useGetFollowedCompaniesQuery,
  useUnfollowCompanyMutation,
} from '../store/api/companyApi'
import { useAppSelector } from '../store/hooks'
import { useGoogleSilentLogin } from '../hooks/useGoogleSilentLogin'
import { Button } from '../components/ui/button'

export default function ExplorePage() {
  const { data: companies, isLoading } = useGetCompaniesQuery()
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const triggerSilentLogin = useGoogleSilentLogin()
  const { data: followedCompanies } = useGetFollowedCompaniesQuery(undefined, {
    skip: !isAuthenticated,
  })
  const [followCompany, { isLoading: followLoading }] = useFollowCompanyMutation()
  const [unfollowCompany, { isLoading: unfollowLoading }] = useUnfollowCompanyMutation()
  const navigate = useNavigate()

  const followedSlugs = new Set((followedCompanies ?? []).map((company) => company.slug))

  async function handleFollowToggle(slug: string, followed: boolean) {
    if (!isAuthenticated) {
      triggerSilentLogin()
      return
    }

    if (followed) {
      await unfollowCompany(slug)
      return
    }

    await followCompany(slug)
  }

  function handleOpenRequestForm(slug: string) {
    navigate(`/request-feedback?company=${slug}`)
  }

  function handleOpenCompany(slug: string) {
    navigate(`/${slug}`)
  }

  return (
    <div className="bg-background min-h-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-card-bg border border-border rounded-xl p-5 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
              <IconCompass size={20} stroke={1.6} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-base-200">Explore Companies</h1>
              <p className="text-sm text-base-100 mt-1">
                Subscribe to companies to pin them in your sidebar for quick access.
              </p>
              <p className="text-xs text-base-100 mt-2">
                Subscribed to {(followedCompanies ?? []).length} companies
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
                    role="link"
                    tabIndex={0}
                    onClick={() => handleOpenCompany(company.slug)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        handleOpenCompany(company.slug)
                      }
                    }}
                    className="border border-border rounded-xl p-4 bg-background hover:border-primary-600/30 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 border border-border/70 shrink-0 overflow-hidden flex items-center justify-center">
                          {company.logoUrl ? (
                            <img
                              src={company.logoUrl}
                              alt={company.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-sm font-bold text-base-200">
                              {company.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h2 className="text-base font-semibold text-base-200 truncate">
                            {company.name}
                          </h2>
                          <p className="text-sm text-base-100 mt-1 line-clamp-2">
                            {company.description ?? 'No description yet.'}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={followed ? 'secondary' : 'default'}
                        size="sm"
                        disabled={followLoading || unfollowLoading}
                        onClick={(event) => {
                          event.stopPropagation()
                          void handleFollowToggle(company.slug, followed)
                        }}
                        className={`h-auto shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                          followed
                            ? 'bg-primary-100 text-base-200 hover:bg-primary-100/70 border border-border'
                            : ' text-white hover:bg-primary-800'
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {followed ? 'Unsubscribe' : 'Subscribe'}
                      </Button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 text-xs text-base-100">
                        <IconUsers size={14} stroke={1.7} />
                        <span className="font-semibold text-base-200">
                          {(company.followerCount ?? 0).toLocaleString()}
                        </span>
                        <span>Subscribers</span>
                      </div>
                      <Link
                        to={`/${company.slug}`}
                        className="inline-flex items-center gap-1 text-xs hover:underline"
                        onClick={(event) => event.stopPropagation()}
                      >
                        View company
                        <IconArrowRight size={12} stroke={1.8} />
                      </Link>
                    </div>

                    <div className="mt-3 flex items-center justify-end">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation()
                          handleOpenRequestForm(company.slug)
                        }}
                        className="h-auto rounded-lg px-3 py-1.5 text-xs font-semibold border border-border text-base-200 hover:bg-border/70"
                      >
                        Provide feedback
                      </Button>
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
