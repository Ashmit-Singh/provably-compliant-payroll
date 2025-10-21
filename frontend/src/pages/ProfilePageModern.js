import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, ShieldCheck, LogOut, Edit, Save, X, Calendar, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || `${user?.username}@example.com`,
        phone: '+1-555-0100',
        location: 'New York, USA',
        joinDate: '2023-01-15'
    });

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setIsEditing(false);
        // In a real app, you'd send this to the backend
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-8">
                    <p className="text-lg text-slate-600">No user data found. Please log in.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">My Profile</h1>
                <p className="text-slate-600">View and manage your account details</p>
            </div>

            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
            >
                {/* Header Background */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-700"></div>

                {/* Profile Content */}
                <div className="px-6 pb-6">
                    {/* Avatar */}
                    <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 mb-6">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
                            <span className="text-5xl font-bold text-white">
                                {user.username?.[0]?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-slate-900">{user.username}</h2>
                            <p className="text-slate-600 mt-1">
                                {user.roles?.includes('ROLE_ADMIN') ? '👑 Administrator' : '👤 User'}
                            </p>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Edit size={18} />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Profile Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {/* Username */}
                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <User size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Username</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <p className="text-lg font-semibold text-slate-900 mt-1">{formData.username}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <Mail size={24} className="text-green-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Email</p>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <p className="text-lg font-semibold text-slate-900 mt-1">{formData.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <Phone size={24} className="text-purple-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Phone</p>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <p className="text-lg font-semibold text-slate-900 mt-1">{formData.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <MapPin size={24} className="text-orange-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Location</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <p className="text-lg font-semibold text-slate-900 mt-1">{formData.location}</p>
                                )}
                            </div>
                        </div>

                        {/* Join Date */}
                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <Calendar size={24} className="text-red-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Join Date</p>
                                <p className="text-lg font-semibold text-slate-900 mt-1">{formData.joinDate}</p>
                            </div>
                        </div>

                        {/* Roles */}
                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <ShieldCheck size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Roles</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {user.roles && user.roles.length > 0 ? (
                                        user.roles.map(role => (
                                            <span key={role} className="px-3 py-1 text-sm font-bold bg-blue-100 text-blue-700 rounded-full">
                                                {role.replace('ROLE_', '')}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="px-3 py-1 text-sm font-bold bg-slate-100 text-slate-700 rounded-full">
                                            User
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                        {isEditing && (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                            </>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Account Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-slate-600">Account Status</p>
                        <p className="text-lg font-bold text-green-600 mt-1">✓ Active</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600">Account Type</p>
                        <p className="text-lg font-bold text-slate-900 mt-1">
                            {user.roles?.includes('ROLE_ADMIN') ? 'Administrator' : 'Standard User'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600">Last Login</p>
                        <p className="text-lg font-bold text-slate-900 mt-1">Today</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

ProfilePage.displayName = 'ProfilePage';

export default ProfilePage;
