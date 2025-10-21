import React, { memo } from 'react';

const QuickActionsCard = memo(() => (
  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
    <h3 className="font-semibold text-blue-800 mb-2">Quick Actions</h3>
    <ul className="text-sm text-blue-700 space-y-1">
      <li>• Run payroll for current period</li>
      <li>• Add new employee</li>
      <li>• View compliance reports</li>
      <li>• Check audit trail</li>
    </ul>
  </div>
));

export default QuickActionsCard;
