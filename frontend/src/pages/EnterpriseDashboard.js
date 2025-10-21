import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, TrendingUp, AlertCircle, MoreVertical } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb';
import DataTable from '../components/ui/DataTable';
import SkeletonLoader from '../components/common/SkeletonLoader';

const EnterpriseDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(false);

  const employeeColumns = [
    { 
      key: 'name', 
      label: 'Employee Name', 
      render: (val) => <span className="font-semibold text-slate-900 dark:text-slate-50">{val}</span> 
    },
    { key: 'email', label: 'Email', render: (val) => <span className="text-slate-600 dark:text-slate-400">{val}</span> },
    { key: 'department', label: 'Department' },
    { 
      key: 'salary', 
      label: 'Salary', 
      render: (val) => <span className="font-semibold text-green-600 dark:text-green-400">${val.toLocaleString()}</span> 
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          val === 'Active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-300' 
            : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
        }`}>
          {val}
        </span>
      )
    },
  ];

  const employeeData = [
    { name: 'John Doe', email: 'john@synapsepay.com', department: 'Engineering', salary: 95000, status: 'Active' },
    { name: 'Jane Smith', email: 'jane@synapsepay.com', department: 'HR', salary: 75000, status: 'Active' },
    { name: 'Bob Johnson', email: 'bob@synapsepay.com', department: 'Sales', salary: 85000, status: 'Active' },
    { name: 'Alice Williams', email: 'alice@synapsepay.com', department: 'Operations', salary: 80000, status: 'Active' },
    { name: 'Charlie Brown', email: 'charlie@synapsepay.com', department: 'Engineering', salary: 92000, status: 'Active' },
  ];

  const kpis = [
    { icon: Users, label: 'Total Employees', value: '47', trend: '+5%', color: 'blue' },
    { icon: DollarSign, label: 'Monthly Payroll', value: '$290K', trend: '+8%', color: 'green' },
    { icon: TrendingUp, label: 'YTD Payroll', value: '$1.2M', trend: '+12%', color: 'purple' },
    { icon: AlertCircle, label: 'Compliance', value: '98.5%', trend: '+1.2%', color: 'orange' },
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Dashboard' }]} />

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">Welcome back! Here's your payroll overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          const colorMap = {
            blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20',
            green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 dark:bg-opacity-20',
            purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20',
            orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20',
          };

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{kpi.label}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{kpi.value}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">{kpi.trend} vs last month</p>
                </div>
                <div className={`p-3 rounded-lg ${colorMap[kpi.color]}`}>
                  <Icon size={24} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Employees Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Recent Employees</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage your workforce</p>
          </div>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <MoreVertical size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {loading ? (
          <SkeletonLoader type="table" count={5} />
        ) : (
          <DataTable
            columns={employeeColumns}
            data={employeeData}
            sortable
            filterable
            selectable
            pagination
            pageSize={5}
          />
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { title: 'Add Employee', description: 'Create a new employee record', color: 'blue' },
          { title: 'Generate Payslip', description: 'Create payslips for employees', color: 'green' },
          { title: 'View Reports', description: 'Access payroll reports', color: 'purple' },
        ].map((action, idx) => {
          const colorMap = {
            blue: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
            green: 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
            purple: 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
          };

          return (
            <button
              key={idx}
              className={`bg-gradient-to-r ${colorMap[action.color]} text-white rounded-lg p-6 text-left transition-all hover:shadow-lg`}
            >
              <h3 className="font-semibold mb-1">{action.title}</h3>
              <p className="text-sm opacity-90">{action.description}</p>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default EnterpriseDashboard;
