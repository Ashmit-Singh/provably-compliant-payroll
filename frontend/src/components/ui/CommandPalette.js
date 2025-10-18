import React, { useState, useEffect } from 'react';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Type a command or search..."
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
        <div className="p-2">
          <div className="text-sm text-gray-500 px-3 py-2">Quick Actions</div>
          <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
            Run Payroll
          </button>
          <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
            Add Employee
          </button>
          <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
            View Compliance
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;