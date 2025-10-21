import React, { useState, useCallback, memo } from 'react';
import { taxRules } from '../data/mockData';
import { ChevronDown, AlertCircle, CheckCircle, TrendingUp, DollarSign, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ComplianceTaxEngine = memo(() => {
    const [jurisdiction, setJurisdiction] = useState('USA - California');
    const [expandedBracket, setExpandedBracket] = useState(null);

    const handleJurisdictionChange = useCallback((e) => {
        setJurisdiction(e.target.value);
        setExpandedBracket(null);
    }, []);

    const currentRules = taxRules[jurisdiction];
    const jurisdictions = Object.keys(taxRules);

    // Calculate effective tax rate for a sample income
    const calculateEffectiveRate = (income) => {
        let totalTax = 0;
        let previousMax = 0;

        for (const bracket of currentRules.brackets) {
            const rangeMatch = bracket.range.match(/[\d,]+/g);
            if (!rangeMatch) continue;

            const min = parseInt(rangeMatch[0].replace(/,/g, ''));
            const max = rangeMatch[1] ? parseInt(rangeMatch[1].replace(/,/g, '')) : Infinity;
            const rate = parseFloat(bracket.rate) / 100;

            if (income >= min && income <= max) {
                totalTax += (income - min) * rate;
                break;
            } else if (income > max) {
                totalTax += (max - min) * rate;
            }
        }

        return ((totalTax / income) * 100).toFixed(2);
    };

    const sampleIncome = 100000;
    const effectiveRate = calculateEffectiveRate(sampleIncome);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-secondary-900 mb-2">Compliance & Tax Engine</h1>
                <p className="text-secondary-600">Manage your enterprise payroll with confidence</p>
            </div>

            {/* Jurisdiction Selector */}
            <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Globe size={24} className="text-primary-600" />
                    <h2 className="text-2xl font-bold text-secondary-900">Select Jurisdiction</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {jurisdictions.map((j) => (
                        <motion.button
                            key={j}
                            onClick={() => handleJurisdictionChange({ target: { value: j } })}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                                jurisdiction === j
                                    ? 'border-primary-600 bg-primary-50 shadow-md'
                                    : 'border-secondary-200 bg-white hover:border-secondary-300'
                            }`}
                        >
                            <div className="font-semibold text-secondary-900">{j}</div>
                            <div className="text-sm text-secondary-600 mt-1">
                                {j.includes('USA') && '🇺🇸 United States'}
                                {j.includes('Canada') && '🇨🇦 Canada'}
                                {j.includes('India') && '🇮🇳 India'}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Tax Rules Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tax Brackets Card */}
                <div className="md:col-span-2 bg-white rounded-xl shadow-lg border border-secondary-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <DollarSign size={24} className="text-success-600" />
                        <h3 className="text-2xl font-bold text-secondary-900">Tax Brackets</h3>
                    </div>

                    <div className="space-y-2">
                        <AnimatePresence>
                            {currentRules.brackets.map((bracket, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <button
                                        onClick={() => setExpandedBracket(expandedBracket === index ? null : index)}
                                        className="w-full p-4 bg-gradient-to-r from-secondary-50 to-secondary-100 hover:from-secondary-100 hover:to-secondary-200 rounded-lg border border-secondary-200 transition-all text-left"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="font-semibold text-secondary-900">{bracket.range}</div>
                                                <div className="text-sm text-secondary-600 mt-1">
                                                    Tax Rate: <span className="font-mono font-bold text-primary-600">{bracket.rate}</span>
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: expandedBracket === index ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ChevronDown size={20} className="text-secondary-600" />
                                            </motion.div>
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {expandedBracket === index && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="bg-info-50 border border-info-200 border-t-0 p-4 rounded-b-lg"
                                            >
                                                <div className="text-sm text-secondary-700">
                                                    <p className="mb-2">
                                                        <span className="font-semibold">Income Range:</span> {bracket.range}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold">Effective Rate:</span> {bracket.rate} on income within this bracket
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                    {/* Effective Tax Rate */}
                    <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl shadow-lg border border-success-200 p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp size={20} className="text-success-600" />
                            <h4 className="font-semibold text-secondary-900">Effective Rate</h4>
                        </div>
                        <div className="text-3xl font-bold text-success-600 mb-2">{effectiveRate}%</div>
                        <p className="text-sm text-secondary-600">
                            On ${sampleIncome.toLocaleString()} annual income
                        </p>
                    </div>

                    {/* Compliance Status */}
                    <div className="bg-gradient-to-br from-info-50 to-info-100 rounded-xl shadow-lg border border-info-200 p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle size={20} className="text-info-600" />
                            <h4 className="font-semibold text-secondary-900">Compliance</h4>
                        </div>
                        <div className="text-sm text-secondary-700">
                            <p className="mb-2">✓ Rules Updated</p>
                            <p className="mb-2">✓ Auto-Applied</p>
                            <p>✓ Verified</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Compliance Notes */}
            <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-6">
                <div className="flex items-start gap-3">
                    <AlertCircle size={24} className="text-warning-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-secondary-900 mb-2">Important Compliance Notes</h3>
                        <p className="text-secondary-700 leading-relaxed mb-4">{currentRules.notes}</p>
                        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                            <p className="text-sm text-warning-900">
                                <span className="font-semibold">⚠️ Disclaimer:</span> These tax rules are for reference only. 
                                Always consult with a tax professional to ensure compliance with current regulations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tax Calculation Example */}
            <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-6">
                <h3 className="text-2xl font-bold text-secondary-900 mb-6">Tax Calculation Example</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-secondary-900 mb-4">Sample Annual Income: ${sampleIncome.toLocaleString()}</h4>
                        <div className="space-y-3">
                            {currentRules.brackets.map((bracket, index) => {
                                const rangeMatch = bracket.range.match(/[\d,]+/g);
                                if (!rangeMatch) return null;

                                const min = parseInt(rangeMatch[0].replace(/,/g, ''));
                                const max = rangeMatch[1] ? parseInt(rangeMatch[1].replace(/,/g, '')) : sampleIncome;
                                const rate = parseFloat(bracket.rate) / 100;

                                let taxableIncome = 0;
                                if (sampleIncome >= min && sampleIncome <= max) {
                                    taxableIncome = sampleIncome - min;
                                } else if (sampleIncome > max) {
                                    taxableIncome = max - min;
                                }

                                const tax = taxableIncome * rate;

                                return (
                                    <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg border border-secondary-200">
                                        <div>
                                            <div className="text-sm font-medium text-secondary-900">{bracket.range}</div>
                                            <div className="text-xs text-secondary-600">${taxableIncome.toLocaleString()} × {bracket.rate}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-secondary-900">${tax.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-info-50 to-info-100 rounded-lg p-6 border border-info-200">
                        <h4 className="font-semibold text-secondary-900 mb-4">Total Tax Calculation</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center pb-3 border-b border-info-200">
                                <span className="text-secondary-700">Gross Income:</span>
                                <span className="font-bold text-secondary-900">${sampleIncome.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-info-200">
                                <span className="text-secondary-700">Total Tax:</span>
                                <span className="font-bold text-info-600">
                                    ${(sampleIncome * (parseFloat(effectiveRate) / 100)).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-3">
                                <span className="text-secondary-700 font-semibold">Net Income:</span>
                                <span className="font-bold text-success-600 text-lg">
                                    ${(sampleIncome - (sampleIncome * (parseFloat(effectiveRate) / 100))).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Compliance Copilot */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg border border-purple-200 p-6">
                <h3 className="text-2xl font-bold text-secondary-900 mb-4">🤖 AI Compliance Copilot</h3>
                <p className="text-secondary-700 mb-4">
                    Our AI-powered compliance assistant monitors tax law changes and automatically updates your payroll system to ensure continuous compliance across all jurisdictions.
                </p>
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                    Launch AI Assistant
                </button>
            </div>
        </div>
    );
});

ComplianceTaxEngine.displayName = 'ComplianceTaxEngine';

export default ComplianceTaxEngine;
