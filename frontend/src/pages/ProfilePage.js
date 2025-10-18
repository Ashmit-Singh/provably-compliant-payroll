import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, ShieldCheck, LogOut } from 'lucide-react';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    // ProtectedRoute should prevent this, but it's good practice to handle
    if (!user) {
        return (
            <div className="text-center p-8">
                <p>No user data found. Please log in.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
                <p className="mt-1 text-slate-500">View and manage your account details.</p>
            </div>

            {/* Profile Information Card */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-slate-200">
                <div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-8">
                    {/* Avatar */}
                    <div className="flex-shrink-0 mb-6 sm:mb-0">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                            <User size={48} className="text-blue-500" />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="w-full space-y-4">
                        <div className="flex items-center gap-3">
                            <User size={20} className="text-slate-400" />
                            <div>
                                <p className="text-sm text-slate-500">Username</p>
                                <p className="font-semibold text-slate-700 text-lg">{user.username}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Mail size={20} className="text-slate-400" />
                            <div>
                                <p className="text-sm text-slate-500">Email</p>
                                {/* In a real app, you'd get this from the user object */}
                                <p className="font-semibold text-slate-700 text-lg">{user.username}@example.com</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <ShieldCheck size={20} className="text-slate-400" />
                            <div>
                                <p className="text-sm text-slate-500">Roles</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {user.roles && user.roles.map(role => (
                                        <span key={role} className="px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                            {role.replace('ROLE_', '')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleLogout}
                        className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                    {/* Add an "Edit Profile" button that could navigate to another page or open a modal */}
                    <button className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2 text-slate-700 bg-slate-100 rounded-md shadow-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors">
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
