import React from 'react';
import { Bot } from 'lucide-react';
import { useLayout } from '../../contexts/LayoutContext';

const Sidebar = () => {
    const { navItems, activePage, setActivePage, isSidebarOpen, setIsSidebarOpen } = useLayout();

    const NavLink = ({ item }) => {
      const IconComponent = item.icon;
      
      return (
        <li
            key={item.name}
            onClick={() => {
                setActivePage(item.name);
                setIsSidebarOpen(false);
            }}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                activePage === item.name
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
            <IconComponent size={20} />
            <span className="font-medium text-sm">{item.name}</span>
        </li>
      );
    };

    return (
        <>
            {isSidebarOpen && (
              <div 
                onClick={() => setIsSidebarOpen(false)} 
                className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
              />
            )}

            <aside className={`fixed lg:relative inset-y-0 left-0 bg-white w-64 p-4 border-r border-slate-200 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
                <div className="flex items-center gap-2 pb-6 border-b border-slate-200 mb-6">
                    <Bot size={32} className="text-blue-600"/>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">CompliantPay</h1>
                        <p className="text-xs text-slate-500">Enterprise Payroll</p>
                    </div>
                </div>
                <nav className="flex-1">
                    <ul className="space-y-1">
                        {navItems.map(item => (
                          <NavLink key={item.name} item={item} />
                        ))}
                    </ul>
                </nav>
                 <div className="mt-auto pt-6 border-t border-slate-200">
                    <p className="text-xs text-center text-slate-400">Version 1.0.0</p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;