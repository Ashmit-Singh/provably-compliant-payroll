import React, { useState, useEffect } from 'react';
import { getDashboardMetrics, getPayrollHistory } from '../services/api';

const DashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch both dashboard metrics and payroll history separately
        const metricsData = await getDashboardMetrics();
        const payrollData = await getPayrollHistory();
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Dashboard metrics:', metricsData);
          console.log('Payroll history:', payrollData);
        }
        
        setMetrics(metricsData);
        // Ensure payrollData is always an array
        setPayrollHistory(Array.isArray(payrollData) ? payrollData : []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-slate-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
          <div className="text-red-700">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Total Employees</h3>
          <p className="text-3xl font-bold text-blue-600">{metrics?.totalEmployees || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Monthly Payroll</h3>
          <p className="text-3xl font-bold text-green-600">
            ${(metrics?.monthlyPayroll || 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Active Projects</h3>
          <p className="text-3xl font-bold text-purple-600">{metrics?.activeProjects || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Compliance Score</h3>
          <p className="text-3xl font-bold text-orange-600">{metrics?.complianceScore || 0}%</p>
        </div>
      </div>

      {/* Recent Payroll Runs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Payroll Runs</h2>
        {payrollHistory && payrollHistory.length > 0 ? (
          <div className="space-y-3">
            {payrollHistory.slice(0, 5).map((payroll) => (
              <div key={payroll.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">{payroll.payPeriod}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(payroll.timestamp).toLocaleDateString()} • {payroll.employeeCount} employees
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">${(payroll.totalAmount || 0).toLocaleString()}</p>
                  <p className={`text-xs font-medium ${
                    payroll.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {payroll.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No payroll runs yet</p>
        )}
      </div>

      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Welcome to Provably Compliant Payroll</h2>
        <p className="text-slate-600 mb-4">
          This is your dashboard. You can navigate to different sections using the sidebar.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Quick Actions</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Run payroll for current period</li>
              <li>• Add new employee</li>
              <li>• View compliance reports</li>
              <li>• Check audit trail</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">System Status</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• All systems operational</li>
              <li>• Blockchain sync: Active</li>
              <li>• Compliance engine: Ready</li>
              <li>• Tax rules: Up to date</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;