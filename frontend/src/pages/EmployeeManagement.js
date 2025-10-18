import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Loader, 
    AlertCircle, 
    Edit, 
    Trash2, 
    Search,
    Filter,
    Download,
    
    Users,
    DollarSign,
    Building,
    MapPin,
    Mail,
    Phone,
    
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    X,
    FileSpreadsheet,
    Eye,
    EyeOff
} from 'lucide-react';
import { 
    getEmployees, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee, 
    bulkDeleteEmployees,
    getEmployeeStats,
    exportEmployees,
    
    getDepartments,
    getJobRoles 
} from '../services/api';
import Modal from '../components/ui/Modal';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const EmployeeManagementPage = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);
    
    // Data states
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState(new Set());
    const [departments, setDepartments] = useState([]);
    const [jobRoles, setJobRoles] = useState([]);

    // Filter and search states
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [salaryRange, setSalaryRange] = useState({ min: '', max: '' });
    const [sortField, setSortField] = useState('firstName');
    const [sortDirection, setSortDirection] = useState('asc');
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const initialFormState = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        jobRole: '',
        salary: '',
        hireDate: '',
        location: 'USA - California',
        status: 'active',
        benefitPlan: 'Standard',
        emergencyContact: '',
        emergencyPhone: ''
    };

    const [formState, setFormState] = useState(initialFormState);
    

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                const [employeesData, statsData, deptsData, rolesData] = await Promise.all([
                    getEmployees(),
                    getEmployeeStats(),
                    getDepartments(),
                    getJobRoles()
                ]);
                
                setEmployees(employeesData);
                setFilteredEmployees(employeesData);
                setStats(statsData);
                setDepartments(deptsData);
                setJobRoles(rolesData);
            } catch (err) {
                setError(err.message || 'Failed to fetch data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Advanced filtering and sorting with useMemo for performance
    const filteredAndSortedEmployees = useMemo(() => {
        let filtered = [...employees];

        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(emp =>
                `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchLower) ||
                emp.email.toLowerCase().includes(searchLower) ||
                emp.department.toLowerCase().includes(searchLower) ||
                emp.jobRole.toLowerCase().includes(searchLower) ||
                emp.phone?.toLowerCase().includes(searchLower)
            );
        }

        // Department filter
        if (departmentFilter) {
            filtered = filtered.filter(emp => emp.department === departmentFilter);
        }

        // Location filter
        if (locationFilter) {
            filtered = filtered.filter(emp => emp.location === locationFilter);
        }

        // Status filter
        if (statusFilter) {
            filtered = filtered.filter(emp => emp.status === statusFilter);
        }

        // Salary range filter
        if (salaryRange.min) {
            filtered = filtered.filter(emp => emp.salary >= parseInt(salaryRange.min));
        }
        if (salaryRange.max) {
            filtered = filtered.filter(emp => emp.salary <= parseInt(salaryRange.max));
        }

        // Sorting
        filtered.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];

            // Handle nested properties
            if (sortField === 'name') {
                aValue = `${a.firstName} ${a.lastName}`;
                bValue = `${b.firstName} ${b.lastName}`;
            }

            // Convert to string for comparison if needed
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [employees, searchTerm, departmentFilter, locationFilter, statusFilter, salaryRange, sortField, sortDirection]);

    // Pagination
    const paginatedEmployees = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredAndSortedEmployees.slice(startIndex, endIndex);
    }, [filteredAndSortedEmployees, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredAndSortedEmployees.length / itemsPerPage);

    // Update filtered employees for backward compatibility
    useEffect(() => {
        setFilteredEmployees(filteredAndSortedEmployees);
    }, [filteredAndSortedEmployees]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleOpenAddModal = () => {
        setEditingEmployee(null);
        setFormState(initialFormState);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (employee) => {
        setEditingEmployee(employee);
        setFormState({ 
            ...initialFormState,
            ...employee,
            hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const handleOpenDeleteConfirm = (employee) => {
        setSelectedEmployee(employee);
        setIsDeleteConfirmOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEmployee) {
                const updated = await updateEmployee(editingEmployee.id, formState);
                setEmployees(employees.map(emp => (emp.id === editingEmployee.id ? updated : emp)));
            } else {
                const created = await addEmployee(formState);
                setEmployees([...employees, created]);
            }
            setIsModalOpen(false);
            // Refresh stats
            const statsData = await getEmployeeStats();
            setStats(statsData);
        } catch (err) {
            alert(err.message || `An error occurred while ${editingEmployee ? 'updating' : 'adding'} the employee.`);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedEmployee) return;
        try {
            await deleteEmployee(selectedEmployee.id);
            setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
            setIsDeleteConfirmOpen(false);
            setSelectedEmployee(null);
            // Refresh stats
            const statsData = await getEmployeeStats();
            setStats(statsData);
        } catch (err) {
            alert(err.message || "An error occurred while deleting the employee.");
        }
    };

    const toggleEmployeeSelection = (employeeId) => {
        setSelectedEmployees(prev => 
            prev.has(employeeId) 
                ? new Set([...prev].filter(id => id !== employeeId))
                : new Set([...prev, employeeId])
        );
    };

    const selectAllEmployees = () => {
        if (selectedEmployees.size === filteredEmployees.length) {
            setSelectedEmployees(new Set());
        } else {
            setSelectedEmployees(new Set(filteredEmployees.map(emp => emp.id)));
        }
    };

    const getUniqueValues = (key) => {
        return [...new Set(employees.map(emp => emp[key]).filter(Boolean))];
    };

    // Sorting handlers
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return <ArrowUpDown size={16} className="text-slate-400" />;
        return sortDirection === 'asc' ? 
            <ArrowUp size={16} className="text-blue-600" /> : 
            <ArrowDown size={16} className="text-blue-600" />;
    };

    // Bulk action handlers
    const handleBulkDelete = async () => {
        if (selectedEmployees.size === 0) return;
        try {
            await bulkDeleteEmployees(Array.from(selectedEmployees));
            setEmployees(employees.filter(emp => !selectedEmployees.has(emp.id)));
            setSelectedEmployees(new Set());
            setIsBulkDeleteConfirmOpen(false);
            // Refresh stats
            const statsData = await getEmployeeStats();
            setStats(statsData);
        } catch (err) {
            alert(err.message || "An error occurred while deleting employees.");
        }
    };

    const handleBulkExport = async () => {
        if (selectedEmployees.size === 0) return;
        try {
            const selectedEmps = employees.filter(emp => selectedEmployees.has(emp.id));
            const csvContent = [
                ['ID', 'First Name', 'Last Name', 'Email', 'Department', 'Salary'],
                ...selectedEmps.map(emp => [emp.id, emp.firstName, emp.lastName, emp.email, emp.department, emp.salary])
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `selected-employees-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert(err.message || "An error occurred while exporting employees.");
        }
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSearchTerm('');
        setDepartmentFilter('');
        setLocationFilter('');
        setStatusFilter('');
        setSalaryRange({ min: '', max: '' });
        setCurrentPage(1);
    };

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, departmentFilter, locationFilter, statusFilter, salaryRange]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-12">
                <Loader className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-4 p-8 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="text-red-500" size={48} />
                <h3 className="text-lg font-semibold text-red-700">Failed to Load Data</h3>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-6">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Employee Management</h1>
                        <p className="text-slate-600 mt-1">
                            Manage your workforce and employee data • {filteredAndSortedEmployees.length} of {employees.length} employees
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {/* Bulk Actions */}
                        {selectedEmployees.size > 0 && (
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                                <span className="text-sm text-blue-700 font-medium">
                                    {selectedEmployees.size} selected
                                </span>
                                <button
                                    onClick={handleBulkExport}
                                    className="flex items-center gap-1 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                                >
                                    <FileSpreadsheet size={12} />
                                    Export
                                </button>
                                <button
                                    onClick={() => setIsBulkDeleteConfirmOpen(true)}
                                    className="flex items-center gap-1 text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                                >
                                    <Trash2 size={12} />
                                    Delete
                                </button>
                                <button
                                    onClick={() => setSelectedEmployees(new Set())}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                        
                        {/* View Controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                                className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                                {viewMode === 'table' ? <Eye size={16} /> : <EyeOff size={16} />}
                                {viewMode === 'table' ? 'Grid' : 'Table'}
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <button 
                            onClick={() => exportEmployees()}
                            className="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            <Download size={16} />
                            Export All
                        </button>
                        
                        <button 
                            onClick={handleOpenAddModal}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={16} />
                            Add Employee
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-800">{stats.totalEmployees}</div>
                                <div className="text-sm text-slate-600">Total Employees</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <DollarSign className="text-green-600" size={20} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-800">${stats.totalPayroll?.toLocaleString()}</div>
                                <div className="text-sm text-slate-600">Monthly Payroll</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Building className="text-purple-600" size={20} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-800">{stats.departmentCount}</div>
                                <div className="text-sm text-slate-600">Departments</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <MapPin className="text-orange-600" size={20} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-800">{stats.locationCount}</div>
                                <div className="text-sm text-slate-600">Locations</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters and Search */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Filters & Search</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                        >
                            <Filter size={16} />
                            {showFilters ? 'Hide' : 'Show'} Advanced
                        </button>
                        <button
                            onClick={clearAllFilters}
                            className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
                        >
                            <X size={16} />
                            Clear All
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search employees by name, email, department, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Departments</option>
                        {getUniqueValues('department').map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Locations</option>
                        {getUniqueValues('location').map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="on-leave">On Leave</option>
                    </select>
                </div>

                {/* Advanced Filters */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-slate-200"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Min Salary</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 50000"
                                        value={salaryRange.min}
                                        onChange={(e) => setSalaryRange(prev => ({ ...prev, min: e.target.value }))}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Salary</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 100000"
                                        value={salaryRange.max}
                                        onChange={(e) => setSalaryRange(prev => ({ ...prev, max: e.target.value }))}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Items per page</label>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value={5}>5 per page</option>
                                        <option value={10}>10 per page</option>
                                        <option value={25}>25 per page</option>
                                        <option value={50}>50 per page</option>
                                        <option value={100}>100 per page</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={clearAllFilters}
                                        className="w-full bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Employees Table */}
            <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="w-12 p-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedEmployees.size === paginatedEmployees.length && paginatedEmployees.length > 0}
                                        onChange={selectAllEmployees}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th 
                                    className="p-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center gap-2">
                                        Employee
                                        {getSortIcon('name')}
                                    </div>
                                </th>
                                <th className="p-4 text-left text-sm font-semibold text-slate-700">Contact</th>
                                <th 
                                    className="p-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('department')}
                                >
                                    <div className="flex items-center gap-2">
                                        Department
                                        {getSortIcon('department')}
                                    </div>
                                </th>
                                <th 
                                    className="p-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('salary')}
                                >
                                    <div className="flex items-center gap-2">
                                        Salary
                                        {getSortIcon('salary')}
                                    </div>
                                </th>
                                <th 
                                    className="p-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('location')}
                                >
                                    <div className="flex items-center gap-2">
                                        Location
                                        {getSortIcon('location')}
                                    </div>
                                </th>
                                <th 
                                    className="p-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('status')}
                                >
                                    <div className="flex items-center gap-2">
                                        Status
                                        {getSortIcon('status')}
                                    </div>
                                </th>
                                <th className="p-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            <AnimatePresence>
                                {paginatedEmployees.map((emp) => (
                                    <motion.tr
                                        key={emp.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedEmployees.has(emp.id)}
                                                onChange={() => toggleEmployeeSelection(emp.id)}
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold text-sm">
                                                        {emp.firstName?.[0]}{emp.lastName?.[0]}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">
                                                        {emp.firstName} {emp.lastName}
                                                    </div>
                                                    <div className="text-sm text-slate-500">
                                                        {emp.jobRole}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Mail size={14} />
                                                    {emp.email}
                                                </div>
                                                {emp.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Phone size={14} />
                                                        {emp.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-slate-800">{emp.department}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-semibold text-slate-900">
                                                ${Number(emp.salary).toLocaleString()}
                                            </div>
                                            <div className="text-xs text-slate-500">annual</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <MapPin size={14} />
                                                {emp.location}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                emp.status === 'active' 
                                                    ? 'bg-green-100 text-green-800'
                                                    : emp.status === 'on-leave'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {emp.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => handleOpenEditModal(emp)}
                                                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenDeleteConfirm(emp)}
                                                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredAndSortedEmployees.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="mx-auto text-slate-300" size={48} />
                        <div className="mt-4 text-slate-500">No employees found</div>
                        {(searchTerm || departmentFilter || locationFilter || statusFilter || salaryRange.min || salaryRange.max) ? (
                            <button
                                onClick={clearAllFilters}
                                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                            >
                                Clear filters
                            </button>
                        ) : (
                            <button
                                onClick={handleOpenAddModal}
                                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                            >
                                Add your first employee
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {filteredAndSortedEmployees.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="text-sm text-slate-600">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedEmployees.length)} of {filteredAndSortedEmployees.length} employees
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-1 text-sm rounded ${
                                                currentPage === pageNum
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                {totalPages > 5 && (
                                    <>
                                        <span className="text-slate-400">...</span>
                                        <button
                                            onClick={() => setCurrentPage(totalPages)}
                                            className={`px-3 py-1 text-sm rounded ${
                                                currentPage === totalPages
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Employee Modal */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingEmployee ? "Edit Employee" : "Add New Employee"}
                size="lg"
            >
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                            <input 
                                type="text" 
                                name="firstName" 
                                value={formState.firstName} 
                                onChange={handleInputChange} 
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                            <input 
                                type="text" 
                                name="lastName" 
                                value={formState.lastName} 
                                onChange={handleInputChange} 
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formState.email} 
                                onChange={handleInputChange} 
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                            <input 
                                type="tel" 
                                name="phone" 
                                value={formState.phone} 
                                onChange={handleInputChange} 
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                            <select 
                                name="department" 
                                value={formState.department} 
                                onChange={handleInputChange} 
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Job Role</label>
                            <select 
                                name="jobRole" 
                                value={formState.jobRole} 
                                onChange={handleInputChange} 
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Role</option>
                                {jobRoles.map(role => (
                                    <option key={role.id} value={role.title}>{role.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Annual Salary ($)</label>
                            <input 
                                type="number" 
                                name="salary" 
                                value={formState.salary} 
                                onChange={handleInputChange} 
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Hire Date</label>
                            <input 
                                type="date" 
                                name="hireDate" 
                                value={formState.hireDate} 
                                onChange={handleInputChange} 
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                            <select 
                                name="location" 
                                value={formState.location} 
                                onChange={handleInputChange} 
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="USA - California">USA - California</option>
                                <option value="Canada - Ontario">Canada - Ontario</option>
                                <option value="India - Tamil Nadu">India - Tamil Nadu</option>
                                <option value="UK - England">UK - England</option>
                                <option value="Germany - Federal">Germany - Federal</option>
                                <option value="Australia - NSW">Australia - NSW</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select 
                                name="status" 
                                value={formState.status} 
                                onChange={handleInputChange} 
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="on-leave">On Leave</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Benefit Plan</label>
                        <input 
                            type="text" 
                            name="benefitPlan" 
                            value={formState.benefitPlan} 
                            onChange={handleInputChange} 
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)} 
                            className="px-4 py-2 bg-slate-200 rounded-md text-slate-700 hover:bg-slate-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            {editingEmployee ? "Update Employee" : "Add Employee"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Employee"
                message={`Are you sure you want to delete ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}? This action cannot be undone.`}
                confirmText="Delete"
                confirmVariant="danger"
            />

            {/* Bulk Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isBulkDeleteConfirmOpen}
                onClose={() => setIsBulkDeleteConfirmOpen(false)}
                onConfirm={handleBulkDelete}
                title="Delete Multiple Employees"
                message={`Are you sure you want to delete ${selectedEmployees.size} selected employees? This action cannot be undone.`}
                confirmText="Delete All"
                confirmVariant="danger"
            />
        </div>
    );
};

export default EmployeeManagementPage;