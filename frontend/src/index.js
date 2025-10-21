import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import './styles/index.css';

import AppLayout from './App';
import LoginPageModern from './pages/LoginPageModern';
import DashboardPageModern from './pages/DashboardPageModern';
import EmployeeManagementModern from './pages/EmployeeManagementModern';
import RunPayrollModern from './pages/RunPayrollModern';
import ComplianceTaxEngineModern from './pages/ComplianceTaxEngineModern';
import PredictiveAnalytics from './pages/PredictiveAnalytics';
import BlockchainAuditTrail from './pages/BlockchainAuditTrail';
import ProfilePageModern from './pages/ProfilePageModern';

import { LayoutProvider } from './contexts/LayoutContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-100 text-slate-800">
        Loading Application...
      </div>
    );
  }

  if (!isAuthenticated) {
    if (process.env.NODE_ENV === 'development') console.log('User not authenticated, redirecting to login from:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Main Router Setup
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPageModern />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Authenticated Child Routes */}
          <Route path="dashboard" element={<DashboardPageModern />} />
          <Route path="employees" element={<EmployeeManagementModern />} />
          <Route path="run-payroll" element={<RunPayrollModern />} />
          <Route path="compliance" element={<ComplianceTaxEngineModern />} />
          <Route path="analytics" element={<PredictiveAnalytics />} />
          <Route path="audit-trail" element={<BlockchainAuditTrail />} />
          <Route path="profile" element={<ProfilePageModern />} />

          {/* Authenticated 404 Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Public 404 Fallback */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
              <h2 className="text-2xl mb-4 text-slate-800">404 - Page Not Found</h2>
              <Link to="/" className="text-blue-500 hover:underline">
                Go Home
              </Link>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

// Render the Application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <LayoutProvider>
            <AppRouter />
          </LayoutProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
