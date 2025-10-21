import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = memo(({ 
  items = [], 
  className = '',
  showHome = true,
  separator = 'chevron',
  maxItems = 5
}) => {
  const location = useLocation();

  // Auto-generate breadcrumbs from route if no items provided
  const generateBreadcrumbs = () => {
    if (items.length > 0) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    if (showHome) {
      breadcrumbs.push({
        label: 'Home',
        href: '/',
        icon: <Home size={16} />
      });
    }

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        href: isLast ? null : currentPath,
        isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();
  const displayItems = breadcrumbItems.length > maxItems 
    ? [
        ...breadcrumbItems.slice(0, 1),
        { label: '...', href: null, isEllipsis: true },
        ...breadcrumbItems.slice(-(maxItems - 2))
      ]
    : breadcrumbItems;

  const getSeparator = () => {
    switch (separator) {
      case 'slash':
        return <span className="text-slate-400">/</span>;
      case 'arrow':
        return <span className="text-slate-400">→</span>;
      case 'chevron':
      default:
        return <ChevronRight className="text-slate-400" size={16} />;
    }
  };

  if (breadcrumbItems.length <= 1 && !showHome) {
    return null;
  }

  return (
    <nav 
      className={`flex items-center space-x-1 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.isEllipsis;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="mx-2"
                >
                  {getSeparator()}
                </motion.span>
              )}

              {isEllipsis ? (
                <span className="text-slate-500 px-2">...</span>
              ) : item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-1 ${
                    isLast 
                      ? 'text-slate-900 font-medium' 
                      : 'text-slate-500'
                  }`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </motion.span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

// Breadcrumb item component for custom breadcrumbs
export const BreadcrumbItem = memo(({ 
  label, 
  href, 
  icon, 
  isActive = false,
  onClick,
  className = ''
}) => {
  const content = (
    <span className={`flex items-center gap-1 ${className}`}>
      {icon}
      <span>{label}</span>
    </span>
  );

  if (href && !isActive) {
    return (
      <Link
        to={href}
        className="text-slate-600 hover:text-slate-900 transition-colors"
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <span 
      className={`${
        isActive 
          ? 'text-slate-900 font-medium' 
          : 'text-slate-500'
      }`}
      onClick={onClick}
    >
      {content}
    </span>
  );
});

// Breadcrumb separator component
export const BreadcrumbSeparator = memo(({ type = 'chevron' }) => {
  switch (type) {
    case 'slash':
      return <span className="text-slate-400">/</span>;
    case 'arrow':
      return <span className="text-slate-400">→</span>;
    case 'chevron':
    default:
      return <ChevronRight className="text-slate-400" size={16} />;
  }
});

export default Breadcrumbs;
