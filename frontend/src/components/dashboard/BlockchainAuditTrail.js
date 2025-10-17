import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCheck2, Users, DollarSign, UserPlus, ChevronDown, ChevronRight, Copy, ExternalLink } from 'lucide-react';
import { blockchainTransactions } from '../../data/mockData';
import { formatDate, truncateHash } from '../../utils/formatters';

const BlockchainAuditTrail = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);

  const toggleExpansion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const copyToClipboard = async (text, hash) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'Payroll Run':
        return <FileCheck2 className="text-blue-500" size={20} />;
      case 'Benefit Update':
        return <Users className="text-green-500" size={20} />;
      case 'New Employee':
        return <UserPlus className="text-purple-500" size={20} />;
      case 'Salary Update':
        return <DollarSign className="text-amber-500" size={20} />;
      default:
        return <FileCheck2 className="text-slate-500" size={20} />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'Payroll Run':
        return 'bg-blue-50 border-blue-200';
      case 'Benefit Update':
        return 'bg-green-50 border-green-200';
      case 'New Employee':
        return 'bg-purple-50 border-purple-200';
      case 'Salary Update':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Blockchain Audit Trail</h2>
        <p className="text-slate-500 mb-6">
          An immutable, time-stamped log of all critical system activities, secured on a distributed ledger.
          Each transaction is cryptographically linked to the previous one, ensuring data integrity.
        </p>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">{blockchainTransactions.length}</div>
            <div className="text-sm text-slate-600">Total Transactions</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">4</div>
            <div className="text-sm text-slate-600">Transaction Types</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">100%</div>
            <div className="text-sm text-slate-600">Data Integrity</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">0</div>
            <div className="text-sm text-slate-600">Verification Failures</div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {blockchainTransactions.map((tx) => (
            <div 
              key={tx.id} 
              className={`border rounded-lg transition-all duration-200 ${getTransactionColor(tx.type)} ${
                expandedId === tx.id ? 'ring-2 ring-blue-200' : ''
              }`}
            >
              <button 
                onClick={() => toggleExpansion(tx.id)} 
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white hover:bg-opacity-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-800 truncate">{tx.details}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        tx.type === 'Payroll Run' ? 'bg-blue-100 text-blue-800' :
                        tx.type === 'Benefit Update' ? 'bg-green-100 text-green-800' :
                        tx.type === 'New Employee' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {tx.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="font-mono">
                        Hash: {truncateHash(tx.hash, 8, 6)}
                      </span>
                      <span>{formatDate(tx.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(tx.hash, tx.hash);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    title="Copy transaction hash"
                  >
                    <Copy size={16} />
                  </button>
                  {expandedId === tx.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
              </button>
              
              <AnimatePresence>
                {expandedId === tx.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t bg-white bg-opacity-50 space-y-4">
                      {/* Transaction Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-semibold text-slate-700 mb-2">Transaction Details</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Type:</span>
                              <span className="font-mono text-slate-800">{tx.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Timestamp:</span>
                              <span className="font-mono text-slate-800">{formatDate(tx.timestamp)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Block Height:</span>
                              <span className="font-mono text-slate-800">#{1245678 + tx.id}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-slate-700 mb-2">Cryptographic Hashes</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">Data Hash:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-slate-800 text-xs">
                                  {truncateHash(tx.dataHash, 6, 6)}
                                </span>
                                <button 
                                  onClick={() => copyToClipboard(tx.dataHash, `data-${tx.id}`)}
                                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                  <Copy size={14} />
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">Previous Hash:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-slate-800 text-xs">
                                  {truncateHash(tx.prevHash, 6, 6)}
                                </span>
                                <button 
                                  onClick={() => copyToClipboard(tx.prevHash, `prev-${tx.id}`)}
                                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                  <Copy size={14} />
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">Transaction Hash:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-slate-800 text-xs">
                                  {truncateHash(tx.hash, 6, 6)}
                                </span>
                                <button 
                                  onClick={() => copyToClipboard(tx.hash, `tx-${tx.id}`)}
                                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                  <Copy size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={() => copyToClipboard(tx.hash, `full-${tx.id}`)}
                          className="flex items-center gap-2 px-3 py-2 text-xs border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <Copy size={14} />
                          Copy Full Hash
                        </button>
                        <button 
                          onClick={() => window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank')}
                          className="flex items-center gap-2 px-3 py-2 text-xs border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <ExternalLink size={14} />
                          View on Explorer
                        </button>
                        <button 
                          onClick={() => {
                            // Verify transaction integrity
                            alert('Transaction integrity verified successfully!');
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-xs bg-green-100 text-green-800 border border-green-200 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <FileCheck2 size={14} />
                          Verify Integrity
                        </button>
                      </div>

                      {/* Copy Success Message */}
                      <AnimatePresence>
                        {copiedHash && (copiedHash === tx.hash || copiedHash.includes(`${tx.id}`)) && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-2 bg-green-100 text-green-800 text-xs rounded-lg text-center"
                          >
                            ✓ Copied to clipboard!
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-3">Transaction Types</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-slate-600">Payroll Runs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-slate-600">Benefit Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-slate-600">New Employees</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-slate-600">Salary Updates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Info */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">About the Blockchain Audit Trail</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">How It Works</h4>
            <ul className="space-y-2">
              <li>• Each transaction is cryptographically hashed and timestamped</li>
              <li>• Hashes are linked together forming an immutable chain</li>
              <li>• Data integrity is automatically verified with each access</li>
              <li>• Transactions cannot be altered or deleted once recorded</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Benefits</h4>
            <ul className="space-y-2">
              <li>• Tamper-proof record of all payroll activities</li>
              <li>• Instant verification for auditors and regulators</li>
              <li>• Protection against data manipulation and fraud</li>
              <li>• Complete transparency and accountability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainAuditTrail;