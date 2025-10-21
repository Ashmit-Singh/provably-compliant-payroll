import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Filter, Calendar, User, DollarSign, CheckCircle } from 'lucide-react';

const AdvancedSearch = ({ onSearch, onClose, isOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateRange: 'all',
    department: 'all',
  });
  const [searchHistory, setSearchHistory] = useState([]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      setSearchHistory(prev => [searchQuery, ...prev.slice(0, 4)]);
      onSearch({ query: searchQuery, filters });
      setSearchQuery('');
    }
  }, [searchQuery, filters, onSearch]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      dateRange: 'all',
      department: 'all',
    });
  };

  const handleHistoryClick = (query) => {
    setSearchQuery(query);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-40 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-slate-100 rounded-xl shadow-2xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search size={24} className="text-white" />
            <h2 className="text-2xl font-bold text-white">Advanced Search</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-900 mb-2">
              Search Query
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search employees, payroll, reports..."
                className="flex-1 px-4 py-2 border-2 border-slate-300 dark:border-slate-400 rounded-lg focus:outline-none focus:border-blue-600 dark:bg-white dark:text-slate-900"
                autoFocus
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-900 flex items-center gap-2">
                <Filter size={20} />
                Filters
              </h3>
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-800 mb-2">
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-300 dark:border-slate-400 rounded-lg focus:outline-none focus:border-blue-600 dark:bg-white dark:text-slate-900"
                >
                  <option value="all">All Types</option>
                  <option value="employee">Employee</option>
                  <option value="payroll">Payroll</option>
                  <option value="report">Report</option>
                  <option value="compliance">Compliance</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-800 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-300 dark:border-slate-400 rounded-lg focus:outline-none focus:border-blue-600 dark:bg-white dark:text-slate-900"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-800 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-300 dark:border-slate-400 rounded-lg focus:outline-none focus:border-blue-600 dark:bg-white dark:text-slate-900"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-800 mb-2 flex items-center gap-2">
                  <User size={16} />
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-300 dark:border-slate-400 rounded-lg focus:outline-none focus:border-blue-600 dark:bg-white dark:text-slate-900"
                >
                  <option value="all">All Departments</option>
                  <option value="engineering">Engineering</option>
                  <option value="sales">Sales</option>
                  <option value="hr">HR</option>
                  <option value="operations">Operations</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-800">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(query)}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-200 text-slate-700 dark:text-slate-800 rounded-full text-sm hover:bg-slate-200 dark:hover:bg-slate-300 transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-200 px-6 py-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-300">
          <p className="text-sm text-slate-600 dark:text-slate-700">
            Tip: Use filters to narrow down your search results
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-300 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-400 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedSearch;
