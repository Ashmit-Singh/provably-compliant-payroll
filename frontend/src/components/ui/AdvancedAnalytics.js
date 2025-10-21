import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, LineChart, Download, X } from 'lucide-react';

const AdvancedAnalytics = ({ isOpen, onClose }) => {
  const [selectedMetric, setSelectedMetric] = useState('payroll');
  const [timeRange, setTimeRange] = useState('month');

  const metrics = [
    {
      id: 'payroll',
      label: 'Payroll Trends',
      icon: TrendingUp,
      color: 'from-blue-600 to-blue-700',
      data: {
        current: '$285,000',
        change: '+5.2%',
        trend: 'up',
      },
    },
    {
      id: 'tax',
      label: 'Tax Analysis',
      icon: PieChart,
      color: 'from-green-600 to-green-700',
      data: {
        current: '$68,400',
        change: '+2.1%',
        trend: 'up',
      },
    },
    {
      id: 'compliance',
      label: 'Compliance Score',
      icon: BarChart3,
      color: 'from-purple-600 to-purple-700',
      data: {
        current: '98.5%',
        change: '+1.2%',
        trend: 'up',
      },
    },
    {
      id: 'employees',
      label: 'Employee Metrics',
      icon: LineChart,
      color: 'from-orange-600 to-orange-700',
      data: {
        current: '47',
        change: '+3',
        trend: 'up',
      },
    },
  ];

  const timeRanges = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' },
  ];

  const selectedMetricData = metrics.find(m => m.id === selectedMetric);
  const Icon = selectedMetricData?.icon;

  // Mock chart data
  const chartData = [
    { label: 'Week 1', value: 65 },
    { label: 'Week 2', value: 72 },
    { label: 'Week 3', value: 68 },
    { label: 'Week 4', value: 85 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 size={24} className="text-white" />
            <h2 className="text-2xl font-bold text-white">Advanced Analytics</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-indigo-500 rounded-lg transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metric Selection */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
              Select Metric
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {metrics.map(metric => {
                const MetricIcon = metric.icon;
                return (
                  <button
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedMetric === metric.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900 dark:bg-opacity-20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    <MetricIcon size={24} className={`mb-2 bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`} />
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {metric.label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {metric.data.current}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Range Selection */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
              Time Range
            </h3>
            <div className="flex gap-2 flex-wrap">
              {timeRanges.map(range => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    timeRange === range.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900 dark:bg-opacity-20 text-indigo-900 dark:text-indigo-200'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
              {selectedMetricData?.label} - {timeRanges.find(r => r.id === timeRange)?.label}
            </h3>

            {/* Bar Chart */}
            <div className="flex items-end justify-around h-64 gap-4 mb-4">
              {chartData.map((data, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.value / maxValue) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`flex-1 bg-gradient-to-t ${selectedMetricData?.color} rounded-t-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer group relative`}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {data.value}%
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Labels */}
            <div className="flex justify-around text-xs text-slate-600 dark:text-slate-400 font-semibold">
              {chartData.map((data, index) => (
                <div key={index}>{data.label}</div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">
                Current Value
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                {selectedMetricData?.data.current}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900 dark:bg-opacity-20 border border-green-200 dark:border-green-700 rounded-lg p-4">
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold mb-1">
                Change
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                {selectedMetricData?.data.change}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
              <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-1">
                Trend
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                📈 Positive
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-700 px-6 py-4 border-t border-slate-200 dark:border-slate-600 flex items-center justify-between">
          <button className="flex items-center gap-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 dark:hover:bg-opacity-20 rounded-lg transition-colors">
            <Download size={18} />
            Export Report
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-50 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedAnalytics;
