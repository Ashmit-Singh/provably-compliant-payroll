import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Menu, Bell, User, Settings, LogOut, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLayout } from '../../contexts/LayoutContext';

const Header = ({ onMenuClick, onCommandPaletteToggle }) => {
    const { user, logout } = useAuth();
    const { activePage } = useLayout();
    const location = useLocation();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const pathname = location.pathname || '';
    const routeTitleMap = {
        '/dashboard': 'Dashboard',
        '/employees': 'Employee Management',
        '/run-payroll': 'Run Payroll',
        '/compliance': 'Compliance & Tax Engine',
        '/analytics': 'Predictive Analytics',
        '/audit-trail': 'Blockchain Audit Trail',
        '/profile': 'My Profile',
    };
    const derivedTitle = routeTitleMap[pathname] || (pathname === '/' ? 'Dashboard' : activePage);

    return (
        <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-4 sm:px-8 bg-gradient-to-r from-secondary-50 to-primary-50 border-b border-secondary-200 shadow-sm backdrop-blur supports-[backdrop-filter]:backdrop-blur-md">
            {/* Left Side: Menu Toggle & Page Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-secondary-600 hover:text-secondary-800 p-1 -ml-1 rounded-md hover:bg-secondary-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
                    aria-label="Toggle Menu"
                >
                    <Menu size={24} />
                </button>
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-secondary-900 hidden sm:block">
                        {derivedTitle}
                    </h2>
                    <p className="text-xs text-secondary-500 hidden sm:block mt-0.5">Manage your enterprise payroll with confidence</p>
                </div>
            </div>

            {/* Right Side: Actions & User Info */}
            <div className="flex items-center gap-3 sm:gap-4">
                {/* Search Bar */}
                <button
                    onClick={onCommandPaletteToggle}
                    className="hidden md:flex items-center gap-2 text-sm text-secondary-600 bg-white border border-secondary-300 rounded-lg px-3 py-2 hover:bg-secondary-50 hover:border-secondary-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Open Command Palette"
                >
                    <Search size={16} className="text-secondary-400"/>
                    <span className="text-secondary-500">Quick Search</span>
                    <span className="bg-secondary-100 text-secondary-600 text-xs font-mono rounded px-1.5 py-0.5 ml-auto">⌘K</span>
                </button>

                {/* Notifications */}
                <button
                    className="p-2 text-secondary-600 hover:text-secondary-800 rounded-lg hover:bg-secondary-200 transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary-400"
                    aria-label="Notifications"
                >
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
                </button>

                {/* Settings */}
                <button
                    className="p-2 text-secondary-600 hover:text-secondary-800 rounded-lg hover:bg-secondary-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
                    aria-label="Settings"
                >
                    <Settings size={20} />
                </button>

                {/* User Menu */}
                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary-200 transition-colors border border-transparent hover:border-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-400"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center border border-primary-300 shadow-sm">
                                <span className="text-white text-sm font-bold">{user.username?.[0]?.toUpperCase() || 'U'}</span>
                            </div>
                            <span className="text-sm font-medium text-secondary-700 hidden sm:inline max-w-[100px] truncate">
                                {user.username || user.email}
                            </span>
                            <ChevronDown size={16} className="text-secondary-500" />
                        </button>
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50">
                                <Link to="/profile" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors">
                                    <User size={16} className="inline mr-2" /> My Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setShowUserMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
                                >
                                    <LogOut size={16} className="inline mr-2" /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="text-sm font-semibold text-primary-600 hover:text-primary-700 px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors">
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;