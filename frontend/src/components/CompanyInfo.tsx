import type { CompanyData } from '../types/company'
import ShareButton from './ui/ShareButton'

interface CompanyInfoProps {
  company: CompanyData
}

export default function CompanyInfo({ company }: CompanyInfoProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-primary-100 flex items-center justify-center border border-border shrink-0">
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt={company.name}
            className="w-full h-full rounded-2xl object-cover"
          />
        ) : (
          <span className="text-xl lg:text-2xl font-bold text-primary-600">
            {company.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="text-xl lg:text-2xl font-bold text-base-200 truncate">{company.name}</h1>
        {company.description && (
          <p className="text-sm text-base-100 mt-0.5 line-clamp-1">
            {company.description.split('.')[0]}.
          </p>
        )}
      </div>
      {/* Mobile share button — visible only when stats card is hidden */}
      <div className="lg:hidden shrink-0">
        <ShareButton size={16} label="" />
      </div>
    </div>
  )
}
