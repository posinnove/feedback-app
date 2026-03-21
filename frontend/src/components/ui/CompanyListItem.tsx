import { Link } from 'react-router-dom'

interface CompanyListItemProps {
  name: string
  slug: string
  logo?: string
}

export default function CompanyListItem({ name, slug, logo }: CompanyListItemProps) {
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-border/50 transition-colors">
      <Link to={`/company/${slug}`} className="flex items-center gap-3 flex-1 min-w-0">
        {logo ? (
          <img src={logo} alt={name} className="w-6 h-6 rounded-full object-cover" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center font-semibold">
            {initial}
          </div>
        )}
        <span className="text-sm text-base-200 truncate">{name}</span>
      </Link>
    </div>
  )
}
