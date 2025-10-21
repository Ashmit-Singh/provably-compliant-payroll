import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, Users, FileText, BarChart3, Lock, User } from 'lucide-react';

const CommandPalette = ({ isOpen, setIsOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const commands = [
    { id: 1, label: 'Run Payroll', description: 'Process payroll for employees', icon: Zap, action: () => navigate('/run-payroll') },
    { id: 2, label: 'Add Employee', description: 'Create a new employee record', icon: Users, action: () => navigate('/employees') },
    { id: 3, label: 'View Compliance', description: 'Check tax compliance rules', icon: FileText, action: () => navigate('/compliance') },
    { id: 4, label: 'Dashboard', description: 'Go to main dashboard', icon: BarChart3, action: () => navigate('/dashboard') },
    { id: 5, label: 'Audit Trail', description: 'View blockchain audit trail', icon: Lock, action: () => navigate('/audit-trail') },
    { id: 6, label: 'My Profile', description: 'View your profile', icon: User, action: () => navigate('/profile') },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery('');
      }
      if (event.key === 'Enter' && filteredCommands.length > 0) {
        filteredCommands[0].action();
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery, filteredCommands, setIsOpen]);

  if (!isOpen) return null;

  const handleCommandClick = (command) => {
    command.action();
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50"
      onClick={() => {
        setIsOpen(false);
        setSearchQuery('');
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Type a command or search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-lg outline-none text-slate-900 placeholder-slate-500"
              autoFocus
            />
            <span className="text-xs text-slate-500 font-mono">ESC</span>
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length > 0 ? (
            <div className="p-2">
              {filteredCommands.map((command, index) => {
                const Icon = command.icon;
                return (
                  <button
                    key={command.id}
                    onClick={() => handleCommandClick(command)}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-3 mb-1 group"
                  >
                    <Icon size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm">{command.label}</p>
                      <p className="text-xs text-slate-500">{command.description}</p>
                    </div>
                    {index === 0 && <span className="text-xs text-slate-400 font-mono">⏎</span>}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-slate-500 text-sm">No commands found for "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex gap-2">
            <span className="font-mono">↑↓</span>
            <span>Navigate</span>
          </div>
          <div className="flex gap-2">
            <span className="font-mono">⏎</span>
            <span>Select</span>
          </div>
          <div className="flex gap-2">
            <span className="font-mono">ESC</span>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;