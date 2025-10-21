import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from './Toast';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, duration = 4000) => addToast(message, 'success', duration), [addToast]);
  const error = useCallback((message, duration = 5000) => addToast(message, 'error', duration), [addToast]);
  const info = useCallback((message, duration = 4000) => addToast(message, 'info', duration), [addToast]);

  return { toasts, addToast, removeToast, success, error, info };
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
