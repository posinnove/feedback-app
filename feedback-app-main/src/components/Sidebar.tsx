import { Link, useLocation } from 'react-router-dom'
import CompanyListItem from './ui/CompanyListItem'

// Placeholder companies — replace with API data when available
const MOCK_COMPANIES = [
    { name: 'Irembo', slug: 'irembo' },
    { name: 'Posinnove', slug: 'posinnove' },
    { name: 'Umurava', slug: 'umurava' },
    { name: 'Solvit Africa', slug: 'solvit-africa' },
    { name: 'Imena', slug: 'imena' },
    { name: 'Google', slug: 'google' },
    { name: 'Awesomity', slug: 'awesomity' },
    { name: 'Lerony', slug: 'lerony' },
    { name: 'Mellow', slug: 'mellow' },
    { name: 'Umuseke', slug: 'umuseke' },
    { name: 'IGIHE', slug: 'igihe' },
]

const NAV_ITEMS = [
    {
        label: 'Home',
        path: '/',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M3 10L5 8M5 8L10 3L15 8M5 8V16C5 16.5523 5.44772 17 6 17H8M15 8L17 10M15 8V16C15 16.5523 14.5523 17 14 17H12M8 17C8.55228 17 9 16.5523 9 16V12C9 11.4477 9.44772 11 10 11C10.5523 11 11 11.4477 11 12V16C11 16.5523 11.4477 17 12 17M8 17H12"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        label: 'Popular',
        path: '/popular',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M10 2L12.09 6.26L16.82 6.96L13.41 10.27L14.18 14.97L10 12.77L5.82 14.97L6.59 10.27L3.18 6.96L7.91 6.26L10 2Z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        label: 'Explore',
        path: '/explore',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                />
                <path
                    d="M13.5 6.5L11.5 11.5L6.5 13.5L8.5 8.5L13.5 6.5Z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        label: 'All',
        path: '/all',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M3 5H17M3 10H17M3 15H17"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                />
            </svg>
        ),
    },
]

export default function Sidebar() {
    const location = useLocation()

    return (
        <aside className="w-56 bg-sidebar-bg min-h-screen border-r border-border flex flex-col">
            {/* Navigation */}
            <nav className="flex-1 px-2 pt-4">
                <div className="space-y-0.5">
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                                        ? 'bg-primary-100 text-primary-600 font-medium'
                                        : 'text-base-200 hover:bg-gray-100'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        )
                    })}
                </div>

                {/* Business Account */}
                <Link
                    to="/business"
                    className="flex items-center gap-3 px-3 py-2 mt-2 rounded-lg text-sm text-base-200 hover:bg-gray-100 transition-colors"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Business Account
                </Link>

                {/* Companies Section */}
                <div className="mt-6">
                    <div className="flex items-center justify-between px-3 mb-2">
                        <h3 className="text-xs font-semibold text-base-100 uppercase tracking-wider">
                            Companies
                        </h3>
                        <button className="text-base-100 hover:text-base-200 transition-colors" aria-label="Toggle companies">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 10L8 6L12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <Link
                        to="/manage-businesses"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-base-200 hover:bg-gray-100 transition-colors mb-1"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            />
                            <path
                                d="M16.5 10C16.5 10 13.59 15 10 15C6.41 15 3.5 10 3.5 10C3.5 10 6.41 5 10 5C13.59 5 16.5 10 16.5 10Z"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            />
                        </svg>
                        Manage Businesses
                    </Link>

                    <div className="space-y-0.5 overflow-y-auto max-h-[calc(100vh-380px)]">
                        {MOCK_COMPANIES.map((company) => (
                            <CompanyListItem
                                key={company.slug}
                                name={company.name}
                                slug={company.slug}
                            />
                        ))}
                    </div>
                </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
                <p className="text-xs text-base-100">
                    Voxella, Inc. © 2026. All rights reserved.
                </p>
            </div>
        </aside>
    )
}
