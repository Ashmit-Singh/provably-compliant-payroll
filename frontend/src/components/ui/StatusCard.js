import React, { memo } from 'react';

const StatusCard = memo(({ title, value, icon, color = 'blue' }) => (
  <div className={`bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center border-t-4 border-${color}-500`}>
    {icon && <div className={`text-4xl mb-2 text-${color}-500`}>{icon}</div>}
    <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
    <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
  </div>
));

export default StatusCard;
