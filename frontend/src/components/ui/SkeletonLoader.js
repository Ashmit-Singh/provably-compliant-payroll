import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ 
  variant = 'text', 
  width = '100%', 
  height = '1rem', 
  className = '',
  animate = true,
  count = 1
}) => {
  const baseClasses = 'bg-slate-200 rounded';
  const animationClasses = animate ? 'animate-pulse' : '';

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4';
      case 'title':
        return 'h-6';
      case 'subtitle':
        return 'h-5';
      case 'avatar':
        return 'rounded-full';
      case 'button':
        return 'h-10 rounded-lg';
      case 'card':
        return 'h-32 rounded-lg';
      case 'table':
        return 'h-12 rounded';
      case 'circle':
        return 'rounded-full';
      case 'rect':
        return 'rounded';
      default:
        return 'h-4';
    }
  };

  const skeletonElement = (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${animationClasses} ${className}`}
      style={{ width, height }}
    />
  );

  if (count === 1) {
    return skeletonElement;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          {skeletonElement}
        </motion.div>
      ))}
    </div>
  );
};

// Predefined skeleton components for common use cases
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white p-6 rounded-lg shadow border border-slate-200 ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <SkeletonLoader variant="avatar" width="40px" height="40px" />
      <div className="flex-1">
        <SkeletonLoader variant="title" width="60%" className="mb-2" />
        <SkeletonLoader variant="text" width="40%" />
      </div>
    </div>
    <div className="space-y-2">
      <SkeletonLoader variant="text" width="100%" />
      <SkeletonLoader variant="text" width="80%" />
      <SkeletonLoader variant="text" width="60%" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`bg-white rounded-lg shadow border border-slate-200 overflow-hidden ${className}`}>
    {/* Header */}
    <div className="bg-slate-50 p-4 border-b border-slate-200">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }, (_, index) => (
          <SkeletonLoader key={index} variant="text" width="80%" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    <div className="divide-y divide-slate-200">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }, (_, colIndex) => (
              <SkeletonLoader key={colIndex} variant="text" width="90%" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonList = ({ items = 5, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items }, (_, index) => (
      <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
        <SkeletonLoader variant="circle" width="40px" height="40px" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader variant="text" width="60%" />
          <SkeletonLoader variant="text" width="40%" />
        </div>
        <SkeletonLoader variant="button" width="80px" height="32px" />
      </div>
    ))}
  </div>
);

export const SkeletonStats = ({ className = '' }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
    {Array.from({ length: 4 }, (_, index) => (
      <div key={index} className="bg-white p-4 rounded-lg shadow border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <SkeletonLoader variant="circle" width="40px" height="40px" />
          <SkeletonLoader variant="text" width="60%" height="1rem" />
        </div>
        <SkeletonLoader variant="title" width="80%" className="mb-1" />
        <SkeletonLoader variant="text" width="50%" />
      </div>
    ))}
  </div>
);

export const SkeletonForm = ({ fields = 4, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: fields }, (_, index) => (
      <div key={index} className="space-y-2">
        <SkeletonLoader variant="text" width="30%" height="1rem" />
        <SkeletonLoader variant="button" width="100%" height="40px" />
      </div>
    ))}
    <div className="flex justify-end gap-3 pt-4">
      <SkeletonLoader variant="button" width="80px" height="40px" />
      <SkeletonLoader variant="button" width="100px" height="40px" />
    </div>
  </div>
);

export default SkeletonLoader;
