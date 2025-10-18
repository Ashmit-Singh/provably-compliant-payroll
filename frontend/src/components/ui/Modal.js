import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';

const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    size = 'md', 
    variant = 'default',
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    className = ''
}) => {
    const modalRef = useRef(null);
    const previousActiveElement = useRef(null);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (closeOnEscape && e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Store the previously focused element
            previousActiveElement.current = document.activeElement;
            // Focus the modal
            if (modalRef.current) {
                modalRef.current.focus();
            }
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            // Restore focus to the previously focused element
            if (previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        };
    }, [isOpen, closeOnEscape, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        full: 'max-w-full mx-4'
    };

    const variantClasses = {
        default: 'bg-white',
        success: 'bg-white border-l-4 border-green-500',
        warning: 'bg-white border-l-4 border-yellow-500',
        error: 'bg-white border-l-4 border-red-500',
        info: 'bg-white border-l-4 border-blue-500'
    };

    const getVariantIcon = () => {
        switch (variant) {
            case 'success':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'warning':
                return <AlertTriangle className="text-yellow-500" size={20} />;
            case 'error':
                return <AlertCircle className="text-red-500" size={20} />;
            case 'info':
                return <Info className="text-blue-500" size={20} />;
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={closeOnOverlayClick ? onClose : undefined}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <motion.div
                    ref={modalRef}
                    initial={{ scale: 0.9, y: -20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: -20, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`${variantClasses[variant]} ${sizeClasses[size]} w-full rounded-lg shadow-2xl z-50 focus:outline-none ${className}`}
                    onClick={(e) => e.stopPropagation()}
                    tabIndex={-1}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            {getVariantIcon()}
                            <h2 id="modal-title" className="text-xl font-semibold text-slate-800">
                                {title}
                            </h2>
                        </div>
                        {showCloseButton && (
                            <button 
                                onClick={onClose} 
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {children}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Modal;