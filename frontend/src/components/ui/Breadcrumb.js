import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-6" aria-label="Breadcrumb">
      <Link 
        to="/" 
        className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        aria-label="Home"
      >
        <Home size={16} />
        <span>Home</span>
      </Link>
      {items?.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight size={16} className="text-slate-400 dark:text-slate-600" />
          {item.href ? (
            <Link 
              to={item.href} 
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 dark:text-slate-50 font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
