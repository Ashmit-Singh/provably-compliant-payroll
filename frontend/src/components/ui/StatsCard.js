import React, { memo } from 'react';

const StatsCard = memo(({ icon, label, value, color = 'blue' }) => (
  <div className={`bg-white p-4 rounded-lg shadow border border-slate-200 flex items-center gap-3`}> 
    <div className={`p-2 bg-${color}-100 rounded-lg`}>{icon}</div>
    <div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  </div>
));

export default StatsCard;
