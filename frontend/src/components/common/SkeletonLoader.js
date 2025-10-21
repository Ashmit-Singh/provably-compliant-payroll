import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  const pulse = {
    animate: { opacity: [0.5, 1, 0.5] },
    transition: { duration: 1.5, repeat: Infinity },
  };

  if (type === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-slate-200 dark:bg-slate-700 rounded-lg h-24"
            {...pulse}
            aria-label="Loading"
          />
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-slate-200 dark:bg-slate-700 rounded-lg h-12"
            {...pulse}
            aria-label="Loading"
          />
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-slate-200 dark:bg-slate-700 rounded h-4 w-full"
            {...pulse}
            aria-label="Loading"
          />
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
