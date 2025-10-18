import React, { createContext, useContext, useState } from 'react';
import { Home, Users, DollarSign, Building, BrainCircuit, Link as LinkIcon } from 'lucide-react';

const LayoutContext = createContext();

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

const navItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'Employee Management', icon: Users },
    { name: 'Run Payroll', icon: DollarSign },
    { name: 'Compliance & Tax Engine', icon: Building },
    { name: 'Predictive Analytics', icon: BrainCircuit },
    { name: 'Blockchain Audit Trail', icon: LinkIcon },
];

export const LayoutProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('Dashboard');

  const value = {
    isSidebarOpen,
    setIsSidebarOpen,
    activePage,
    setActivePage,
    navItems
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};