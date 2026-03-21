import { Link, useLocation } from 'react-router-dom'

interface CompanyListItemProps {
  name: string
  slug: string
  logo?: string
}

export default function CompanyListItem({ name, slug, logo }: CompanyListItemProps) {
  const initial = name.charAt(0).toUpperCase()
  const location = useLocation()
  const isActive = location.pathname === `/company/${slug}`

  return (
    <div
      className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors ${
        isActive ? 'bg-active' : 'hover:bg-border/50'
      }`}
    >
      <Link to={`/company/${slug}`} className="flex items-center gap-3 flex-1 min-w-0">
        {logo ? (
          <img src={logo} alt={name} className="w-6 h-6 rounded-full object-cover" />
        ) : (
          <div className="w-6 h-6 rounded-full avatar-bg text-xs flex items-center justify-center font-semibold">
            {initial}
          </div>
        )}
        <span className={`text-sm truncate ${isActive ? 'font-medium' : 'text-base-200'}`}>
          {name}
        </span>
      </Link>
    </div>
  )
}
