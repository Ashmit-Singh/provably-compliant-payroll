import React, { memo } from 'react';
import { TrendingUp } from 'lucide-react';

const StatsCard = memo(({ icon, label, value, color = 'blue', trend = null }) => {
  const colorClasses = {
    blue: 'from-primary-500 to-primary-600 bg-primary-50',
    green: 'from-success-500 to-success-600 bg-success-50',
    purple: 'from-info-500 to-info-600 bg-info-50',
    orange: 'from-warning-500 to-warning-600 bg-warning-50',
    red: 'from-danger-500 to-danger-600 bg-danger-50',
  };

  const [gradientFrom, gradientTo, bgColor] = colorClasses[color].split(' ');

  return (
    <div className={`relative overflow-hidden rounded-xl shadow-lg border border-secondary-200 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 ${bgColor}`}>
      {/* Background Gradient Accent */}
      <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-10 rounded-full blur-2xl`}></div>

      <div className="relative z-10">
        {/* Icon and Label */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-lg shadow-md`}>
            {React.cloneElement(icon, { className: 'text-white', size: 24 })}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${trend > 0 ? 'bg-success-100' : 'bg-danger-100'}`}>
              <TrendingUp size={14} className={trend > 0 ? 'text-success-600' : 'text-danger-600'} />
              <span className={`text-xs font-bold ${trend > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <div className="text-3xl font-bold text-secondary-900">{value}</div>
        </div>

        {/* Label */}
        <div className="text-sm font-medium text-secondary-600">{label}</div>
      </div>
    </div>
  );
});

StatsCard.displayName = 'StatsCard';

export default StatsCard;
