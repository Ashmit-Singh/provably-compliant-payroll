import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', duration = 4000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-green-600 dark:text-green-400" />,
    error: <AlertCircle size={20} className="text-red-600 dark:text-red-400" />,
    info: <Info size={20} className="text-blue-600 dark:text-blue-400" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200 dark:bg-green-900 dark:bg-opacity-20 dark:border-green-700',
    error: 'bg-red-50 border-red-200 dark:bg-red-900 dark:bg-opacity-20 dark:border-red-700',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-900 dark:bg-opacity-20 dark:border-blue-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColors[type]} shadow-lg`}
      role="alert"
    >
      {icons[type]}
      <span className="flex-1 text-sm font-medium text-slate-900 dark:text-slate-50">{message}</span>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default Toast;
