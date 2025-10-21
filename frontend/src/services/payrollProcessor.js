// payrollProcessor.js
// Hybrid payroll processor for fiat and cryptocurrency payments

import axios from 'axios';



// Example: Exchange API endpoint (replace with real provider)
const EXCHANGE_API = 'https://api.coingecko.com/api/v3/simple/price';

/**
 * Fetch real-time crypto prices in USD
 * @returns {Promise<Object>} { BTC: price, ETH: price, ... }
 */
export async function fetchCryptoPrices() {
  // Supported cryptos: BTC, ETH, USDT
  const response = await axios.get(`${EXCHANGE_API}?ids=bitcoin,ethereum,tether&vs_currencies=usd`);
  return {
    BTC: response.data.bitcoin.usd,
    ETH: response.data.ethereum.usd,
    USDT: response.data.tether.usd,
  };
}

/**
 * Calculate payroll allocation for an employee
 * @param {Object} employee { id, salary, allocation: { fiat: %, crypto: %, cryptoType }, walletAddress }
 * @param {Object} prices { BTC, ETH, USDT }
 * @returns {Object} { fiatAmount, cryptoAmount, cryptoType, walletAddress }
 */
export function calculateHybridPayroll(employee, prices) {
  const fiatPercent = employee.allocation?.fiat ?? 100;
  const cryptoPercent = employee.allocation?.crypto ?? 0;
  const cryptoType = employee.allocation?.cryptoType ?? 'BTC';
  const salary = employee.salary;
  const fiatAmount = (salary * fiatPercent) / 100;
  const cryptoAmountUSD = (salary * cryptoPercent) / 100;
  const cryptoPrice = prices[cryptoType] || 1;
  const cryptoAmount = cryptoAmountUSD / cryptoPrice;
  return {
    fiatAmount,
    cryptoAmount,
    cryptoType,
    walletAddress: employee.walletAddress || '',
  };
}

/**
 * Calculate tax implications for crypto payments
 * @param {number} cryptoAmountUSD Amount paid in crypto (USD equivalent)
 * @returns {Object} { taxDue, notes }
 */
export function calculateCryptoTax(cryptoAmountUSD) {
  // Example: Flat 20% tax rate for crypto income (replace with jurisdiction-specific logic)
  const taxRate = 0.2;
  return {
    taxDue: cryptoAmountUSD * taxRate,
    notes: 'Crypto income taxed at 20% (example, check local laws)',
  };
}

/**
 * Securely update employee wallet address
 * @param {Object} employee
 * @param {string} walletAddress
 * @returns {Object} Updated employee
 */
export function updateWalletAddress(employee, walletAddress) {
  // Add validation and security checks as needed
  return {
    ...employee,
    walletAddress,
  };
}

/**
 * Process payroll for all employees
 * @param {Array} employees
 * @returns {Array} Array of payroll results
 */
export async function processPayroll(employees) {
  const prices = await fetchCryptoPrices();
  return employees.map(emp => {
    const allocation = calculateHybridPayroll(emp, prices);
    const cryptoTax = calculateCryptoTax(allocation.cryptoAmount * prices[allocation.cryptoType]);
    return {
      employeeId: emp.id,
      fiatAmount: allocation.fiatAmount,
      cryptoAmount: allocation.cryptoAmount,
      cryptoType: allocation.cryptoType,
      walletAddress: allocation.walletAddress,
      cryptoTax,
    };
  });
}
