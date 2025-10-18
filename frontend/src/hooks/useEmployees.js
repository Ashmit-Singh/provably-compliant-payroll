import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { mockEmployees } from '../data/mockData';

export const useEmployees = () => {
  const [employees, setEmployees] = useLocalStorage('employees', mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const departments = [...new Set(employees.map(emp => emp.department))];

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterDepartment === '' || emp.department === filterDepartment)
  );

  const addEmployee = (employee) => {
    const newEmployee = {
      ...employee,
      id: `EMP00${employees.length + 1}`,
      salary: parseInt(employee.salary)
    };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const updateEmployee = (id, updatedData) => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === id ? { ...emp, ...updatedData } : emp
      )
    );
  };

  const deleteEmployee = (id) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  return {
    employees: filteredEmployees,
    allEmployees: employees,
    searchTerm,
    setSearchTerm,
    filterDepartment,
    setFilterDepartment,
    departments,
    addEmployee,
    updateEmployee,
    deleteEmployee
  };
};