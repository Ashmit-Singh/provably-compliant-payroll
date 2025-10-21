import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Sheet, File, Mail, Calendar, X } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const DataExport = ({ isOpen, onClose, dataType = 'payroll' }) => {
  const { success, error } = useNotification();
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState('current');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    { id: 'pdf', label: 'PDF Report', icon: FileText, color: 'text-danger-600' },
    { id: 'excel', label: 'Excel Sheet', icon: Sheet, color: 'text-success-600' },
    { id: 'csv', label: 'CSV File', icon: File, color: 'text-primary-600' },
  ];

  const dateRanges = [
    { id: 'current', label: 'Current Period' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' },
    { id: 'custom', label: 'Custom Range' },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fileName = `${dataType}-report-${new Date().toISOString().split('T')[0]}.${selectedFormat === 'pdf' ? 'pdf' : selectedFormat === 'excel' ? 'xlsx' : 'csv'}`;
      
      success(`Exported ${dataType} report as ${selectedFormat.toUpperCase()}`);
      onClose();
    } catch (err) {
      error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

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
        className="bg-white dark:bg-secondary-800 rounded-xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download size={24} className="text-white" />
            <h2 className="text-xl font-bold text-white">Export Data</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-primary-500 rounded-lg transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {exportFormats.map(format => {
                const Icon = format.icon;
                return (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedFormat === format.id
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900 dark:bg-opacity-20'
                        : 'border-secondary-200 dark:border-secondary-700 hover:border-primary-400'
                    }`}
                  >
                    <Icon size={24} className={`mx-auto mb-1 ${format.color}`} />
                    <p className="text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                      {format.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-semibold text-secondary-900 dark:text-secondary-50 mb-2 flex items-center gap-2">
              <Calendar size={16} />
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border-2 border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:border-primary-600 dark:bg-secondary-700 dark:text-secondary-50"
            >
              {dateRanges.map(range => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Options */}
          <div>
            <label className="flex items-center gap-3 p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg cursor-pointer hover:bg-secondary-100 dark:hover:bg-secondary-600 transition-colors">
              <input
                type="checkbox"
                checked={includeDetails}
                onChange={(e) => setIncludeDetails(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Include detailed breakdown
              </span>
            </label>
          </div>

          {/* Info Box */}
          <div className="p-3 bg-info-50 dark:bg-info-900 dark:bg-opacity-20 border border-info-200 dark:border-info-700 rounded-lg">
            <p className="text-sm text-info-900 dark:text-info-200">
              📊 Your export will include all relevant data for the selected period.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-secondary-50 dark:bg-secondary-700 px-6 py-4 flex items-center justify-between border-t border-secondary-200 dark:border-secondary-600">
          <button
            onClick={onClose}
            className="px-4 py-2 text-secondary-900 dark:text-secondary-50 rounded-lg hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download size={18} />
                Export
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DataExport;
