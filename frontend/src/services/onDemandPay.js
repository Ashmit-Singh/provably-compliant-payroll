// onDemandPay.js
// On-demand pay functionality for early wage access

import { processPayroll } from './payrollProcessor';

/**
 * Calculate available early wage access for an employee
 * @param {Object} employee { id, salary, hoursWorked, payPeriodHours }
 * @returns {number} Available amount
 */
export function calculateEarlyAccess(employee) {
  // Example: Allow up to 50% of earned wages for the period
  const earned = (employee.salary / employee.payPeriodHours) * employee.hoursWorked;
  return Math.round(earned * 0.5);
}

/**
 * Process instant payment for early wage access
 * @param {Object} employee
 * @param {number} amount
 * @returns {Promise<Object>} Payment confirmation
 */
export async function processInstantPayment(employee, amount) {
  // Stub: Integrate with payment provider API
  return {
    employeeId: employee.id,
    amount,
    status: 'confirmed',
    fee: 0,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Maintain payroll compliance for early wage access
 * @param {Object} employee
 * @param {number} amount
 * @returns {Object} Compliance record
 */
export function recordEarlyAccessCompliance(employee, amount) {
  // Example: Log compliance event
  return {
    employeeId: employee.id,
    amount,
    compliant: true,
    details: 'Early wage access processed in compliance with payroll rules.',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Integrate with payroll calculations
 * @param {Array} employees
 * @returns {Promise<Array>} Updated payroll results
 */
export async function processPayrollWithEarlyAccess(employees) {
  // Adjust payroll for early access withdrawals
  const payrollResults = await processPayroll(employees);
  return payrollResults.map(result => {
    // Subtract any early access withdrawals from final payroll
    const earlyAccess = employees.find(e => e.id === result.employeeId)?.earlyAccessAmount || 0;
    return {
      ...result,
      finalPayroll: (result.fiatAmount || 0) - earlyAccess,
      earlyAccess,
    };
  });
}
