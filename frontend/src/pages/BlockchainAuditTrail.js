import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileCheck2, 
    Users, 
    DollarSign, 
    ChevronDown, 
    ChevronRight,
    Search,
    Shield,
    CheckCircle2,
    XCircle,
    Clock,
    
    Copy,
    ExternalLink,
    AlertTriangle,
    RefreshCw
} from 'lucide-react';
import { getTransactions, verifyTransaction, getLastHash } from '../services/api';

const BlockchainAuditTrailPage = () => {
    const [expandedId, setExpandedId] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastHash, setLastHash] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [verifyingTx, setVerifyingTx] = useState(null);
    const [copiedHash, setCopiedHash] = useState(null);

    // Transaction type configurations
    const transactionTypes = {
        'PAYROLL_RUN': { icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },
        'EMPLOYEE_ADD': { icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
        'EMPLOYEE_UPDATE': { icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-100' },
        'EMPLOYEE_DELETE': { icon: Users, color: 'text-red-600', bgColor: 'bg-red-100' },
        'BENEFIT_UPDATE': { icon: FileCheck2, color: 'text-orange-600', bgColor: 'bg-orange-100' },
        'SALARY_UPDATE': { icon: DollarSign, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
        'COMPLIANCE_CHECK': { icon: Shield, color: 'text-indigo-600', bgColor: 'bg-indigo-100' }
    };

    // Fetch transactions and last hash
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [txsData, lastHashData] = await Promise.all([
                    getTransactions(),
                    getLastHash()
                ]);
                setTransactions(txsData);
                setFilteredTransactions(txsData);
                setLastHash(lastHashData);
            } catch (err) {
                setError(err.message || 'Failed to fetch blockchain data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Apply filters and search
    useEffect(() => {
        let filtered = transactions;

        if (searchTerm) {
            filtered = filtered.filter(tx =>
                tx.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tx.employeeName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (typeFilter) {
            filtered = filtered.filter(tx => tx.type === typeFilter);
        }

        if (statusFilter) {
            filtered = filtered.filter(tx => {
                if (statusFilter === 'verified') return tx.verified === true;
                if (statusFilter === 'unverified') return tx.verified === false;
                if (statusFilter === 'pending') return tx.verified === undefined;
                return true;
            });
        }

        setFilteredTransactions(filtered);
    }, [transactions, searchTerm, typeFilter, statusFilter]);

    const toggleExpansion = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleVerifyTransaction = async (txHash) => {
        setVerifyingTx(txHash);
        try {
            const isValid = await verifyTransaction(txHash);
            // Update transaction verification status
            setTransactions(prev => prev.map(tx => 
                tx.hash === txHash ? { ...tx, verified: isValid } : tx
            ));
        } catch (err) {
            console.error('Verification failed:', err);
        } finally {
            setVerifyingTx(null);
        }
    };

    const handleCopyHash = async (hash) => {
        try {
            await navigator.clipboard.writeText(hash);
            setCopiedHash(hash);
            setTimeout(() => setCopiedHash(null), 2000);
        } catch (err) {
            console.error('Failed to copy hash:', err);
        }
    };

    const handleRefresh = async () => {
        try {
            setIsLoading(true);
            const [txsData, lastHashData] = await Promise.all([
                getTransactions(),
                getLastHash()
            ]);
            setTransactions(txsData);
            setLastHash(lastHashData);
        } catch (err) {
            setError(err.message || 'Failed to refresh data.');
        } finally {
            setIsLoading(false);
        }
    };

    const getTransactionIcon = (type) => {
        const config = transactionTypes[type] || transactionTypes['COMPLIANCE_CHECK'];
        const IconComponent = config.icon;
        return <IconComponent size={20} className={config.color} />;
    };

    const getStatusBadge = (tx) => {
        if (tx.verified === true) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle2 size={12} />
                    Verified
                </span>
            );
        } else if (tx.verified === false) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle size={12} />
                    Invalid
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock size={12} />
                    Unverified
                </span>
            );
        }
    };

    const formatHash = (hash) => {
        return `${hash.substring(0, 16)}...${hash.substring(hash.length - 8)}`;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-12">
                <RefreshCw className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-4 p-8 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="text-red-500" size={48} />
                <h3 className="text-lg font-semibold text-red-700">Failed to Load Data</h3>
                <p className="text-red-600">{error}</p>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                    <RefreshCw size={16} />
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            Blockchain Audit Trail
                        </h1>
                        <p className="text-slate-600">
                            Immutable, time-stamped log of all critical system activities secured on distributed ledger
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Shield size={16} />
                            <span>Last Block Hash: {formatHash(lastHash)}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                            {transactions.length} total transactions
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search transactions, hashes, or employees..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Types</option>
                        {Object.keys(transactionTypes).map(type => (
                            <option key={type} value={type}>
                                {type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                            </option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Status</option>
                        <option value="verified">Verified</option>
                        <option value="unverified">Unverified</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-slate-600">
                        Showing {filteredTransactions.length} of {transactions.length} transactions
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Transactions List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {filteredTransactions.map((tx) => (
                        <motion.div
                            key={tx.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden"
                        >
                            <button 
                                onClick={() => toggleExpansion(tx.id)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="flex-shrink-0">
                                        {getTransactionIcon(tx.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="font-semibold text-slate-800 truncate">
                                                {tx.details}
                                            </p>
                                            {getStatusBadge(tx)}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <span className="font-mono">
                                                Hash: {formatHash(tx.hash)}
                                            </span>
                                            <span>
                                                {new Date(tx.timestamp).toLocaleDateString()} at {new Date(tx.timestamp).toLocaleTimeString()}
                                            </span>
                                            {tx.amount && (
                                                <span className="font-semibold text-slate-700">
                                                    {formatCurrency(tx.amount)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {expandedId === tx.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {expandedId === tx.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden border-t border-slate-200"
                                    >
                                        <div className="p-4 bg-slate-50">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Transaction Details */}
                                                <div className="space-y-3">
                                                    <h4 className="font-semibold text-slate-800 text-sm">Transaction Details</h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-600">Type:</span>
                                                            <span className="font-medium text-slate-800">{tx.type}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-600">Timestamp:</span>
                                                            <span className="font-medium text-slate-800">
                                                                {new Date(tx.timestamp).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        {tx.employeeName && (
                                                            <div className="flex justify-between">
                                                                <span className="text-slate-600">Employee:</span>
                                                                <span className="font-medium text-slate-800">{tx.employeeName}</span>
                                                            </div>
                                                        )}
                                                        {tx.amount && (
                                                            <div className="flex justify-between">
                                                                <span className="text-slate-600">Amount:</span>
                                                                <span className="font-medium text-slate-800">{formatCurrency(tx.amount)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Blockchain Data */}
                                                <div className="space-y-3">
                                                    <h4 className="font-semibold text-slate-800 text-sm">Blockchain Data</h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between items-start">
                                                            <span className="text-slate-600">Transaction Hash:</span>
                                                            <div className="flex items-center gap-2">
                                                                <code className="font-mono text-xs bg-white px-2 py-1 rounded border">
                                                                    {formatHash(tx.hash)}
                                                                </code>
                                                                <button
                                                                    onClick={() => handleCopyHash(tx.hash)}
                                                                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                                                    title="Copy hash"
                                                                >
                                                                    <Copy size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-600">Block Number:</span>
                                                            <span className="font-medium text-slate-800">{tx.blockNumber}</span>
                                                        </div>
                                                        <div className="flex justify-between items-start">
                                                            <span className="text-slate-600">Previous Hash:</span>
                                                            <code className="font-mono text-xs bg-white px-2 py-1 rounded border">
                                                                {formatHash(tx.prevHash)}
                                                            </code>
                                                        </div>
                                                        <div className="flex justify-between items-start">
                                                            <span className="text-slate-600">Data Hash:</span>
                                                            <code className="font-mono text-xs bg-white px-2 py-1 rounded border">
                                                                {formatHash(tx.dataHash)}
                                                            </code>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                                                <div className="text-xs text-slate-500">
                                                    Transaction ID: {tx.id}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleVerifyTransaction(tx.hash)}
                                                        disabled={verifyingTx === tx.hash}
                                                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                                                    >
                                                        {verifyingTx === tx.hash ? (
                                                            <RefreshCw size={14} className="animate-spin" />
                                                        ) : (
                                                            <Shield size={14} />
                                                        )}
                                                        {verifyingTx === tx.hash ? 'Verifying...' : 'Verify on Chain'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleCopyHash(tx.hash)}
                                                        className="flex items-center gap-2 px-3 py-1 bg-slate-600 text-white text-sm rounded hover:bg-slate-700 transition-colors"
                                                    >
                                                        <Copy size={14} />
                                                        Copy Hash
                                                    </button>
                                                    <button className="flex items-center gap-2 px-3 py-1 bg-slate-200 text-slate-700 text-sm rounded hover:bg-slate-300 transition-colors">
                                                        <ExternalLink size={14} />
                                                        Explorer
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredTransactions.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                        <FileCheck2 className="mx-auto text-slate-300" size={48} />
                        <div className="mt-4 text-slate-500">No transactions found</div>
                        {(searchTerm || typeFilter || statusFilter) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setTypeFilter('');
                                    setStatusFilter('');
                                }}
                                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Copy Success Toast */}
            <AnimatePresence>
                {copiedHash && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
                    >
                        <CheckCircle2 size={16} />
                        Hash copied to clipboard!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BlockchainAuditTrailPage;