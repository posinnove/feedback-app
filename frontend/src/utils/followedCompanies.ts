const FOLLOWED_COMPANIES_KEY = 'followed-company-slugs'
export const FOLLOWED_COMPANIES_EVENT = 'followed-companies-changed'

export function getFollowedCompanySlugs(): string[] {
  try {
    const raw = localStorage.getItem(FOLLOWED_COMPANIES_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter((slug): slug is string => typeof slug === 'string')
  } catch {
    return []
  }
}

function setFollowedCompanySlugs(slugs: string[]) {
  localStorage.setItem(FOLLOWED_COMPANIES_KEY, JSON.stringify(slugs))
  window.dispatchEvent(new Event(FOLLOWED_COMPANIES_EVENT))
}

export function isCompanyFollowed(slug: string): boolean {
  return getFollowedCompanySlugs().includes(slug)
}

export function toggleFollowedCompany(slug: string): boolean {
  const current = getFollowedCompanySlugs()
  const exists = current.includes(slug)
  const next = exists ? current.filter((item) => item !== slug) : [...current, slug]
  setFollowedCompanySlugs(next)
  return !exists
}
