import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

// Notification Context
const NotificationContext = createContext();

// Notification reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return [...state, { ...action.payload, id: Date.now() + Math.random() }];
    case 'REMOVE_NOTIFICATION':
      return state.filter(notification => notification.id !== action.payload);
    case 'CLEAR_ALL':
      return [];
    default:
      return state;
  }
};

// Notification Provider
export const NotificationProvider = ({ children }) => {
  const [notifications, dispatch] = useReducer(notificationReducer, []);

  const addNotification = useCallback((notification) => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        duration: 5000,
        position: 'top-right',
        ...notification
      }
    });
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  // Convenience methods
  const success = useCallback((message, options = {}) => {
    addNotification({
      type: 'success',
      message,
      ...options
    });
  }, [addNotification]);

  const error = useCallback((message, options = {}) => {
    addNotification({
      type: 'error',
      message,
      duration: 8000, // Errors stay longer
      ...options
    });
  }, [addNotification]);

  const warning = useCallback((message, options = {}) => {
    addNotification({
      type: 'warning',
      message,
      ...options
    });
  }, [addNotification]);

  const info = useCallback((message, options = {}) => {
    addNotification({
      type: 'info',
      message,
      ...options
    });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Individual Notification Component
const Notification = ({ notification, onRemove }) => {
  const { id, type, title, message, duration, persistent = false } = notification;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'info':
        return <Info className="text-blue-500" size={20} />;
      default:
        return <Info className="text-slate-500" size={20} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-slate-800';
    }
  };

  // Auto-remove notification after duration
  React.useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, persistent, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`max-w-sm w-full ${getBackgroundColor()} border rounded-lg shadow-lg p-4`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`text-sm font-semibold ${getTextColor()} mb-1`}>
              {title}
            </h4>
          )}
          <p className={`text-sm ${getTextColor()} ${title ? '' : 'font-medium'}`}>
            {message}
          </p>
        </div>
        <button
          onClick={() => onRemove(id)}
          className={`flex-shrink-0 ml-2 ${getTextColor()} hover:opacity-70 transition-opacity`}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// Notification Container
const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  // Group notifications by position
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const position = notification.position || 'top-right';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(notification);
    return acc;
  }, {});

  const getPositionClasses = (position) => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Object.entries(groupedNotifications).map(([position, positionNotifications]) => (
        <div
          key={position}
          className={`absolute ${getPositionClasses(position)} space-y-2`}
        >
          <AnimatePresence>
            {positionNotifications.map((notification) => (
              <Notification
                key={notification.id}
                notification={notification}
                onRemove={removeNotification}
              />
            ))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

// Higher-order component for easy integration
export const withNotifications = (Component) => {
  return (props) => (
    <NotificationProvider>
      <Component {...props} />
    </NotificationProvider>
  );
};

const NotificationSystem = {
  NotificationProvider,
  useNotifications,
  withNotifications
};

export default NotificationSystem;
