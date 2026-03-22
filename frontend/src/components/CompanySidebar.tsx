import { Link, useLocation } from 'react-router-dom';
import {
    IconChartPie,
    IconClipboardList,
    IconUser,
    IconSettings,
    IconChevronDown
} from '@tabler/icons-react';

interface CompanySidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function CompanySidebar({ open, onClose }: CompanySidebarProps) {
    const location = useLocation();

    // Helper to determine if a route is active
    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className={`w-64 bg-gray-50 border-r border-border flex flex-col h-full shrink-0 transition-transform duration-200 ease-in-out shadow-xl lg:shadow-none
            ${open ? 'fixed inset-y-0 left-0 z-50 transform translate-x-0' : 'hidden md:flex transform translate-x-0'} `}>
            <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-hidden hover:overflow-y-auto">
                <div>
                    <h2 className="text-[11px] font-semibold text-base-100 uppercase tracking-widest mb-4 px-2">Pages</h2>
                    <ul className="space-y-1">
                        <li>
                            <Link 
                                to="/company/dashboard" 
                                onClick={onClose}
                                className={`company-sidebar-link ${isActive('/company/dashboard') ? 'company-sidebar-link-active' : 'company-sidebar-link-inactive'}`}
                            >
                                <IconChartPie size={20} stroke={2} />
                                <span className="text-sm">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/company/dashboard/feedbacks" 
                                onClick={onClose}
                                className={`company-sidebar-link justify-between ${isActive('/company/dashboard/feedbacks') ? 'company-sidebar-link-active' : 'company-sidebar-link-inactive'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <IconClipboardList size={20} stroke={2} />
                                    <span className="text-sm">Feedback Posts</span>
                                </div>
                                <IconChevronDown size={14} stroke={2} className="opacity-70" />
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/company/dashboard/customers" 
                                onClick={onClose}
                                className={`company-sidebar-link ${isActive('/company/dashboard/customers') ? 'company-sidebar-link-active' : 'company-sidebar-link-inactive'}`}
                            >
                                <IconUser size={20} stroke={2} />
                                <span className="text-sm">Customers</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-[11px] font-semibold text-base-100 uppercase tracking-widest mb-4 px-2">Settings</h2>
                    <ul className="space-y-1">
                        <li>
                            <Link 
                                to="/company/dashboard/profile" 
                                onClick={onClose}
                                className={`company-sidebar-link ${isActive('/company/dashboard/profile') ? 'company-sidebar-link-active' : 'company-sidebar-link-inactive'}`}
                            >
                                <IconSettings size={20} stroke={1.5} />
                                <span className="text-sm">Business Profile</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </aside>
    );
}
