import React, { useState, useMemo } from 'react';
import { Download, Shield, Calculator } from 'lucide-react';
import { taxRules } from '../../data/taxRules';

const ComplianceTaxEngine = () => {
  const [jurisdiction, setJurisdiction] = useState('USA - California');
  const [salary, setSalary] = useState('');
  const rules = taxRules[jurisdiction];

  const calculatedTax = useMemo(() => {
    if (!salary || isNaN(salary)) return null;
    
    const annualSalary = parseFloat(salary);
    let tax = 0;
    
    // Simplified tax calculation for demonstration
    if (jurisdiction === 'USA - California') {
      if (annualSalary > 61215) tax = annualSalary * 0.093;
      else if (annualSalary > 48436) tax = annualSalary * 0.08;
      else if (annualSalary > 34893) tax = annualSalary * 0.06;
      else if (annualSalary > 22108) tax = annualSalary * 0.04;
      else if (annualSalary > 9326) tax = annualSalary * 0.02;
      else tax = annualSalary * 0.01;
      
      // Add SDI tax
      tax += annualSalary * 0.011;
    }
    // Add calculations for other jurisdictions...
    
    return {
      annual: tax,
      monthly: tax / 12,
      netAnnual: annualSalary - tax,
      netMonthly: (annualSalary - tax) / 12
    };
  }, [salary, jurisdiction]);

  const handleExportRules = () => {
    const dataStr = JSON.stringify(rules, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tax-rules-${jurisdiction.replace(' ', '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Dynamic Compliance & Tax Engine</h2>
            <p className="text-slate-500">
              The system dynamically loads and applies tax rules based on employee jurisdiction, ensuring continuous compliance.
            </p>
          </div>
          <button 
            onClick={handleExportRules}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download size={16} />
            Export Rules
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="jurisdiction" className="block text-sm font-medium text-slate-700 mb-2">
                Select Jurisdiction:
              </label>
              <select 
                id="jurisdiction" 
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {Object.keys(taxRules).map(j => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-slate-700 mb-2">
                Calculate Tax (Annual Salary):
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500">$</span>
                </div>
                <input
                  type="number"
                  id="salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="Enter annual salary"
                  className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {calculatedTax && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Calculator size={16} />
                  Tax Calculation Results
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-600">Annual Tax:</span>
                    <div className="font-semibold text-slate-800">
                      ${calculatedTax.annual.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-600">Monthly Tax:</span>
                    <div className="font-semibold text-slate-800">
                      ${calculatedTax.monthly.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-600">Net Annual:</span>
                    <div className="font-semibold text-slate-800">
                      ${calculatedTax.netAnnual.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-600">Net Monthly:</span>
                    <div className="font-semibold text-slate-800">
                      ${calculatedTax.netMonthly.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-blue-600" size={20} />
              <h3 className="font-semibold text-lg text-slate-700">
                Tax Rules for {jurisdiction}
              </h3>
            </div>
            
            <div className="overflow-hidden border border-slate-200 rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3 text-sm font-semibold text-slate-600 border-b">Income Range</th>
                    <th className="p-3 text-sm font-semibold text-slate-600 border-b">Tax Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.brackets.map((bracket, index) => (
                    <tr key={index} className="border-b last:border-b-0 hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-slate-800 font-medium">{bracket.range}</td>
                      <td className="p-3 text-slate-800 font-mono bg-slate-50">{bracket.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-3 bg-slate-50 rounded-md border border-slate-200">
              <p className="text-sm text-slate-600 leading-relaxed">{rules.notes}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Compliance Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-green-800">Tax Rules</span>
            </div>
            <p className="text-green-700 text-sm">All tax rules are up to date</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-green-800">Filings</span>
            </div>
            <p className="text-green-700 text-sm">All filings are current</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-semibold text-blue-800">Last Audit</span>
            </div>
            <p className="text-blue-700 text-sm">Completed: Sep 15, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceTaxEngine;