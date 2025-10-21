import React, { memo } from 'react';
import Card from './Card';
import StatsCard from './StatsCard';
import ChartContainer from './ChartContainer';
import GlobalPayrollReportCard from './GlobalPayrollReportCard';
import { MapPin, Shield, Bitcoin, TrendingUp, UserPlus } from 'lucide-react';

const PremiumFeaturesDashboard = memo(({ 
  complianceRiskScore,
  cryptoPayrollMetrics,
  globalPayrollReport,
  financialWellnessAnalytics,
  isFreeUser,
  onUpgrade
}) => {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<Shield className="text-indigo-600" size={20} />}
          label="AI Compliance Risk Score"
          value={complianceRiskScore + '%'}
          color="indigo"
        />
        <StatsCard
          icon={<Bitcoin className="text-yellow-500" size={20} />}
          label="Crypto Payroll Allocation"
          value={cryptoPayrollMetrics?.allocation || '$0'}
          color="yellow"
        />
        <StatsCard
          icon={<MapPin className="text-blue-600" size={20} />}
          label="Countries Supported"
          value={globalPayrollReport?.countries?.length || 0}
          color="blue"
        />
        <StatsCard
          icon={<TrendingUp className="text-green-600" size={20} />}
          label="Financial Wellness Usage"
          value={financialWellnessAnalytics?.activeUsers || 0}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold mb-2">Global Payroll Overview</h3>
          <GlobalPayrollReportCard report={globalPayrollReport} />
        </Card>
        <Card>
          <h3 className="text-lg font-bold mb-2">Financial Wellness Analytics</h3>
          <ChartContainer>
            {/* Example: Usage chart, replace with real chart as needed */}
            <div className="h-48 flex items-center justify-center text-slate-400">Analytics Chart Placeholder</div>
          </ChartContainer>
        </Card>
      </div>

      {isFreeUser && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 border-indigo-200 text-center py-8">
          <h3 className="text-xl font-bold text-indigo-700 mb-2">Unlock Premium Features</h3>
          <p className="text-slate-700 mb-4">Upgrade to access advanced analytics, global payroll, crypto allocation, and AI compliance risk scoring.</p>
          <button
            onClick={onUpgrade}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-indigo-700 transition-colors"
          >
            <UserPlus size={20} /> Upgrade Now
          </button>
        </Card>
      )}
    </div>
  );
});

export default PremiumFeaturesDashboard;
