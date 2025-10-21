import React, { memo } from 'react';

const PayrollHistoryCard = memo(({ payrollHistory }) => (
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
));

export default PayrollHistoryCard;
