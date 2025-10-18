import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, Bell, User, Settings, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLayout } from '../../contexts/LayoutContext';

const Header = ({ onMenuClick, onCommandPaletteToggle }) => {
    const { user, logout } = useAuth();
    const { activePage } = useLayout();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-slate-200 shadow-sm">
            {/* Left Side: Menu Toggle (Mobile) & Page Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-slate-500 hover:text-slate-700 p-1 -ml-1 rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    aria-label="Toggle Menu"
                >
                    <Menu size={24} />
                </button>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-800 hidden sm:block">
                    {activePage}
                </h2>
            </div>

            {/* Right Side: Actions & User Info */}
            <div className="flex items-center gap-2 sm:gap-3">
                <button
                    onClick={onCommandPaletteToggle}
                    className="flex items-center gap-2 text-sm text-slate-500 border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
                    aria-label="Open Command Palette"
                >
                    <Search size={16}/>
                    <span className="hidden md:inline">Quick Search</span>
                    <span className="hidden md:inline bg-slate-200 text-slate-600 text-xs font-mono rounded px-1.5 py-0.5">⌘K</span>
                </button>

                <button
                    className="p-2 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors relative focus:outline-none focus:ring-2 focus:ring-slate-400"
                    aria-label="Notifications"
                >
                    <Bell size={20}/>
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                </button>

                <button
                    className="p-2 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
                    aria-label="Settings"
                >
                    <Settings size={20}/>
                </button>

                {user ? (
                    <>
                        <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
                                <User size={16} className="text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 hidden sm:inline">
                                {user.username || user.email}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                            aria-label="Logout"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;