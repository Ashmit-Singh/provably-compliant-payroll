import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import Modal from '../ui/Modal';
import { useEmployees } from '../../hooks/useEmployees';
import { validateEmployee } from '../../utils/validators';

const EmployeeManagement = () => {
  const {
    employees,
    searchTerm,
    setSearchTerm,
    filterDepartment,
    setFilterDepartment,
    departments,
    addEmployee
  } = useEmployees();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ 
    name: '', 
    department: '', 
    salary: '', 
    plan: '',
    location: 'USA - California'
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateEmployee(newEmployee);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    addEmployee(newEmployee);
    setIsModalOpen(false);
    setNewEmployee({ 
      name: '', 
      department: '', 
      salary: '', 
      plan: '',
      location: 'USA - California'
    });
    setErrors({});
  };

  const handleReset = () => {
    setNewEmployee({ 
      name: '', 
      department: '', 
      salary: '', 
      plan: '',
      location: 'USA - California'
    });
    setErrors({});
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Employee Roster</h2>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add New Employee
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search employees by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <Filter className="text-slate-400" size={20} />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">Employee ID</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Name</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Department</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Annual Salary</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Benefit Plan</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Location</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-slate-50 transition-colors">
                <td className="p-4 text-slate-800 font-mono text-sm">{emp.id}</td>
                <td className="p-4 font-medium text-slate-900">{emp.name}</td>
                <td className="p-4 text-slate-800">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {emp.department}
                  </span>
                </td>
                <td className="p-4 text-slate-800">
                  ${parseInt(emp.salary).toLocaleString()}
                </td>
                <td className="p-4 text-slate-800">{emp.plan}</td>
                <td className="p-4 text-slate-800 text-sm">{emp.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {employees.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No employees found matching your criteria.
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleReset}
        title="Add New Employee"
        size="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name *
            </label>
            <input 
              type="text" 
              name="name" 
              value={newEmployee.name} 
              onChange={handleInputChange}
              placeholder="Enter full name"
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Department *
            </label>
            <select 
              name="department" 
              value={newEmployee.department} 
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.department ? 'border-red-500' : 'border-slate-300'
              }`}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
            {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Annual Salary *
            </label>
            <input 
              type="number" 
              name="salary" 
              value={newEmployee.salary} 
              onChange={handleInputChange}
              placeholder="Enter annual salary"
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.salary ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Benefit Plan *
            </label>
            <input 
              type="text" 
              name="plan" 
              value={newEmployee.plan} 
              onChange={handleInputChange}
              placeholder="Enter benefit plan"
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.plan ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.plan && <p className="text-red-500 text-xs mt-1">{errors.plan}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Location
            </label>
            <select 
              name="location" 
              value={newEmployee.location} 
              onChange={handleInputChange}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="USA - California">USA - California</option>
              <option value="Canada - Ontario">Canada - Ontario</option>
              <option value="India - Tamil Nadu">India - Tamil Nadu</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={handleReset}
              className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Employee
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;