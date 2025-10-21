import React, { useState } from 'react';
import { calculateEarlyAccess, processInstantPayment, recordEarlyAccessCompliance } from '../../services/onDemandPay';

const EarlyAccessCard = ({ employee }) => {
  const [amount] = useState(calculateEarlyAccess(employee));
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleRequest = async () => {
    setError(null);
    setStatus(null);
    try {
      const payment = await processInstantPayment(employee, amount);
      const compliance = recordEarlyAccessCompliance(employee, amount);
      setStatus({ payment, compliance });
    } catch (err) {
      setError(err.message || 'Failed to process early access payment');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h3 className="text-lg font-bold mb-2">On-Demand Pay</h3>
      <div className="mb-2">Available for early access: <strong>${amount.toLocaleString()}</strong></div>
      <button onClick={handleRequest} className="bg-blue-600 text-white px-4 py-2 rounded">Request Instant Payment</button>
      {status && (
        <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
          <div><strong>Status:</strong> {status.payment.status}</div>
          <div><strong>Compliance:</strong> {status.compliance.details}</div>
          <div><strong>Timestamp:</strong> {status.payment.timestamp}</div>
        </div>
      )}
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
};

export default EarlyAccessCard;
