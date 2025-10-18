import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from './contexts/LayoutContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import CommandPalette from './components/ui/CommandPalette';

const AppLayout = () => {
  const { setActivePage, isSidebarOpen, setIsSidebarOpen } = useLayout();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const location = useLocation(); // Add this hook to get current location

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans flex relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_10%_20%,_rgba(131,58,180,0.1)_0%,_rgba(253,29,29,0)_50%)]"></div>
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_90%_80%,_rgba(252,176,69,0.1)_0%,_rgba(253,29,29,0)_50%)]"></div>
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(0,169,255,0.05)_0%,_rgba(253,29,29,0)_50%)]"></div>
      </div>

      {/* Sidebar uses LayoutContext internally */}
      <Sidebar />

      <div className="flex-1 flex flex-col z-10 bg-slate-900/10">
        {/* Header uses LayoutContext internally for activePage, receives toggles */}
        <Header
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          onCommandPaletteToggle={() => setIsCommandPaletteOpen(true)}
        />

        {/* Main content area where routed pages will render */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* AnimatePresence for page transitions based on route changes */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Outlet renders the matched child route component */}
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        setIsOpen={setIsCommandPaletteOpen}
        setActivePage={setActivePage}
      />
    </div>
  );
};

export default AppLayout;