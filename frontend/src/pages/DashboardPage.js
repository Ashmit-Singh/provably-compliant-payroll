import React, { useState, useEffect, useCallback, memo } from 'react';
import { getDashboardMetrics, getPayrollHistory } from '../services/api';
import StatusCard from '../components/ui/StatusCard';
import QuickActionsCard from '../components/ui/QuickActionsCard';
import SystemStatusCard from '../components/ui/SystemStatusCard';
import PayrollHistoryCard from '../components/ui/PayrollHistoryCard';
import WelcomeCard from '../components/ui/WelcomeCard';
import AuditorPortalCard from '../components/ui/AuditorPortalCard';
import PremiumFeaturesDashboard from '../components/ui/PremiumFeaturesDashboard';

// Removed duplicate lazy PremiumFeaturesDashboard
const DashboardPage = memo(() => {
  const [metrics, setMetrics] = useState(null);
  const [payrollHistory, setPayrollHistory] = useState([]);
  // Removed unused isLoading and error state
  const fetchData = useCallback(async () => {
    try {
      const metricsData = await getDashboardMetrics();
      setMetrics(metricsData);
      const payrollData = await getPayrollHistory();
      setPayrollHistory(payrollData);
  // Removed setIsLoading
    } catch (err) {
  // Removed setError
  // Removed setIsLoading
    }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      
      {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatusCard title="Total Employees" value={metrics?.totalEmployees || 0} icon={<span className="material-icons">groups</span>} color="blue" />
          <StatusCard title="Monthly Payroll" value={`$${(metrics?.monthlyPayroll || 0).toLocaleString()}`} icon={<span className="material-icons">attach_money</span>} color="green" />
          <StatusCard title="Active Projects" value={metrics?.activeProjects || 0} icon={<span className="material-icons">work_outline</span>} color="purple" />
          <StatusCard title="Compliance Score" value={`${metrics?.complianceScore || 0}%`} icon={<span className="material-icons">verified</span>} color="orange" />
        </div>

      <PayrollHistoryCard payrollHistory={payrollHistory} />

      <WelcomeCard />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickActionsCard />
        <SystemStatusCard />
      </div>
      {/* Auditor Access Portal */}
      <AuditorPortalCard />
      <PremiumFeaturesDashboard metrics={metrics} />
    </div>
  );
});

export default DashboardPage;