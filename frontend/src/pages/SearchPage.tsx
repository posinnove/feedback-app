import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  IconBuilding,
  IconMessageCircle,
  IconMessageCircle2,
  IconSearch,
} from '@tabler/icons-react'
import { useAdvancedSearchQuery } from '../store/api/companyApi'

function stripHtml(input: string | null | undefined) {
  if (!input) return ''
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncate(text: string, length = 120) {
  if (text.length <= length) return text
  return `${text.slice(0, length).trim()}...`
}

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('q') ?? '').trim()

  const normalizedQuery = useMemo(() => query, [query])

  const { data, isLoading, isFetching, isError } = useAdvancedSearchQuery(normalizedQuery, {
    skip: normalizedQuery.length < 2,
  })

  const totalResults =
    (data?.companies.length ?? 0) + (data?.feedbacks.length ?? 0) + (data?.replies.length ?? 0)

  return (
    <div className="bg-background min-h-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-card-bg border border-border rounded-xl p-5 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
              <IconSearch size={20} stroke={1.7} className="icon-adaptive" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-base-200">Search results</h1>
              {normalizedQuery ? (
                <p className="text-sm text-base-100 mt-1">
                  Results for: <span className="font-semibold text-base-200">{normalizedQuery}</span>
                </p>
              ) : null}
              {!isLoading && !isFetching && !isError && normalizedQuery ? (
                <p className="text-xs text-base-100 mt-1">{totalResults} results found</p>
              ) : null}
            </div>
          </div>
        </div>

        {normalizedQuery.length < 2 ? (
          <div className="bg-card-bg border border-border rounded-xl p-5">
            <p className="text-sm text-base-100">Type at least 2 characters to search.</p>
          </div>
        ) : null}

        {isLoading || isFetching ? (
          <div className="bg-card-bg border border-border rounded-xl p-5">
            <p className="text-sm text-base-100">Searching...</p>
          </div>
        ) : null}

        {isError ? (
          <div className="bg-card-bg border border-border rounded-xl p-5">
            <p className="text-sm text-red-500">Failed to search. Please try again.</p>
          </div>
        ) : null}

        {!isLoading && !isFetching && !isError && normalizedQuery.length >= 2 ? (
          <div className="space-y-5">
            <section className="bg-card-bg border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <IconBuilding size={18} className="icon-adaptive" />
                <h2 className="text-base font-semibold text-base-200">Companies</h2>
                <span className="text-xs text-base-100">({data?.companies.length ?? 0})</span>
              </div>
              {data?.companies.length ? (
                <div className="space-y-2">
                  {data.companies.map((company) => (
                    <Link
                      key={company.slug}
                      to={`/${company.slug}`}
                      className="block border border-border rounded-lg p-3 hover:border-primary-600/40 transition-colors"
                    >
                      <p className="text-sm font-semibold text-base-200">{company.name}</p>
                      <p className="text-xs text-base-100 mt-1">
                        {truncate(stripHtml(company.description) || 'No description')}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-base-100">No companies matched.</p>
              )}
            </section>

            <section className="bg-card-bg border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <IconMessageCircle size={18} className="icon-adaptive" />
                <h2 className="text-base font-semibold text-base-200">Feedback requests</h2>
                <span className="text-xs text-base-100">({data?.feedbacks.length ?? 0})</span>
              </div>
              {data?.feedbacks.length ? (
                <div className="space-y-2">
                  {data.feedbacks.map((feedback) => (
                    <Link
                      key={feedback.id}
                      to={`/request/${feedback.id}`}
                      className="block border border-border rounded-lg p-3 hover:border-primary-600/40 transition-colors"
                    >
                      <p className="text-sm font-semibold text-base-200">{feedback.title}</p>
                      <p className="text-xs text-base-100 mt-1">
                        Company: {feedback.company.name} • Status: {feedback.status}
                      </p>
                      <p className="text-xs text-base-100 mt-1">
                        {truncate(stripHtml(feedback.description) || 'No description')}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-base-100">No feedback requests matched.</p>
              )}
            </section>

            <section className="bg-card-bg border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <IconMessageCircle2 size={18} className="icon-adaptive" />
                <h2 className="text-base font-semibold text-base-200">Replies</h2>
                <span className="text-xs text-base-100">({data?.replies.length ?? 0})</span>
              </div>
              {data?.replies.length ? (
                <div className="space-y-2">
                  {data.replies.map((reply) => (
                    <Link
                      key={reply.id}
                      to={`/request/${reply.feedbackId}`}
                      className="block border border-border rounded-lg p-3 hover:border-primary-600/40 transition-colors"
                    >
                      <p className="text-sm font-semibold text-base-200">{reply.feedbackTitle}</p>
                      <p className="text-xs text-base-100 mt-1">Company: {reply.company.name}</p>
                      <p className="text-xs text-base-100 mt-1">
                        {truncate(stripHtml(reply.content), 160)}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-base-100">No replies matched.</p>
              )}
            </section>
          </div>
        ) : null}
      </div>
    </div>
  )
}
