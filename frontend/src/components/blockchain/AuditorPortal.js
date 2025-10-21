import React, { useState } from 'react';
import { getPayrollNFT } from '../../services/blockchain';

const AuditorPortal = () => {
  const [tokenId, setTokenId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchNFT = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const nft = await getPayrollNFT(Number(tokenId));
      setResult(nft);
    } catch (err) {
      setError(err.message || 'Failed to fetch NFT');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Auditor Access Portal</h2>
      <form onSubmit={handleFetchNFT} className="mb-4">
        <label className="block mb-2 font-medium">Payroll NFT Token ID</label>
        <input
          type="number"
          value={tokenId}
          onChange={e => setTokenId(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="Enter token ID"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Fetch NFT</button>
      </form>
      {loading && <div className="text-blue-600">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {result && (
        <div className="mt-4 p-4 bg-slate-50 rounded border">
          <div><strong>Payroll Batch ID:</strong> {result.payrollBatchId}</div>
          <div><strong>Compliance Proof:</strong> {result.complianceProof}</div>
        </div>
      )}
    </div>
  );
};

export default AuditorPortal;
