import React from 'react';
import { Zap, ChevronRight } from 'lucide-react';
import { useLayout } from '../../contexts/LayoutContext';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const { navSections, isSidebarOpen, setIsSidebarOpen } = useLayout();
    const navigate = useNavigate();

    const pageRouteMap = {
        'Dashboard': '/dashboard',
        'Employee Management': '/employees',
        'Run Payroll': '/run-payroll',
        'Compliance & Tax Engine': '/compliance',
        'Predictive Analytics': '/analytics',
        'Blockchain Audit Trail': '/audit-trail',
    };

    const SidebarNavLink = ({ item }) => {
        const IconComponent = item.icon;
        const route = pageRouteMap[item.name] || '/dashboard';
        const endMatch = item.name === 'Dashboard';
        return (
            <li key={item.name}>
                <NavLink
                    to={route}
                    className={({ isActive }) =>
                        `flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
                            isActive 
                                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md' 
                                : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                        }`
                    }
                    onClick={() => {
                        setIsSidebarOpen(false);
                        navigate(route, { replace: false });
                    }}
                    end={endMatch}
                >
                    <div className="flex items-center gap-3">
                        <IconComponent size={20} />
                        <span className="font-medium text-sm">{item.name}</span>
                    </div>
                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
            </li>
        );
    };

    return (
        <>
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                />
            )}

            <aside className={`fixed lg:relative inset-y-0 left-0 bg-white dark:bg-secondary-900 w-64 border-r border-secondary-200 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
                {/* Logo Section */}
                <div className="p-6 border-b border-secondary-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
                            <Zap size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-secondary-900">SynapsePay</h1>
                            <p className="text-xs text-secondary-500 font-medium">Enterprise Payroll</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                    {navSections.map(section => (
                        <div key={section.header}>
                            <div className="uppercase text-xs font-bold text-secondary-400 px-3 mb-3 tracking-widest">
                                {section.header}
                            </div>
                            <ul className="space-y-1">
                                {section.items.map(item => (
                                    <SidebarNavLink key={item.name} item={item} />
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-secondary-200 bg-gradient-to-r from-secondary-50 to-primary-50">
                    <p className="text-xs text-center text-secondary-500 font-medium">SynapsePay v1.0.0</p>
                    <p className="text-xs text-center text-secondary-400 mt-1">Enterprise Edition</p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;