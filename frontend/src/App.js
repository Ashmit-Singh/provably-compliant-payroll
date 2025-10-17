import React, { useState } from 'react';
import { Home, Users, DollarSign, FileCheck2, Building, BrainCircuit, Link as LinkIcon } from 'lucide-react';

// Import Components
import Dashboard from './components/dashboard/Dashboard';
import EmployeeManagement from './components/dashboard/EmployeeManagement';
import RunPayroll from './components/dashboard/RunPayroll';
import ComplianceTaxEngine from './components/dashboard/ComplianceTaxEngine';
import PredictiveAnalytics from './components/dashboard/PredictiveAnalytics';
import BlockchainAuditTrail from './components/dashboard/BlockchainAuditTrail';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Navigation Items
const navItems = [
  { name: 'Dashboard', icon: Home },
  { name: 'Employee Management', icon: Users },
  { name: 'Run Payroll', icon: DollarSign },
  { name: 'Compliance & Tax Engine', icon: Building },
  { name: 'Predictive Analytics', icon: BrainCircuit },
  { name: 'Blockchain Audit Trail', icon: LinkIcon },
];

function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderPage = () => {
    try {
      switch (activePage) {
        case 'Dashboard': 
          return <Dashboard />;
        case 'Employee Management': 
          return <EmployeeManagement />;
        case 'Run Payroll': 
          return <RunPayroll />;
        case 'Compliance & Tax Engine': 
          return <ComplianceTaxEngine />;
        case 'Predictive Analytics': 
          return <PredictiveAnalytics />;
        case 'Blockchain Audit Trail': 
          return <BlockchainAuditTrail />;
        default: 
          return <Dashboard />;
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      return (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Error Loading Page</h2>
            <p className="text-red-600">There was an error loading the {activePage} page.</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <Sidebar 
        navItems={navItems}
        activePage={activePage}
        setActivePage={setActivePage}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <Header 
          activePage={activePage} 
          setIsSidebarOpen={setIsSidebarOpen}
        />
        
        {/* Page Content */}
        <div className="p-6 flex-1">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;