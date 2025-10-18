import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Users, 
        Shield,
  Download,
  Eye,
    RefreshCw,
  Clock,
  TrendingUp,
  BarChart3,
    
  X,
  Check,
  Filter,
  Search,
    
  Building,
  MapPin
} from 'lucide-react';
import { runPayroll, getEmployees, getPayrollHistory, downloadPayrollReport } from '../services/api';

const RunPayrollPage = () => {
    // isLoading only used for UI; no setter required here
    const [isLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [payPeriod, setPayPeriod] = useState('');
    const [payDate, setPayDate] = useState('');
    // employeeIds removed (unused) — use selectedEmployees instead
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [payrollResult, setPayrollResult] = useState(null);
    const [payrollHistory, setPayrollHistory] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    
    // Enhanced state for real-time updates
    const [payrollStatus, setPayrollStatus] = useState('idle'); // 'idle', 'preparing', 'processing', 'completed', 'failed'
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');
    const [processingSteps, setProcessingSteps] = useState([]);
    const [isPolling, setIsPolling] = useState(false);
    // pollingInterval ref removed (unused)
    
    // Filter and search states
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    
    // Analytics states
    const [payrollAnalytics, setPayrollAnalytics] = useState(null);
    const [showAnalytics, setShowAnalytics] = useState(false);

    // Calculate payroll analytics
    const calculatePayrollAnalytics = useCallback((empData) => {
        const totalSalary = empData.reduce((sum, emp) => sum + (emp.salary || 0), 0);
        const avgSalary = empData.length ? totalSalary / empData.length : 0;
        const departmentBreakdown = empData.reduce((acc, emp) => {
            acc[emp.department] = (acc[emp.department] || 0) + (emp.salary || 0);
            return acc;
        }, {});

        setPayrollAnalytics({
            totalSalary,
            avgSalary,
            employeeCount: empData.length,
            departmentBreakdown,
            locationBreakdown: empData.reduce((acc, emp) => {
                acc[emp.location] = (acc[emp.location] || 0) + 1;
                return acc;
            }, {})
        });
    }, []);

    // Fetch employees and payroll history on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const employeesData = await getEmployees();
                setEmployees(employeesData);
                setSelectedEmployees(employeesData.map(emp => emp.id));

                const history = await getPayrollHistory();
                setPayrollHistory(history.slice(0, 5)); // Show last 5 runs

                // Set default pay period to current month
                const now = new Date();
                setPayPeriod(now.toLocaleString('default', { month: 'long', year: 'numeric' }));
                setPayDate(now.toISOString().split('T')[0]);

                // Calculate analytics
                calculatePayrollAnalytics(employeesData);
            } catch (err) {
                setError("Failed to load initial data.");
                console.error(err);
            }
        };
        fetchData();
    }, [calculatePayrollAnalytics]);

    // Real-time polling for payroll status
    // Keep a ref for progress to avoid stale closure inside setInterval
    const progressRef = React.useRef(progress);
    React.useEffect(() => { progressRef.current = progress; }, [progress]);

    useEffect(() => {
        if (!isPolling || payrollStatus !== 'processing') return undefined;

        const interval = setInterval(() => {
            try {
                // Simulate progress updates
                setProgress(prev => {
                    const newProgress = Math.min(prev + Math.random() * 15, 95);
                    if (newProgress >= 95) {
                        setPayrollStatus('completed');
                        setIsPolling(false);
                        clearInterval(interval);
                    }
                    return newProgress;
                });

                // Update status message using latest progress from ref
                const messages = [
                    'Validating employee data...',
                    'Calculating taxes and deductions...',
                    'Generating payroll reports...',
                    'Submitting to blockchain...',
                    'Finalizing transactions...'
                ];
                const stepIndex = Math.floor((progressRef.current / 100) * messages.length);
                setStatusMessage(messages[stepIndex] || 'Processing...');

            } catch (err) {
                console.error('Polling error:', err);
            }
        }, 1000);

    // pollingInterval state removed; nothing to set here
        return () => clearInterval(interval);
    }, [isPolling, payrollStatus]);

    // calculatePayrollAnalytics defined earlier

    // Filtered employees for display
    const filteredEmployees = useMemo(() => {
        let filtered = employees;
        
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(emp =>
                `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchLower) ||
                emp.email.toLowerCase().includes(searchLower) ||
                emp.department.toLowerCase().includes(searchLower)
            );
        }
        
        if (departmentFilter) {
            filtered = filtered.filter(emp => emp.department === departmentFilter);
        }
        
        if (locationFilter) {
            filtered = filtered.filter(emp => emp.location === locationFilter);
        }
        
        return filtered;
    }, [employees, searchTerm, departmentFilter, locationFilter]);

    const handleRunPayroll = async () => {
        if (selectedEmployees.length === 0) {
            setError("No employees selected for payroll.");
            return;
        }

        if (!payPeriod || !payDate) {
            setError("Please select pay period and pay date.");
            return;
        }

        setError(null);
        setIsSuccess(false);
        setPayrollResult(null);
        
        // Start real-time processing simulation
        setPayrollStatus('preparing');
        setProgress(0);
        setStatusMessage('Preparing payroll data...');
        setProcessingSteps([
            { step: 'Validation', status: 'pending', timestamp: new Date() },
            { step: 'Tax Calculation', status: 'pending', timestamp: new Date() },
            { step: 'Report Generation', status: 'pending', timestamp: new Date() },
            { step: 'Blockchain Submission', status: 'pending', timestamp: new Date() },
            { step: 'Finalization', status: 'pending', timestamp: new Date() }
        ]);

        try {
            // Simulate preparation phase
            await new Promise(resolve => setTimeout(resolve, 2000));
            setPayrollStatus('processing');
            setIsPolling(true);
            
            // Start the actual payroll run
            const result = await runPayroll({
                payPeriod,
                payDate,
                employeeIds: selectedEmployees,
                description: `Payroll for ${payPeriod}`
            });
            
            // Complete the process
            setProgress(100);
            setStatusMessage('Payroll completed successfully!');
            setPayrollStatus('completed');
            setIsPolling(false);
            setPayrollResult(result);
            setIsSuccess(true);
            
            // Update processing steps
            setProcessingSteps(prev => prev.map(step => ({ ...step, status: 'completed' })));
            
            // Refresh history
            const history = await getPayrollHistory();
            setPayrollHistory(history.slice(0, 5));
            
        } catch (err) {
            setPayrollStatus('failed');
            setIsPolling(false);
            setError(err.message || 'An unknown error occurred during the payroll run.');
            setProcessingSteps(prev => prev.map(step => ({ ...step, status: 'failed' })));
        }
    };

    const handlePreview = () => {
        const selectedEmps = employees.filter(emp => selectedEmployees.includes(emp.id));
        const totalAmount = selectedEmps.reduce((sum, emp) => sum + (emp.salary || 0), 0);
        
        setPreviewData({
            employeeCount: selectedEmps.length,
            totalAmount,
            employees: selectedEmps,
            payPeriod,
            payDate
        });
        setShowPreview(true);
    };

    const handleDownloadReport = async () => {
        if (!payrollResult) return;
        
        try {
            const report = await downloadPayrollReport(payrollResult.id);
            // Create download link
            const url = window.URL.createObjectURL(new Blob([report]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `payroll-report-${payPeriod}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError("Failed to download payroll report.");
        }
    };

    const toggleEmployeeSelection = (employeeId) => {
        setSelectedEmployees(prev => 
            prev.includes(employeeId) 
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    const selectAllEmployees = () => {
        setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    };

    const deselectAllEmployees = () => {
        setSelectedEmployees([]);
    };

    // selectEmployeesByDepartment removed (unused)

    const clearAllFilters = () => {
        setSearchTerm('');
        setDepartmentFilter('');
        setLocationFilter('');
    };

    const getUniqueValues = (key) => {
        return [...new Set(employees.map(emp => emp[key]).filter(Boolean))];
    };

    const payPeriods = [
        'January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025', 'June 2025',
        'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025',
        'January 2026', 'February 2026', 'March 2026'
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-6">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Run Payroll</h1>
                        <p className="text-slate-600">
                            Process payroll and certify transactions on the distributed ledger
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowAnalytics(!showAnalytics)}
                            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            <BarChart3 size={16} />
                            {showAnalytics ? 'Hide' : 'Show'} Analytics
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Analytics Panel */}
            <AnimatePresence>
                {showAnalytics && payrollAnalytics && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white p-6 rounded-lg shadow-md border border-slate-200"
                    >
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Payroll Analytics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <DollarSign className="text-blue-600" size={20} />
                                    <span className="font-semibold text-blue-800">Total Payroll</span>
                                </div>
                                <div className="text-2xl font-bold text-blue-900">
                                    ${payrollAnalytics.totalSalary.toLocaleString()}
                                </div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="text-green-600" size={20} />
                                    <span className="font-semibold text-green-800">Employees</span>
                                </div>
                                <div className="text-2xl font-bold text-green-900">
                                    {payrollAnalytics.employeeCount}
                                </div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="text-purple-600" size={20} />
                                    <span className="font-semibold text-purple-800">Avg Salary</span>
                                </div>
                                <div className="text-2xl font-bold text-purple-900">
                                    ${Math.round(payrollAnalytics.avgSalary).toLocaleString()}
                                </div>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Building className="text-orange-600" size={20} />
                                    <span className="font-semibold text-orange-800">Departments</span>
                                </div>
                                <div className="text-2xl font-bold text-orange-900">
                                    {Object.keys(payrollAnalytics.departmentBreakdown).length}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Payroll Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Configuration */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Pay Period
                            </label>
                            <select
                                value={payPeriod}
                                onChange={(e) => setPayPeriod(e.target.value)}
                                className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isLoading}
                            >
                                <option value="">Select pay period</option>
                                {payPeriods.map(period => (
                                    <option key={period} value={period}>{period}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Pay Date
                            </label>
                            <input
                                type="date"
                                value={payDate}
                                onChange={(e) => setPayDate(e.target.value)}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-slate-700">
                                    Employees ({selectedEmployees.length} selected)
                                </label>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-800"
                                    >
                                        <Filter size={12} />
                                        {showFilters ? 'Hide' : 'Show'} Filters
                                    </button>
                                    <button
                                        onClick={selectAllEmployees}
                                        className="text-xs text-blue-600 hover:text-blue-800"
                                    >
                                        Select All
                                    </button>
                                    <button
                                        onClick={deselectAllEmployees}
                                        className="text-xs text-red-600 hover:text-red-800"
                                    >
                                        Deselect All
                                    </button>
                                </div>
                            </div>

                            {/* Employee Filters */}
                            <AnimatePresence>
                                {showFilters && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div className="relative">
                                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" size={14} />
                                                <input
                                                    type="text"
                                                    placeholder="Search employees..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full pl-7 pr-3 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <select
                                                value={departmentFilter}
                                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                                className="text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">All Departments</option>
                                                {getUniqueValues('department').map(dept => (
                                                    <option key={dept} value={dept}>{dept}</option>
                                                ))}
                                            </select>
                                            <select
                                                value={locationFilter}
                                                onChange={(e) => setLocationFilter(e.target.value)}
                                                className="text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">All Locations</option>
                                                {getUniqueValues('location').map(loc => (
                                                    <option key={loc} value={loc}>{loc}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="text-xs text-slate-600">
                                                Showing {filteredEmployees.length} of {employees.length} employees
                                            </div>
                                            <button
                                                onClick={clearAllFilters}
                                                className="text-xs text-red-600 hover:text-red-800"
                                            >
                                                Clear Filters
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="max-h-60 overflow-y-auto border border-slate-300 rounded-lg p-2">
                                {filteredEmployees.map(employee => (
                                    <div key={employee.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded">
                                        <input
                                            type="checkbox"
                                            checked={selectedEmployees.includes(employee.id)}
                                            onChange={() => toggleEmployeeSelection(employee.id)}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">
                                                {employee.firstName} {employee.lastName}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {employee.department} • ${employee.salary?.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <MapPin size={10} />
                                                {employee.location}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {filteredEmployees.length === 0 && (
                                    <div className="text-center py-4 text-slate-500 text-sm">
                                        No employees found matching your filters
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Actions & Preview */}
                    <div className="space-y-4">
                        {/* Real-time Status Display */}
                        {(payrollStatus !== 'idle') && (
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-slate-800">Payroll Status</h4>
                                    <div className="flex items-center gap-2">
                                        {payrollStatus === 'preparing' && <Clock className="text-blue-600" size={16} />}
                                        {payrollStatus === 'processing' && <Loader className="text-blue-600 animate-spin" size={16} />}
                                        {payrollStatus === 'completed' && <CheckCircle2 className="text-green-600" size={16} />}
                                        {payrollStatus === 'failed' && <AlertCircle className="text-red-600" size={16} />}
                                        <span className={`text-sm font-medium ${
                                            payrollStatus === 'completed' ? 'text-green-600' :
                                            payrollStatus === 'failed' ? 'text-red-600' :
                                            'text-blue-600'
                                        }`}>
                                            {payrollStatus.charAt(0).toUpperCase() + payrollStatus.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-500 ${
                                            payrollStatus === 'completed' ? 'bg-green-500' :
                                            payrollStatus === 'failed' ? 'bg-red-500' :
                                            'bg-blue-500'
                                        }`}
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                
                                <p className="text-sm text-slate-600 mb-3">{statusMessage}</p>
                                
                                {/* Processing Steps */}
                                {processingSteps.length > 0 && (
                                    <div className="space-y-2">
                                        {processingSteps.map((step, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm">
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                                    step.status === 'completed' ? 'bg-green-500 text-white' :
                                                    step.status === 'failed' ? 'bg-red-500 text-white' :
                                                    'bg-slate-300'
                                                }`}>
                                                    {step.status === 'completed' && <Check size={10} />}
                                                    {step.status === 'failed' && <X size={10} />}
                                                </div>
                                                <span className={step.status === 'completed' ? 'text-green-700' : 
                                                           step.status === 'failed' ? 'text-red-700' : 'text-slate-600'}>
                                                    {step.step}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex space-x-3">
                            <button
                                onClick={handlePreview}
                                disabled={isLoading || selectedEmployees.length === 0 || payrollStatus === 'processing'}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-600 text-white px-4 py-3 rounded-lg hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                            >
                                <Eye size={18} />
                                Preview
                            </button>
                            
                            <button
                                onClick={handleRunPayroll}
                                disabled={isLoading || selectedEmployees.length === 0 || payrollStatus === 'processing'}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {payrollStatus === 'processing' ? (
                                    <>
                                        <Loader size={18} className="animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <DollarSign size={18} />
                                        <span>Run Payroll</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Preview Modal */}
                        <AnimatePresence>
                            {showPreview && previewData && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                                    onClick={() => setShowPreview(false)}
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <h3 className="text-lg font-semibold mb-4">Payroll Preview</h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-slate-600">Pay Period</p>
                                                    <p className="font-medium">{previewData.payPeriod}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-600">Total Amount</p>
                                                    <p className="font-medium">${previewData.totalAmount.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-600">Employees</p>
                                                    <p className="font-medium">{previewData.employeeCount}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-600">Pay Date</p>
                                                    <p className="font-medium">{previewData.payDate}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-600 mb-2">Selected Employees</p>
                                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                                    {previewData.employees.map(emp => (
                                                        <div key={emp.id} className="flex justify-between text-sm p-2 bg-slate-50 rounded">
                                                            <span>{emp.firstName} {emp.lastName}</span>
                                                            <span>${emp.salary?.toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setShowPreview(false)}
                                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                                            >
                                                Confirm and Run Payroll
                                            </button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Results Section */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-start gap-3"
                                >
                                    <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
                                    <div className="flex-1">
                                        <h4 className="font-semibold">Processing Error</h4>
                                        <p className="text-sm mt-1">{error}</p>
                                    </div>
                                </motion.div>
                            )}

                            {isSuccess && payrollResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-4 bg-green-50 text-green-800 border border-green-200 rounded-lg"
                                >
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold">Payroll Completed Successfully</h4>
                                                <button
                                                    onClick={handleDownloadReport}
                                                    className="flex items-center gap-1 text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                                                >
                                                    <Download size={12} />
                                                    Report
                                                </button>
                                            </div>
                                            <p className="text-sm mt-1">
                                                Payroll for {payrollResult.payPeriod} has been processed and certified on the blockchain.
                                            </p>
                                            <div className="mt-3 text-xs font-mono text-green-700 space-y-2 bg-green-100 p-3 rounded">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div><strong>Status:</strong> {payrollResult.status}</div>
                                                    <div><strong>Total Amount:</strong> ${payrollResult.totalAmount?.toLocaleString()}</div>
                                                    <div><strong>Employees:</strong> {payrollResult.employeeCount}</div>
                                                    <div><strong>Date:</strong> {new Date(payrollResult.timestamp).toLocaleDateString()}</div>
                                                </div>
                                                {payrollResult.blockchainTxHash && (
                                                    <div>
                                                        <strong>Tx Hash:</strong> 
                                                        <p className="break-all mt-1">{payrollResult.blockchainTxHash}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Recent Payroll Runs */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Payroll Runs</h2>
                <div className="space-y-3">
                    {payrollHistory.map((run) => (
                        <div key={run.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Shield className="text-green-600" size={16} />
                                <div>
                                    <p className="font-medium text-slate-900">{run.payPeriod}</p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(run.timestamp).toLocaleDateString()} • {run.employeeCount} employees
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-slate-900">${run.totalAmount?.toLocaleString()}</p>
                                <p className="text-xs text-green-600 font-medium">{run.status}</p>
                            </div>
                        </div>
                    ))}
                    {payrollHistory.length === 0 && (
                        <p className="text-slate-500 text-center py-4">No payroll runs yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RunPayrollPage;