import React, { memo } from 'react';

const WelcomeCard = memo(() => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold text-slate-800 mb-4">Welcome to Provably Compliant Payroll</h2>
    <p className="text-slate-600 mb-4">
      This is your dashboard. You can navigate to different sections using the sidebar.
    </p>
  </div>
));

export default WelcomeCard;
