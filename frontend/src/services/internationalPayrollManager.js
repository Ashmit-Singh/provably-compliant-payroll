// internationalPayrollManager.js
// International payroll manager for multi-country compliance

import axios from 'axios';

// Example: Supported countries and local tax rules (expand as needed)
const COUNTRY_TAX_RULES = {
  US: { taxRate: 0.22, currency: 'USD' },
  UK: { taxRate: 0.20, currency: 'GBP' },
  IN: { taxRate: 0.18, currency: 'INR' },
  DE: { taxRate: 0.25, currency: 'EUR' },
  AU: { taxRate: 0.19, currency: 'AUD' },
  // ...add 50+ countries
};

const FX_API = 'https://api.exchangerate.host/latest';

/**
 * Get currency conversion rates
 * @param {string} base Base currency
 * @returns {Promise<Object>} { rates: { [currency]: rate } }
 */
export async function fetchCurrencyRates(base = 'USD') {
  const response = await axios.get(`${FX_API}?base=${base}`);
  return response.data.rates;
}

/**
 * Calculate local payroll for an employee
 * @param {Object} employee { id, salaryUSD, country }
 * @param {Object} rates Currency rates
 * @returns {Object} { localSalary, currency, taxDue, netSalary }
 */
export function calculateLocalPayroll(employee, rates) {
  const rules = COUNTRY_TAX_RULES[employee.country] || { taxRate: 0.2, currency: 'USD' };
  const fxRate = rates[rules.currency] || 1;
  const localSalary = employee.salaryUSD * fxRate;
  const taxDue = localSalary * rules.taxRate;
  const netSalary = localSalary - taxDue;
  return {
    localSalary,
    currency: rules.currency,
    taxDue,
    netSalary,
    country: employee.country,
  };
}

/**
 * Optimize compensation structure across jurisdictions
 * @param {Array} employees
 * @param {Object} rates
 * @returns {Array} Array of optimized payrolls
 */
export function optimizeCompensation(employees, rates) {
  // Example: Minimize tax, maximize net salary
  return employees.map(emp => calculateLocalPayroll(emp, rates));
}

/**
 * Process cross-border payments
 * @param {Array} payrolls Array of payroll results
 * @returns {Promise<Array>} Payment confirmations
 */
export async function processCrossBorderPayments(payrolls) {
  // Stub: Integrate with payment provider APIs
  return payrolls.map(pay => ({
    employeeId: pay.id,
    amount: pay.netSalary,
    currency: pay.currency,
    status: 'confirmed',
  }));
}

/**
 * Generate consolidated global payroll report
 * @param {Array} payrolls
 * @returns {Object} Summary report
 */
export function generateGlobalReport(payrolls) {
  const totalNet = payrolls.reduce((sum, p) => sum + p.netSalary, 0);
  const byCountry = {};
  payrolls.forEach(p => {
    if (!byCountry[p.country]) byCountry[p.country] = { total: 0, count: 0 };
    byCountry[p.country].total += p.netSalary;
    byCountry[p.country].count += 1;
  });
  return {
    totalNet,
    byCountry,
    payrolls,
  };
}
