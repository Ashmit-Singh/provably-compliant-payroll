import React, { useState } from 'react';
import { taxRules } from '../data/mockData';

const ComplianceTaxEngine = () => {
    const [jurisdiction, setJurisdiction] = useState('USA - California');
    const rules = taxRules[jurisdiction];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Dynamic Compliance & Tax Engine</h2>
            <p className="text-slate-500 mb-6">The system dynamically loads and applies tax rules based on employee jurisdiction, ensuring continuous compliance.</p>
            <div className="mb-6 max-w-sm">
                <label htmlFor="jurisdiction" className="block text-sm font-medium text-slate-700 mb-1">Select Jurisdiction:</label>
                <select
                    id="jurisdiction"
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full p-2 border rounded-md bg-white"
                >
                    {Object.keys(taxRules).map(j => <option key={j} value={j}>{j}</option>)}
                </select>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-slate-700 mb-3">Tax Rules for {jurisdiction}</h3>
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="p-3 text-sm font-semibold text-slate-600">Income Range</th>
                            <th className="p-3 text-sm font-semibold text-slate-600">Tax Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rules.brackets.map((bracket, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-3 text-slate-800">{bracket.range}</td>
                                <td className="p-3 text-slate-800 font-mono">{bracket.rate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="text-sm text-slate-500 mt-4 p-3 bg-slate-50 rounded-md">{rules.notes}</p>
            </div>
        </div>
    );
};

export default ComplianceTaxEngine;