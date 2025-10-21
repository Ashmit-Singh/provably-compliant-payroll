import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Printer, FileText, DollarSign, Users, Calendar, CheckCircle } from 'lucide-react';

const PayrollReportModal = ({ isOpen, onClose }) => {
  const [reportFormat, setReportFormat] = useState('summary');

  if (!isOpen) return null;

  const reportData = {
    payPeriod: 'October 2025',
    processedDate: new Date().toLocaleDateString(),
    totalEmployees: 47,
    grossPayroll: 285000,
    taxes: 68400,
    deductions: 15000,
    netPayroll: 216600,
    breakdown: [
      { category: 'Federal Tax', amount: 35700, percentage: 12.5 },
      { category: 'State Tax', amount: 18500, percentage: 6.5 },
      { category: 'Social Security', amount: 10200, percentage: 3.6 },
      { category: 'Medicare', amount: 4000, percentage: 1.4 },
    ],
    departments: [
      { name: 'Engineering', employees: 15, payroll: 95000, status: 'Processed' },
      { name: 'Sales', employees: 12, payroll: 78000, status: 'Processed' },
      { name: 'HR', employees: 8, payroll: 52000, status: 'Processed' },
      { name: 'Operations', employees: 12, payroll: 60000, status: 'Processed' },
    ],
  };

  const handleDownload = () => {
    // Simulate PDF download
    const element = document.createElement('a');
    const file = new Blob([generateReportContent()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `payroll-report-${reportData.payPeriod.replace(' ', '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  const generateReportContent = () => {
    return `
COMPLIANTPAY - PAYROLL REPORT
==============================
Pay Period: ${reportData.payPeriod}
Processed Date: ${reportData.processedDate}

SUMMARY
-------
Total Employees: ${reportData.totalEmployees}
Gross Payroll: $${reportData.grossPayroll.toLocaleString()}
Total Taxes & Deductions: $${(reportData.taxes + reportData.deductions).toLocaleString()}
Net Payroll: $${reportData.netPayroll.toLocaleString()}

TAX BREAKDOWN
-------------
${reportData.breakdown.map(item => `${item.category}: $${item.amount.toLocaleString()} (${item.percentage}%)`).join('\n')}

DEPARTMENT BREAKDOWN
--------------------
${reportData.departments.map(dept => `${dept.name}: ${dept.employees} employees, $${dept.payroll.toLocaleString()}`).join('\n')}
    `;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-white" />
            <h2 className="text-2xl font-bold text-white">Payroll Report</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Report Format Tabs */}
          <div className="flex gap-2 mb-6 border-b border-slate-200">
            <button
              onClick={() => setReportFormat('summary')}
              className={`px-4 py-2 font-semibold transition-colors ${
                reportFormat === 'summary'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setReportFormat('detailed')}
              className={`px-4 py-2 font-semibold transition-colors ${
                reportFormat === 'detailed'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Detailed
            </button>
            <button
              onClick={() => setReportFormat('departments')}
              className={`px-4 py-2 font-semibold transition-colors ${
                reportFormat === 'departments'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              By Department
            </button>
          </div>

          {/* Summary View */}
          {reportFormat === 'summary' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600 mb-1">Pay Period</p>
                  <p className="text-2xl font-bold text-slate-900">{reportData.payPeriod}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600 mb-1">Total Employees</p>
                  <p className="text-2xl font-bold text-slate-900">{reportData.totalEmployees}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <DollarSign size={20} className="text-blue-600" />
                    <span className="font-semibold text-slate-900">Gross Payroll</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">${reportData.grossPayroll.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <DollarSign size={20} className="text-red-600" />
                    <span className="font-semibold text-slate-900">Taxes & Deductions</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">-${(reportData.taxes + reportData.deductions).toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="font-semibold text-slate-900">Net Payroll</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">${reportData.netPayroll.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Detailed View */}
          {reportFormat === 'detailed' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Tax Breakdown</h3>
                <div className="space-y-3">
                  {reportData.breakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div>
                        <p className="font-semibold text-slate-900">{item.category}</p>
                        <p className="text-sm text-slate-600">{item.percentage}% of gross</p>
                      </div>
                      <p className="text-lg font-bold text-slate-900">${item.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-slate-600 mb-2">Total Deductions</p>
                <p className="text-2xl font-bold text-blue-600">${(reportData.taxes + reportData.deductions).toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Department View */}
          {reportFormat === 'departments' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Payroll by Department</h3>
              {reportData.departments.map((dept, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-slate-900">{dept.name}</h4>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {dept.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Employees</p>
                      <p className="text-xl font-bold text-slate-900">{dept.employees}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Payroll</p>
                      <p className="text-xl font-bold text-blue-600">${dept.payroll.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Generated: {reportData.processedDate}
          </p>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
            >
              <Printer size={18} />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />
              Download
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PayrollReportModal;
