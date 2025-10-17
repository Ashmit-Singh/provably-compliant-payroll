import React from 'react';
import { Bot } from 'lucide-react';

const Sidebar = ({ navItems, activePage, setActivePage, isSidebarOpen, setIsSidebarOpen }) => {
  const NavLink = ({ item }) => (
    <li
      key={item.name}
      onClick={() => { 
        setActivePage(item.name); 
        setIsSidebarOpen(false); 
      }}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
        activePage === item.name
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
      }`}
    >
      <item.icon size={20} />
      <span className="font-medium">{item.name}</span>
    </li>
  );

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 bg-white w-64 p-4 border-r border-slate-200 z-30 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
        {/* Logo */}
        <div className="flex items-center gap-2 pb-6 border-b mb-6">
          <Bot size={32} className="text-blue-600"/>
          <div>
            <h1 className="text-xl font-bold text-slate-800">CompliantPay</h1>
            <p className="text-xs text-slate-500">Enterprise Payroll</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-1">
            {navItems.map(item => (
              <NavLink key={item.name} item={item} />
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="pt-6 border-t">
          <div className="text-xs text-slate-500 text-center">
            <p>v1.0.0</p>
            <p className="mt-1">Provably Compliant</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;