import { Link } from 'react-router-dom'

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
                className="text-base-100 hover:text-amber-400 transition-colors opacity-0 group-hover:opacity-100"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill={isFavorite ? 'currentColor' : 'none'}
                    xmlns="http://www.w3.org/2000/svg"
                    className={isFavorite ? 'text-amber-400 opacity-100' : ''}
                >
                    <path
                        d="M8 1.5L9.79 5.14L13.76 5.72L10.88 8.52L11.58 12.47L8 10.56L4.42 12.47L5.12 8.52L2.24 5.72L6.21 5.14L8 1.5Z"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    )
}
