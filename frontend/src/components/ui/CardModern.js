import React, { memo } from 'react';

const Card = memo(({ title, value, icon, subtext, color = 'blue', children, className = '' }) => {
  const colorClasses = {
    blue: 'from-primary-500 to-primary-600 bg-primary-50 border-primary-200',
    green: 'from-success-500 to-success-600 bg-success-50 border-success-200',
    purple: 'from-info-500 to-info-600 bg-info-50 border-info-200',
    orange: 'from-warning-500 to-warning-600 bg-warning-50 border-warning-200',
    red: 'from-danger-500 to-danger-600 bg-danger-50 border-danger-200',
  };

  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return icon;
    }
    return null;
  };

  // If children are provided, render as a container card
  if (children) {
    return (
      <div className={`bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}>
        {children}
      </div>
    );
  }

  // Otherwise render as a stat card
  const [gradientFrom, gradientTo, bgColor, borderColor] = colorClasses[color].split(' ');

  return (
    <div className={`relative overflow-hidden rounded-xl shadow-lg border ${borderColor} p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 ${bgColor}`}>
      {/* Background Gradient Accent */}
      <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-10 rounded-full blur-2xl`}></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-secondary-600 uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-secondary-900 mt-2">{value}</p>
            {subtext && <p className="text-xs text-secondary-500 mt-2">{subtext}</p>}
          </div>
          {icon && (
            <div className={`p-3 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-lg shadow-md ml-4`}>
              {React.cloneElement(renderIcon(), { className: 'text-white', size: 24 })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
