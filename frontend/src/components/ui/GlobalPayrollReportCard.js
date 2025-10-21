import React, { memo } from 'react';

const GlobalPayrollReportCard = memo(({ report }) => (
  <div className="bg-white rounded-lg shadow p-6 mt-8">
    <h2 className="text-xl font-bold mb-4">Global Payroll Report</h2>
    <div className="mb-2"><strong>Total Net Payroll:</strong> {report.totalNet.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</div>
    <div className="mb-4">
      <strong>By Country:</strong>
      <ul className="list-disc ml-6">
        {Object.entries(report.byCountry).map(([country, data]) => (
          <li key={country}>{country}: {data.total.toLocaleString(undefined, { style: 'currency', currency: 'USD' })} ({data.count} employees)</li>
        ))}
      </ul>
    </div>
    <div>
      <strong>Payrolls:</strong>
      <ul className="list-decimal ml-6">
        {report.payrolls.map((p, idx) => (
          <li key={idx}>{p.country} - {p.currency} {p.netSalary.toLocaleString(undefined, { style: 'currency', currency: p.currency })}</li>
        ))}
      </ul>
    </div>
  </div>
));

export default GlobalPayrollReportCard;
