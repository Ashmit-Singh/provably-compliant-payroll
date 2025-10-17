import React from 'react';
import { Menu, Bell, User, Settings } from 'lucide-react';

const Header = ({ activePage, setIsSidebarOpen }) => {
  return (
    <header className="bg-white p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="lg:hidden text-slate-600 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-semibold text-slate-800">{activePage}</h2>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <button className="p-2 text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors">
          <Settings size={20} />
        </button>
        
        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={16} className="text-blue-600" />
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:block">Admin User</span>
        </div>
      </div>
    </header>
  );
};

export default Header;