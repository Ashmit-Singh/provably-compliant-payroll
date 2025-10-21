import React, { useState, useCallback, memo } from 'react';
import { taxRules } from '../data/mockData';
import Card from '../components/ui/Card';

const ComplianceTaxEngine = memo(() => {
    const [jurisdiction, setJurisdiction] = useState('USA - California');
    const handleJurisdictionChange = useCallback((e) => {
        setJurisdiction(e.target.value);
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Dynamic Compliance & Tax Engine</h2>
                    <p className="text-slate-500 mb-6">The system dynamically loads and applies tax rules based on employee jurisdiction, ensuring continuous compliance.</p>
                    <div className="mb-6">
                        <label htmlFor="jurisdiction" className="block text-sm font-medium text-slate-700 mb-1">Select Jurisdiction:</label>
                        <select
                            id="jurisdiction"
                            value={jurisdiction}
                            onChange={handleJurisdictionChange}
                            className="w-full p-2 border rounded-md bg-white"
                        >
                            {Object.keys(taxRules).map(j => <option key={j} value={j}>{j}</option>)}
                        </select>
                    </div>
                </Card>
                <Card>
                    <h3 className="font-semibold text-lg text-slate-700 mb-3">Tax Rules for {jurisdiction}</h3>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-slate-600">Income Range</th>
                                <th className="p-3 text-sm font-semibold text-slate-600">Tax Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {taxRules[jurisdiction].brackets.map((bracket, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-3 text-slate-800">{bracket.range}</td>
                                    <td className="p-3 text-slate-800 font-mono">{bracket.rate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="text-sm text-slate-500 mt-4 p-3 bg-slate-50 rounded-md">{taxRules[jurisdiction].notes}</p>
                </Card>
            </div>
        </div>
    );
});

export default ComplianceTaxEngine;