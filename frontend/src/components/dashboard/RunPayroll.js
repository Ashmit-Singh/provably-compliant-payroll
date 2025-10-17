import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader } from 'lucide-react';

const RunPayroll = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [payPeriod, setPayPeriod] = useState('October 2025');
  
  const handleRunPayroll = async () => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    
    try {
      // Simulate API call to backend
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random failure (remove in production)
          if (Math.random() < 0.1) {
            reject(new Error('Blockchain network timeout. Please try again.'));
          } else {
            resolve();
          }
        }, 3000);
      });
      
      setIsSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const payPeriods = [
    'October 2025',
    'November 2025', 
    'December 2025',
    'January 2026',
    'February 2026'
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Execute Payroll Run</h2>
        <p className="text-slate-500 mb-6">
          Select the pay period and certify the transaction on the distributed ledger.
          This process will calculate salaries, deductions, and create an immutable record.
        </p>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="pay-period" className="block text-sm font-medium text-slate-700 mb-2">
              Pay Period *
            </label>
            <select 
              id="pay-period" 
              value={payPeriod}
              onChange={(e) => setPayPeriod(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              disabled={isLoading}
            >
              {payPeriods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Process Overview</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Calculate gross-to-net pay for all employees</li>
              <li>• Apply jurisdictional tax rules and deductions</li>
              <li>• Generate digital payslips and reports</li>
              <li>• Certify transaction on blockchain ledger</li>
              <li>• Process payments through banking API</li>
            </ul>
          </div>

          <button 
            onClick={handleRunPayroll} 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors duration-200 font-medium"
          >
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Processing Payroll...
              </>
            ) : (
              'Run Payroll & Certify on Ledger'
            )}
          </button>

          {isLoading && (
            <div className="text-center text-slate-600">
              <p>Certifying transaction on blockchain, please wait...</p>
              <p className="text-sm text-slate-500 mt-1">This may take a few moments</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 p-4 bg-red-100 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-semibold text-red-800">Processing Error</h4>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 text-sm font-medium mt-2"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 p-4 bg-green-100 border border-green-200 rounded-lg flex items-start gap-3"
          >
            <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-semibold text-green-800">Payroll Completed Successfully</h4>
              <p className="text-green-700 text-sm mt-1">
                Payroll for {payPeriod} has been processed and certified on the blockchain.
                All employees have been paid and transaction has been immutably recorded.
              </p>
              <div className="mt-3 text-xs text-green-600 space-y-1">
                <p>• Transaction Hash: 0x4a2b1c8d9e0f3a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b</p>
                <p>• Total Amount: $72,300</p>
                <p>• Employees Processed: 7</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RunPayroll;