import type { CompanyData } from '../types/company'
import { IconWorldWww } from '@tabler/icons-react'

interface CompanyInfoProps {
  company: CompanyData
}

function normalizeWebsiteUrl(website: string) {
  const trimmed = website.trim()
  if (!trimmed) return ''

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `https://${trimmed}`
}

export default function CompanyInfo({ company }: CompanyInfoProps) {
  const followerCount = company.followerCount ?? 0
  const website = company.website?.trim() ?? ''
  const websiteHref = website ? normalizeWebsiteUrl(website) : ''

  return (
    <div className="relative mb-6 rounded-xl border border-border bg-card-bg p-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-primary-100 flex items-center justify-center shrink-0">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={company.name}
              className="w-full h-full rounded-2xl object-cover"
            />
          ) : (
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-base-200">
              {company.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-base-200 wrap-break-word">
              {company.name}
            </h1>
            {/* Mobile share button — visible only when stats card is hidden */}
            <div className="lg:hidden shrink-0 flex items-center gap-1.5">
              {website ? (
                <a
                  href={websiteHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-border bg-card-bg p-1.5 text-primary-500 transition-colors hover:border-primary-600/50 hover:bg-border/40 hover:text-primary-400"
                  aria-label={`Open ${company.name} website`}
                  title="Visit website"
                >
                  <IconWorldWww size={15} stroke={1.9} />
                </a>
              ) : null}
              {/* <ShareButton size={16} label="" /> */}
            </div>
            {/* Desktop website icon */}
            {website ? (
              <a
                href={websiteHref}
                target="_blank"
                rel="noreferrer"
                className="hidden lg:inline-flex items-center justify-center rounded-md border border-border bg-card-bg p-1.5 text-primary-500 transition-colors hover:border-primary-600/50 hover:bg-border/40 hover:text-primary-400 shrink-0"
                aria-label={`Open ${company.name} website`}
                title="Visit website"
              >
                <IconWorldWww size={15} stroke={1.9} />
              </a>
            ) : null}
          </div>

          {company.description && (
            <p className="text-sm text-base-100 mt-1 line-clamp-2 sm:line-clamp-3">
              {company.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-base-200">
              {company.feedbacks.length} Posts
            </span>
            <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-base-200">
              {followerCount.toLocaleString()} Subscribers
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
