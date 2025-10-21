import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, Edit, Trash2, Plus, Filter, X } from 'lucide-react';

const AuditLog = ({ isOpen, onClose }) => {
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('all');

  // Mock audit log data
  const auditLogs = [
    {
      id: 1,
      timestamp: '2025-10-21 20:45:30',
      user: 'admin@synapsepay.com',
      action: 'Created',
      entity: 'Employee',
      entityName: 'John Doe',
      details: 'New employee record created',
      status: 'success',
    },
    {
      id: 2,
      timestamp: '2025-10-21 20:30:15',
      user: 'hr@synapsepay.com',
      action: 'Updated',
      entity: 'Payroll',
      entityName: 'October 2025 Payroll',
      details: 'Gross amount updated from $285,000 to $290,000',
      status: 'success',
    },
    {
      id: 3,
      timestamp: '2025-10-21 20:15:45',
      user: 'admin@synapsepay.com',
      action: 'Deleted',
      entity: 'Employee',
      entityName: 'Jane Smith',
      details: 'Employee record deleted',
      status: 'success',
    },
    {
      id: 4,
      timestamp: '2025-10-21 19:50:20',
      user: 'accountant@synapsepay.com',
      action: 'Viewed',
      entity: 'Report',
      entityName: 'Tax Compliance Report',
      details: 'Accessed tax compliance report',
      status: 'success',
    },
    {
      id: 5,
      timestamp: '2025-10-21 19:30:10',
      user: 'admin@synapsepay.com',
      action: 'Updated',
      entity: 'Settings',
      entityName: 'System Settings',
      details: 'Changed tax calculation method',
      status: 'warning',
    },
  ];

  const getActionIcon = (action) => {
    switch (action) {
      case 'Created':
        return <Plus size={16} className="text-success-600" />;
      case 'Updated':
        return <Edit size={16} className="text-info-600" />;
      case 'Deleted':
        return <Trash2 size={16} className="text-danger-600" />;
      default:
        return <Clock size={16} className="text-secondary-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-success-50 dark:bg-success-900 dark:bg-opacity-20 border-success-200 dark:border-success-700';
      case 'warning':
        return 'bg-warning-50 dark:bg-warning-900 dark:bg-opacity-20 border-warning-200 dark:border-warning-700';
      case 'error':
        return 'bg-danger-50 dark:bg-danger-900 dark:bg-opacity-20 border-danger-200 dark:border-danger-700';
      default:
        return 'bg-secondary-50 dark:bg-secondary-700 border-secondary-200 dark:border-secondary-600';
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    if (filterType !== 'all' && log.action !== filterType) return false;
    if (filterUser !== 'all' && log.user !== filterUser) return false;
    return true;
  });

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
        className="bg-white dark:bg-secondary-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-info-600 to-info-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock size={24} className="text-white" />
            <h2 className="text-2xl font-bold text-white">Audit Log</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-info-500 rounded-lg transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Filters */}
        <div className="bg-secondary-50 dark:bg-secondary-700 px-6 py-4 border-b border-secondary-200 dark:border-secondary-600 flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-secondary-700 dark:text-secondary-300 mb-1 flex items-center gap-1">
              <Filter size={14} />
              Action Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm focus:outline-none focus:border-primary-600 dark:bg-secondary-600 dark:text-secondary-50"
            >
              <option value="all">All Actions</option>
              <option value="Created">Created</option>
              <option value="Updated">Updated</option>
              <option value="Deleted">Deleted</option>
              <option value="Viewed">Viewed</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-secondary-700 dark:text-secondary-300 mb-1 flex items-center gap-1">
              <User size={14} />
              User
            </label>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm focus:outline-none focus:border-primary-600 dark:bg-secondary-600 dark:text-secondary-50"
            >
              <option value="all">All Users</option>
              <option value="admin@synapsepay.com">Admin</option>
              <option value="hr@synapsepay.com">HR Manager</option>
              <option value="accountant@synapsepay.com">Accountant</option>
            </select>
          </div>
        </div>

        {/* Logs List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border ${getStatusColor(log.status)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white dark:bg-secondary-700 rounded-lg">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-secondary-900 dark:text-secondary-50">
                        {log.action} {log.entity}
                      </h4>
                      <span className="text-xs text-secondary-500 dark:text-secondary-400 font-mono">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                      {log.entityName}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        {log.details}
                      </p>
                      <span className="px-2 py-1 bg-white dark:bg-secondary-700 rounded text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                        {log.user}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary-500 dark:text-secondary-400">No audit logs found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-secondary-50 dark:bg-secondary-700 px-6 py-4 border-t border-secondary-200 dark:border-secondary-600 flex items-center justify-between">
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            Showing {filteredLogs.length} of {auditLogs.length} entries
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary-200 dark:bg-secondary-600 text-secondary-900 dark:text-secondary-50 rounded-lg font-semibold hover:bg-secondary-300 dark:hover:bg-secondary-500 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuditLog;
