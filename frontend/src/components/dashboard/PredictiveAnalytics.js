import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BrainCircuit, TrendingUp, Users, DollarSign, AlertTriangle } from 'lucide-react';
import Card from '../ui/Card';
import ChartContainer from '../ui/ChartContainer';
import { predictiveAnalyticsData } from '../../data/mockData';

const PredictiveAnalytics = () => {
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [legislationText, setLegislationText] = useState(
    `Effective Jan 1, 2026, the state income tax for earnings over $150,000 will increase by 1.5%. A new 'Digital Services' tax of 0.5% will be applied to all payrolls. Additional healthcare mandate requires employers to contribute $200 per employee monthly.`
  );

  const handleAnalyze = async () => {
    setIsLoading(true);
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzed(true);
    setIsLoading(false);
  };

  const handleReset = () => {
    setIsAnalyzed(false);
    setLegislationText(
      `Effective Jan 1, 2026, the state income tax for earnings over $150,000 will increase by 1.5%. A new 'Digital Services' tax of 0.5% will be applied to all payrolls. Additional healthcare mandate requires employers to contribute $200 per employee monthly.`
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <BrainCircuit className="text-blue-600" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-slate-800">AI-Driven Predictive Analytics</h2>
            <p className="text-slate-500">
              Simulate the financial impact of new legislation on future payroll costs using our predictive AI model.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="legislation" className="block text-sm font-medium text-slate-700 mb-2">
              Legislative Text Analysis
            </label>
            <textarea 
              id="legislation" 
              rows="6"
              value={legislationText}
              onChange={(e) => setLegislationText(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Paste legislative text or describe proposed regulatory changes..."
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleAnalyze}
              disabled={isLoading || !legislationText.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <BrainCircuit size={18} />
                  Analyze Impact
                </>
              )}
            </button>
            
            {isAnalyzed && (
              <button 
                onClick={handleReset}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Reset Analysis
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAnalyzed && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-6"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card 
                title="Projected Annual Cost Increase" 
                value="$38,500" 
                icon={<DollarSign size={24} />} 
                subtext="Based on current roster"
              />
              <Card 
                title="Number of Employees Affected" 
                value="4" 
                icon={<Users size={24} />} 
                subtext="Directly impacted by new tax bracket"
              />
              <Card 
                title="Monthly Increase" 
                value="$3,208" 
                icon={<TrendingUp size={24} />} 
                subtext="Average monthly additional cost"
              />
              <Card 
                title="Effective Date" 
                value="Jan 1, 2026" 
                icon={<AlertTriangle size={24} className="text-amber-500" />} 
                subtext="Legislation start date"
              />
            </div>

            {/* Detailed Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Detailed Impact Analysis</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-slate-700 mb-3">Breakdown of Additional Costs</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Increased Tax Burden</span>
                      <span className="font-semibold text-slate-800">$24,200</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Digital Services Tax</span>
                      <span className="font-semibold text-slate-800">$4,300</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Healthcare Mandate</span>
                      <span className="font-semibold text-slate-800">$10,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="text-blue-700 font-medium">Total Additional Cost</span>
                      <span className="font-bold text-blue-800">$38,500</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-700 mb-3">Affected Employees</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Alice Johnson</span>
                      <span className="font-mono">+$7,200</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Diana Miller</span>
                      <span className="font-mono">+$9,100</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>George Rodriguez</span>
                      <span className="font-mono">+$7,800</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Bob Williams</span>
                      <span className="font-mono">+$5,200</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-800 text-sm">
                      <strong>Recommendation:</strong> Consider adjusting salary budgets and 
                      explore tax optimization strategies for high-earning employees.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Predictive Chart */}
            <ChartContainer title="Predicted vs. Current Payroll Cost (Next 12 Months)">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={predictiveAnalyticsData.current.map((item, index) => ({
                    ...item,
                    predicted: predictiveAnalyticsData.predicted[index].cost
                  }))}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#64748b' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value/1000)}k`} 
                    tick={{ fill: '#64748b' }}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cost" 
                    stroke="#60a5fa" 
                    strokeWidth={3}
                    name="Current Trend" 
                    dot={{ fill: '#60a5fa', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    name="Predicted Impact" 
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#dc2626' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Actionable Insights */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">AI-Generated Insights & Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">💰 Cost Optimization</h4>
                    <p className="text-green-700 text-sm">
                      Consider restructuring bonus payments to occur before Jan 2026 to avoid 
                      the increased tax burden on high-earning employees.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">📊 Budget Planning</h4>
                    <p className="text-blue-700 text-sm">
                      Increase Q1 2026 payroll budget by approximately 5.3% to accommodate 
                      the new legislative requirements.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">⚖️ Compliance Strategy</h4>
                    <p className="text-purple-700 text-sm">
                      Update payroll system tax tables by Dec 15, 2025 to ensure seamless 
                      transition to new rates. Schedule compliance review for Q4 2025.
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-semibold text-amber-800 mb-2">🔄 Process Review</h4>
                    <p className="text-amber-700 text-sm">
                      Evaluate remote work policies for employees in affected jurisdictions 
                      to potentially optimize tax liabilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PredictiveAnalytics;