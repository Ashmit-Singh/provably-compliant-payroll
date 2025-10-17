import React from 'react';

const Card = ({ title, value, icon, subtext, className = '' }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md border border-slate-200 ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      </div>
      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
        {icon}
      </div>
    </div>
  </div>
);

export default Card;