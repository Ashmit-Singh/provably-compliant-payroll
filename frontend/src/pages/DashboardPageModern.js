import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { getDashboardMetrics, getPayrollHistory } from '../services/api';
import StatsCard from '../components/ui/StatsCardModern';
import Card from '../components/ui/CardModern';
import PayrollHistoryCard from '../components/ui/PayrollHistoryCard';
import WelcomeCard from '../components/ui/WelcomeCard';
import AuditorPortalCard from '../components/ui/AuditorPortalCard';
import PremiumFeaturesDashboard from '../components/ui/PremiumFeaturesDashboard';

const DashboardPage = memo(() => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [payrollHistory, setPayrollHistory] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const metricsData = await getDashboardMetrics();
      setMetrics(metricsData);
      const payrollData = await getPayrollHistory();
      setPayrollHistory(payrollData);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary-900 mb-2">Dashboard</h1>
        <p className="text-secondary-600">Welcome back! Here's your payroll overview.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<Users size={24} />}
          label="Total Employees"
          value={metrics?.totalEmployees || 0}
          color="blue"
          trend={5}
        />
        <StatsCard
          icon={<DollarSign size={24} />}
          label="Monthly Payroll"
          value={`$${(metrics?.monthlyPayroll || 0).toLocaleString()}`}
          color="green"
          trend={8}
        />
        <StatsCard
          icon={<TrendingUp size={24} />}
          label="Active Projects"
          value={metrics?.activeProjects || 0}
          color="purple"
          trend={-2}
        />
        <StatsCard
          icon={<CheckCircle size={24} />}
          label="Compliance Score"
          value={`${metrics?.complianceScore || 0}%`}
          color="orange"
          trend={3}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Payroll History */}
        <div className="lg:col-span-2">
          <PayrollHistoryCard payrollHistory={payrollHistory} />
        </div>

        {/* Right Column - Quick Stats */}
        <div className="space-y-6">
          <Card
            title="Pending Approvals"
            value={metrics?.pendingApprovals || 0}
            color="blue"
            icon={<ArrowRight size={24} />}
          />
          <Card
            title="Upcoming Payroll"
            value={metrics?.upcomingPayroll || 0}
            color="green"
            icon={<DollarSign size={24} />}
          />
        </div>
      </div>

      {/* Welcome & Actions */}
      <WelcomeCard />

      {/* System Status & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-6">
          <h3 className="text-lg font-bold text-secondary-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/run-payroll')}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Run Payroll
            </button>
            <button
              onClick={() => navigate('/employees')}
              className="w-full px-4 py-2 bg-secondary-100 text-secondary-900 rounded-lg font-semibold hover:bg-secondary-200 transition-colors"
            >
              Add Employee
            </button>
            <button
              onClick={() => navigate('/compliance')}
              className="w-full px-4 py-2 bg-secondary-100 text-secondary-900 rounded-lg font-semibold hover:bg-secondary-200 transition-colors"
            >
              View Reports
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-6">
          <h3 className="text-lg font-bold text-secondary-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Backend API</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-success-100 text-success-700">
                ✓ Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Database</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-success-100 text-success-700">
                ✓ Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Blockchain</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-success-100 text-success-700">
                ✓ Operational
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Auditor Portal */}
      <AuditorPortalCard />

      {/* Premium Features */}
      <PremiumFeaturesDashboard metrics={metrics} />
    </div>
  );
});

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
