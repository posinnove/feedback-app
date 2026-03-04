import { Link } from 'react-router-dom'
import { IconStar, IconStarFilled } from '@tabler/icons-react'

interface CompanyListItemProps {
  name: string
  slug: string
  logo?: string
  isFavorite?: boolean
  onToggleFavorite?: () => void
}

export default function CompanyListItem({
  name,
  slug,
  logo,
  isFavorite = false,
  onToggleFavorite,
}: CompanyListItemProps) {
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors group">
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
      <button
        onClick={onToggleFavorite}
        className={`transition-colors opacity-0 group-hover:opacity-100 ${isFavorite ? 'text-amber-400 opacity-100' : 'text-base-100 hover:text-amber-400'}`}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? <IconStarFilled size={16} /> : <IconStar size={16} stroke={1} />}
      </button>
    </div>
  )
}
