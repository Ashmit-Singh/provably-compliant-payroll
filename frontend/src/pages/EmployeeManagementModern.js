import React, { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Search, Filter, Download, Users, DollarSign, Building, 
    MapPin, Mail, Phone, Edit, Trash2, Eye, EyeOff, Loader, AlertCircle,
    ChevronDown, TrendingUp, Calendar
} from 'lucide-react';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../services/api';
import StatsCard from '../components/ui/StatsCardModern';
import Card from '../components/ui/CardModern';
import Modal from '../components/ui/ModalModern';

const EmployeeManagement = memo(() => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const data = await getEmployees();
            setEmployees(data);
            setFilteredEmployees(data);
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let filtered = employees;

        if (searchTerm) {
            filtered = filtered.filter(emp =>
                emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedDepartment !== 'All') {
            filtered = filtered.filter(emp => emp.department === selectedDepartment);
        }

        if (sortBy === 'name') {
            filtered.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
        } else if (sortBy === 'salary') {
            filtered.sort((a, b) => b.salary - a.salary);
        }

        setFilteredEmployees(filtered);
    }, [employees, searchTerm, selectedDepartment, sortBy]);

    const stats = useMemo(() => ({
        total: employees.length,
        active: employees.filter(e => e.status === 'active').length,
        avgSalary: employees.length > 0 ? Math.round(employees.reduce((sum, e) => sum + (e.salary || 0), 0) / employees.length) : 0,
        departments: new Set(employees.map(e => e.department)).size
    }), [employees]);

    const departments = useMemo(() => 
        ['All', ...new Set(employees.map(e => e.department))], 
        [employees]
    );

    const handleAddEmployee = async (formData) => {
        try {
            const newEmployee = await addEmployee(formData);
            setEmployees([...employees, newEmployee]);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to add employee:', error);
        }
    };

    const handleDeleteEmployee = async (id) => {
        try {
            await deleteEmployee(id);
            setEmployees(employees.filter(emp => emp.id !== id));
        } catch (error) {
            console.error('Failed to delete employee:', error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-secondary-900 mb-2">Employee Management</h1>
                <p className="text-secondary-600">Manage your workforce efficiently</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={<Users size={24} />}
                    label="Total Employees"
                    value={stats.total}
                    color="blue"
                    trend={5}
                />
                <StatsCard
                    icon={<TrendingUp size={24} />}
                    label="Active Employees"
                    value={stats.active}
                    color="green"
                    trend={8}
                />
                <StatsCard
                    icon={<DollarSign size={24} />}
                    label="Average Salary"
                    value={`$${stats.avgSalary.toLocaleString()}`}
                    color="purple"
                />
                <StatsCard
                    icon={<Building size={24} />}
                    label="Departments"
                    value={stats.departments}
                    color="orange"
                />
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Search */}
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-3 text-secondary-400" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    {/* Department Filter */}
                    <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="salary">Sort by Salary</option>
                    </select>

                    {/* Add Button */}
                    <button
                        onClick={() => {
                            setEditingEmployee(null);
                            setIsModalOpen(true);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={18} />
                        Add Employee
                    </button>
                </div>
            </div>

            {/* Employees Table */}
            <div className="bg-white rounded-xl shadow-lg border border-secondary-200 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader size={32} className="animate-spin text-primary-600" />
                    </div>
                ) : filteredEmployees.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12">
                        <AlertCircle size={48} className="text-secondary-400 mb-4" />
                        <p className="text-secondary-600 text-lg">No employees found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-secondary-50 to-secondary-100 border-b border-secondary-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Department</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Salary</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredEmployees.map((employee, index) => (
                                        <motion.tr
                                            key={employee.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-secondary-200 hover:bg-secondary-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-secondary-900">
                                                    {employee.firstName} {employee.lastName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-secondary-600">{employee.email}</td>
                                            <td className="px-6 py-4 text-secondary-600">{employee.department}</td>
                                            <td className="px-6 py-4 font-mono font-semibold text-secondary-900">
                                                ${employee.salary?.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    employee.status === 'active'
                                                        ? 'bg-success-100 text-success-700'
                                                        : 'bg-secondary-100 text-secondary-700'
                                                }`}>
                                                    {employee.status || 'active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingEmployee(employee);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEmployee(employee.id)}
                                                        className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                variant="default"
                size="lg"
            >
                <EmployeeForm
                    employee={editingEmployee}
                    onSubmit={handleAddEmployee}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
});

// Simple Employee Form Component
const EmployeeForm = ({ employee, onSubmit, onClose }) => {
    const [formData, setFormData] = useState(employee || {
        firstName: '',
        lastName: '',
        email: '',
        department: 'Engineering',
        salary: 0,
        status: 'active'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'salary' ? parseInt(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                />
            </div>
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
            />
            <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
                <option>Engineering</option>
                <option>Marketing</option>
                <option>Sales</option>
                <option>HR</option>
            </select>
            <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
            />
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                    {employee ? 'Update' : 'Add'} Employee
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 bg-secondary-100 text-secondary-900 rounded-lg font-semibold hover:bg-secondary-200 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

EmployeeManagement.displayName = 'EmployeeManagement';

export default EmployeeManagement;
