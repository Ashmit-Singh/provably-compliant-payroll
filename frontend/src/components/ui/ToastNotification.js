import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const ToastNotification = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'info':
      default:
        return <Info size={20} className="text-blue-500" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 400, y: -20 }}
            animate={{ opacity: 1, x: 0, y: index * 80 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`mb-3 flex items-center gap-3 px-4 py-3 rounded-lg border pointer-events-auto shadow-lg ${getStyles(
              notification.type
            )}`}
          >
            {getIcon(notification.type)}
            <span className="font-medium text-sm flex-1">{notification.message}</span>
            <button
              onClick={() => removeNotification(notification.id)}
              className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotification;
