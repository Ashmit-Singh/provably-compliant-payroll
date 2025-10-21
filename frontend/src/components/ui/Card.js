import React, { memo } from 'react';

const Card = memo(({ title, value, icon, subtext }) => {
  // Ensure icon is properly rendered as a React element
  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return icon;
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
          {renderIcon()}
        </div>
      </div>
    </div>
  );
});

export default Card;