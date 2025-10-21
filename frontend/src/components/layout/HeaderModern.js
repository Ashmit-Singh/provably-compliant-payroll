import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Menu, Bell, User, Settings, LogOut, Search, ChevronDown, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLayout } from '../../contexts/LayoutContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotification } from '../../contexts/NotificationContext';
import AdvancedSearch from '../ui/AdvancedSearch';

const HeaderModern = ({ onMenuClick, onCommandPaletteToggle }) => {
    const { user, logout } = useAuth();
    const { activePage } = useLayout();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { success, error } = useNotification();
    const location = useLocation();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [notificationCount, setNotificationCount] = useState(3);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAdvancedSearch = (searchData) => {
        success(`Searching for: ${searchData.query}`);
        setShowAdvancedSearch(false);
        // Here you would typically dispatch to a search action or navigate to results
    };

    const handleNotificationClick = () => {
        success('You have 3 new notifications');
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
        <>
            <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-4 sm:px-8 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
                {/* Left Side: Menu Toggle & Page Title */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1 -ml-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label="Toggle Menu"
                    >
                        <Menu size={24} />
                    </button>
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 hidden sm:block">
                            {derivedTitle}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block mt-0.5">Manage your enterprise payroll with confidence</p>
                    </div>
                </div>

                {/* Right Side: Actions & User Info */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Advanced Search Button */}
                    <button
                        onClick={() => setShowAdvancedSearch(true)}
                        className="hidden md:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Open Advanced Search"
                    >
                        <Search size={16} className="text-slate-400 dark:text-slate-500" />
                        <span className="text-slate-500 dark:text-slate-400">Advanced Search</span>
                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-mono rounded px-1.5 py-0.5 ml-auto">⌘⇧K</span>
                    </button>

                    {/* Quick Search (Command Palette) */}
                    <button
                        onClick={onCommandPaletteToggle}
                        className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label="Quick Search"
                        title="Press Ctrl+K"
                    >
                        <Search size={20} />
                    </button>

                    {/* Notifications */}
                    <button
                        onClick={handleNotificationClick}
                        className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label="Notifications"
                    >
                        <Bell size={20} />
                        {notificationCount > 0 && (
                            <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {notificationCount}
                            </span>
                        )}
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? (
                            <Sun size={20} className="text-yellow-500" />
                        ) : (
                            <Moon size={20} />
                        )}
                    </button>

                    {/* Settings */}
                    <button
                        className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label="Settings"
                    >
                        <Settings size={20} />
                    </button>

                    {/* User Menu */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center border border-blue-300 shadow-sm">
                                    <span className="text-white text-sm font-bold">{user.username?.[0]?.toUpperCase() || 'U'}</span>
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:inline max-w-[100px] truncate">
                                    {user.username || user.email}
                                </span>
                                <ChevronDown size={16} className="text-slate-500 dark:text-slate-400" />
                            </button>
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                        <User size={16} className="inline mr-2" /> My Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setShowUserMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 transition-colors"
                                    >
                                        <LogOut size={16} className="inline mr-2" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 transition-colors">
                            Login
                        </Link>
                    )}
                </div>
            </header>

            {/* Advanced Search Modal */}
            <AdvancedSearch
                isOpen={showAdvancedSearch}
                onClose={() => setShowAdvancedSearch(false)}
                onSearch={handleAdvancedSearch}
            />
        </>
    );
};

export default HeaderModern;
