import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import CompanySidebar from '../components/CompanySidebar';
import Header from '../components/Header'; // Assuming we re-use the generic header or build another one, optionally omitting Header if we don't need it.

export default function CompanyDashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <Header onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />
            <div className="flex flex-1 relative overflow-hidden">
                <CompanySidebar open={sidebarOpen} onClose={closeSidebar} />
                <main className="flex-1 overflow-y-auto w-full p-4 lg:p-8 bg-white md:m-4 md:rounded-xl shadow-sm border border-gray-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
