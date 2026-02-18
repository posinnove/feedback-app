import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    IconHome,
    IconStar,
    IconCompass,
    IconList,
    IconPlus,
    IconChevronUp,
    IconEye,
} from '@tabler/icons-react'
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
    { label: 'Home', path: '/', icon: <IconHome size={20} stroke={1.5} /> },
    { label: 'Popular', path: '/popular', icon: <IconStar size={20} stroke={1.5} /> },
    { label: 'Explore', path: '/explore', icon: <IconCompass size={20} stroke={1.5} /> },
    { label: 'All', path: '/all', icon: <IconList size={20} stroke={1.5} /> },
]

interface SidebarProps {
    open: boolean
    onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
    const location = useLocation()

    // Auto-close sidebar on navigation (mobile)
    const prevPathname = useRef(location.pathname)
    useEffect(() => {
        if (prevPathname.current !== location.pathname) {
            prevPathname.current = location.pathname
            onClose()
        }
    }, [location.pathname, onClose])

    return (
        <>
            {/* Backdrop — mobile only */}
            {open && (
                <div
                    className="fixed inset-0 top-[57px] z-40 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar panel */}
            <aside
                className={`
                    fixed top-[57px] bottom-0 left-0 z-50 w-64 bg-sidebar-bg border-r border-border flex flex-col
                    transform transition-transform duration-200 ease-in-out shadow-xl
                    lg:static lg:z-auto lg:w-56 lg:translate-x-0 lg:transition-none lg:shadow-none
                    ${open ? 'translate-x-0' : '-translate-x-full'}
                `}
            >

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
                        <IconPlus size={20} stroke={1.5} />
                        Business Account
                    </Link>

                    {/* Companies Section */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between px-3 mb-2">
                            <h3 className="text-xs font-semibold text-base-100 uppercase tracking-wider">
                                Companies
                            </h3>
                            <button className="text-base-100 hover:text-base-200 transition-colors" aria-label="Toggle companies">
                                <IconChevronUp size={14} stroke={1.5} />
                            </button>
                        </div>

                        <Link
                            to="/manage-businesses"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-base-200 hover:bg-gray-100 transition-colors mb-1"
                        >
                            <IconEye size={20} stroke={1.5} />
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
        </>
    )
}
