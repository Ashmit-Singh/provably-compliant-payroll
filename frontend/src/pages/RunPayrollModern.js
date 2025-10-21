import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, AlertCircle, Clock, DollarSign, Users, TrendingUp, Calendar } from 'lucide-react';
import StatsCard from '../components/ui/StatsCardModern';
import Modal from '../components/ui/ModalModern';
import PayrollReportModal from '../components/ui/PayrollReportModal';

const RunPayroll = memo(() => {
    const [isRunning, setIsRunning] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [payrollStatus, setPayrollStatus] = useState(null);
    const [isReportOpen, setIsReportOpen] = useState(false);

    const handleRunPayroll = async () => {
        setIsRunning(true);
        // Simulate payroll processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        setPayrollStatus('success');
        setIsRunning(false);
        setIsConfirmOpen(false);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-secondary-900 mb-2">Run Payroll</h1>
                <p className="text-secondary-600">Process payroll for your employees</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={<Users size={24} />}
                    label="Employees"
                    value="47"
                    color="blue"
                />
                <StatsCard
                    icon={<DollarSign size={24} />}
                    label="Total Payroll"
                    value="$285,000"
                    color="green"
                />
                <StatsCard
                    icon={<Calendar size={24} />}
                    label="Pay Period"
                    value="Oct 2025"
                    color="purple"
                />
                <StatsCard
                    icon={<TrendingUp size={24} />}
                    label="Status"
                    value="Ready"
                    color="orange"
                />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Payroll Summary */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-secondary-200 p-6">
                    <h2 className="text-2xl font-bold text-secondary-900 mb-6">Payroll Summary</h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                            <div>
                                <p className="font-semibold text-secondary-900">Gross Payroll</p>
                                <p className="text-sm text-secondary-600">Total employee compensation</p>
                            </div>
                            <p className="text-2xl font-bold text-primary-600">$285,000</p>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                            <div>
                                <p className="font-semibold text-secondary-900">Taxes & Deductions</p>
                                <p className="text-sm text-secondary-600">Federal, state, and local taxes</p>
                            </div>
                            <p className="text-2xl font-bold text-danger-600">-$68,400</p>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-success-50 to-success-100 rounded-lg border border-success-200">
                            <div>
                                <p className="font-semibold text-secondary-900">Net Payroll</p>
                                <p className="text-sm text-secondary-600">Amount to be distributed</p>
                            </div>
                            <p className="text-2xl font-bold text-success-600">$216,600</p>
                        </div>
                    </div>

                    {/* Compliance Check */}
                    <div className="mt-6 p-4 bg-info-50 border border-info-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <CheckCircle size={20} className="text-info-600 flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold text-secondary-900">Compliance Check</p>
                                <p className="text-sm text-secondary-600 mt-1">All tax rules verified and applied correctly</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Panel */}
                <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-6 flex flex-col">
                    <h3 className="text-xl font-bold text-secondary-900 mb-6">Ready to Process?</h3>

                    {payrollStatus === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col items-center justify-center text-center mb-6"
                        >
                            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle size={32} className="text-success-600" />
                            </div>
                            <p className="text-lg font-bold text-secondary-900">Payroll Processed!</p>
                            <p className="text-sm text-secondary-600 mt-2">Successfully processed for 47 employees</p>
                        </motion.div>
                    )}

                    <div className="space-y-3 mt-auto">
                        <button
                            onClick={() => setIsConfirmOpen(true)}
                            disabled={isRunning || payrollStatus === 'success'}
                            className="w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isRunning ? (
                                <>
                                    <Clock size={18} className="animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Play size={18} />
                                    Run Payroll
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => setIsReportOpen(true)}
                            className="w-full px-4 py-2 bg-secondary-100 text-secondary-900 rounded-lg font-semibold hover:bg-secondary-200 transition-colors"
                        >
                            Preview Report
                        </button>
                    </div>

                    <p className="text-xs text-secondary-500 text-center mt-4">
                        This action will process payroll for all active employees
                    </p>
                </div>
            </div>

            {/* Confirmation Modal */}
            <Modal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="Confirm Payroll Run"
                variant="warning"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-secondary-700">
                        You are about to process payroll for <span className="font-bold">47 employees</span> with a total of <span className="font-bold">$285,000</span>.
                    </p>
                    <p className="text-secondary-600 text-sm">
                        This action cannot be undone. Make sure all employee information is correct before proceeding.
                    </p>
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleRunPayroll}
                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                        >
                            Confirm & Process
                        </button>
                        <button
                            onClick={() => setIsConfirmOpen(false)}
                            className="flex-1 px-4 py-2 bg-secondary-100 text-secondary-900 rounded-lg font-semibold hover:bg-secondary-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Payroll Report Modal */}
            <PayrollReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
            />
        </div>
    );
});

RunPayroll.displayName = 'RunPayroll';

export default RunPayroll;
