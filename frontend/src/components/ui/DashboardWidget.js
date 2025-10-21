import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, X, Settings } from 'lucide-react';

const DashboardWidget = ({ 
  id, 
  title, 
  icon: Icon, 
  children, 
  onRemove, 
  isDragging,
  isEditing 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 shadow-sm hover:shadow-lg transition-all duration-200 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center gap-3">
          {isEditing && (
            <GripVertical size={20} className="text-secondary-400 cursor-grab active:cursor-grabbing" />
          )}
          {Icon && <Icon size={20} className="text-primary-600 dark:text-primary-400" />}
          <h3 className="font-semibold text-secondary-900 dark:text-secondary-50">{title}</h3>
        </div>
        
        {isHovered && isEditing && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onRemove(id)}
            className="p-1 hover:bg-danger-50 dark:hover:bg-danger-900 dark:hover:bg-opacity-20 rounded transition-colors"
            aria-label="Remove widget"
          >
            <X size={18} className="text-danger-600 dark:text-danger-400" />
          </motion.button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {children}
      </div>
    </motion.div>
  );
};

export default DashboardWidget;
