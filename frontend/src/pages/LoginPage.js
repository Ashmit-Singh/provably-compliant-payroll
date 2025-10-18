import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Import useLocation
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Loader, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get location state

  // Determine where to redirect after login
  const from = location.state?.from?.pathname || "/dashboard"; // Default to dashboard

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      if (process.env.NODE_ENV === 'development') console.log('Login successful, navigating to:', from);
      navigate(from, { replace: true }); // Navigate back to original page or dashboard
    } else {
      if (process.env.NODE_ENV === 'development') console.log('Login failed.');
      // The error state from useAuth will be set and displayed automatically
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">CompliantPay</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access your enterprise payroll dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-slate-600">
          Need an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
             Contact Admin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
