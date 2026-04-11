import type { CompanyData } from '../types/company'
import type { ReactNode } from 'react'
import { IconWorldWww } from '@tabler/icons-react'

interface CompanyInfoProps {
  company: CompanyData
  action?: ReactNode
}

function normalizeWebsiteUrl(website: string) {
  const trimmed = website.trim()
  if (!trimmed) return ''

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `https://${trimmed}`
}

export default function CompanyInfo({ company, action }: CompanyInfoProps) {
  const followerCount = company.followerCount ?? 0
  const website = company.website?.trim() ?? ''
  const websiteHref = website ? normalizeWebsiteUrl(website) : ''

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-border bg-card-bg p-4 sm:p-5">
      <div className="relative flex items-start gap-3 sm:gap-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-primary-100/90 flex items-center justify-center shrink-0 shadow-sm overflow-hidden ring-1 ring-border logo-surface">
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-600">
              {company.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-base-200 wrap-break-word">
                {company.name}
              </h1>
            </div>
            <div className="shrink-0 flex items-center gap-2 rounded-xl border border-border/80 bg-background/70 p-1.5">
              {website ? (
                <a
                  href={websiteHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card-bg text-primary-500 transition-colors hover:border-primary-600/50 hover:bg-border/40 hover:text-primary-400"
                  aria-label={`Open ${company.name} website`}
                  title="Visit website"
                >
                  <IconWorldWww size={15} stroke={1.9} />
                </a>
              ) : null}
              {action ? <div className="inline-flex items-center">{action}</div> : null}
            </div>
          </div>

          {company.description && (
            <p className="mt-2 text-sm leading-relaxed text-base-100 line-clamp-3 sm:line-clamp-4">
              {company.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-border bg-background/80 px-2.5 py-1 text-xs font-medium text-base-200">
              {company.feedbacks.length} Posts
            </span>
            <span className="inline-flex items-center rounded-full border border-border bg-background/80 px-2.5 py-1 text-xs font-medium text-base-200">
              {followerCount.toLocaleString()} Subscribers
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
