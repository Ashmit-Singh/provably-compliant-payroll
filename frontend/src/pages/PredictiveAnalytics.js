import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { 
    BrainCircuit, 
    Users, 
    DollarSign, 
    TrendingUp, 
    AlertTriangle,
    Download,
    FileText,
    Calendar,
    Target,
    Lightbulb,
    Shield
} from 'lucide-react';
import { predictLegislationImpact, getPayrollTrends } from '../services/api';
import Card from '../components/ui/Card';
import ChartContainer from '../components/ui/ChartContainer';

const PredictiveAnalyticsPage = () => {
    const [isAnalyzed, setIsAnalyzed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [trends, setTrends] = useState(null);
    const [legislationText, setLegislationText] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    const legislationExamples = [
        {
            title: 'Tax Increase Scenario',
            text: 'Effective Jan 1, 2026, the state income tax for earnings over $150,000 will increase by 1.5%. A new Digital Services tax of 0.5% will be applied to all payrolls.',
            impact: 'Moderate'
        },
        {
            title: 'Healthcare Mandate',
            text: 'Starting Q2 2026, all employers with 50+ employees must provide enhanced healthcare coverage, estimated to increase costs by $200 per employee monthly.',
            impact: 'High'
        },
        {
            title: 'Remote Work Tax',
            text: 'New legislation imposes a 2% surtax on companies with more than 30% remote workforce, aimed at supporting local infrastructure.',
            impact: 'Low'
        }
    ];

    // Fetch trends on component mount
    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const trendsData = await getPayrollTrends();
                setTrends(trendsData);
            } catch (error) {
                console.error('Failed to fetch trends:', error);
            }
        };
        fetchTrends();
    }, []);

    const handleAnalyzeImpact = async () => {
        if (!legislationText.trim()) {
            alert('Please enter legislation text to analyze');
            return;
        }

        setIsLoading(true);
        try {
            const analysisResult = await predictLegislationImpact({ legislationText });
            setAnalysis(analysisResult);
            setIsAnalyzed(true);
        } catch (error) {
            console.error('Analysis failed:', error);
            alert('Failed to analyze legislation impact. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUseExample = (exampleText) => {
        setLegislationText(exampleText);
    };

    // Transform data for charts
    const getChartData = () => {
        if (!trends) return [];
        
        return trends.historical.map((item, index) => ({
            name: item.month,
            historical: item.cost,
            predicted: trends.predicted[index]?.cost || null
        }));
    };

    const getCostBreakdownData = () => {
        if (!analysis?.costBreakdown) return [];
        return Object.entries(analysis.costBreakdown).map(([key, value]) => ({
            name: key.split(/(?=[A-Z])/).join(' '),
            value
        }));
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            Predictive Analytics
                        </h1>
                        <p className="text-slate-600">
                            AI-powered analysis of legislative impacts on payroll and compliance costs
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Shield size={16} />
                        <span>Powered by AI Compliance Engine</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Input & Examples */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Legislation Input */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <BrainCircuit size={20} />
                            Legislation Impact Analysis
                        </h2>
                        
                        <div className="mb-4">
                            <label htmlFor="legislation" className="block text-sm font-medium text-slate-700 mb-2">
                                Enter Legislation Text
                            </label>
                            <textarea
                                id="legislation"
                                rows="6"
                                value={legislationText}
                                onChange={(e) => setLegislationText(e.target.value)}
                                placeholder="Paste legislation text or regulatory changes to analyze financial impact..."
                                className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="text-sm text-slate-600">Quick examples:</span>
                            {legislationExamples.map((example, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleUseExample(example.text)}
                                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                                        legislationText === example.text
                                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                                            : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    {example.title}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={handleAnalyzeImpact}
                            disabled={isLoading || !legislationText.trim()}
                            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <BrainCircuit size={18} />
                                    </motion.div>
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <BrainCircuit size={18} />
                                    Analyze Financial Impact
                                </>
                            )}
                        </button>
                    </div>

                    {/* Historical Trends */}
                    {trends && (
                        <ChartContainer 
                            title="Payroll Cost Trends"
                            subtitle="Historical vs Predicted (6 months)"
                            action={
                                <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                                    <Download size={14} />
                                    Export
                                </button>
                            }
                        >
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={getChartData()}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="name"
                                        tick={{ fill: '#64748b' }}
                                    />
                                    <YAxis 
                                        tickFormatter={(value) => `$${value/1000}k`}
                                        tick={{ fill: '#64748b' }}
                                    />
                                    <Tooltip 
                                        formatter={(value) => [formatCurrency(value), 'Cost']}
                                        labelFormatter={(label) => `Month: ${label}`}
                                        contentStyle={{ 
                                            backgroundColor: '#fff', 
                                            border: '1px solid #e2e8f0', 
                                            borderRadius: '0.5rem' 
                                        }}
                                    />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="historical" 
                                        stroke="#3b82f6" 
                                        strokeWidth={2}
                                        name="Historical"
                                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="predicted" 
                                        stroke="#ef4444" 
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        name="Predicted"
                                        dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    )}
                </div>

                {/* Right Column - Examples & Quick Stats */}
                <div className="space-y-6">
                    {/* Quick Examples */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <FileText size={18} />
                            Example Scenarios
                        </h3>
                        <div className="space-y-3">
                            {legislationExamples.map((example, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    className="p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                                    onClick={() => handleUseExample(example.text)}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="font-medium text-slate-800 text-sm">
                                            {example.title}
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            example.impact === 'High' 
                                                ? 'bg-red-100 text-red-700'
                                                : example.impact === 'Moderate'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-green-100 text-green-700'
                                        }`}>
                                            {example.impact} Impact
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 line-clamp-2">
                                        {example.text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Analysis Tips */}
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                            <Lightbulb size={18} />
                            Analysis Tips
                        </h3>
                        <ul className="space-y-2 text-sm text-blue-700">
                            <li className="flex items-start gap-2">
                                <Target size={14} className="mt-0.5 flex-shrink-0" />
                                Include specific percentages and thresholds
                            </li>
                            <li className="flex items-start gap-2">
                                <Calendar size={14} className="mt-0.5 flex-shrink-0" />
                                Mention effective dates for accurate timeline analysis
                            </li>
                            <li className="flex items-start gap-2">
                                <Users size={14} className="mt-0.5 flex-shrink-0" />
                                Specify affected employee groups or salary ranges
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Analysis Results */}
            <AnimatePresence>
                {isAnalyzed && analysis && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Results Header */}
                        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-800 mb-2">
                                        Impact Analysis Results
                                    </h2>
                                    <p className="text-slate-600">
                                        Estimated financial impact based on current workforce and compliance rules
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-500">Effective Date</div>
                                    <div className="font-semibold text-slate-800">{analysis.effectiveDate}</div>
                                </div>
                            </div>
                        </div>

                        {/* Results Tabs */}
                        <div className="bg-white rounded-lg shadow-md border border-slate-200">
                            <div className="border-b border-slate-200">
                                <nav className="flex space-x-8 px-6">
                                    {['overview', 'breakdown', 'employees', 'recommendations'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                                                activeTab === tab
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="p-6">
                                {/* Overview Tab */}
                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <Card 
                                                title="Projected Annual Increase" 
                                                value={formatCurrency(analysis.projectedAnnualCostIncrease || analysis.projectedCostIncrease)} 
                                                icon={<DollarSign className="text-blue-600" size={20}/>} 
                                                subtext="Additional annual cost"
                                                trend="up"
                                            />
                                            <Card 
                                                title="Monthly Increase" 
                                                value={formatCurrency(analysis.monthlyIncrease)} 
                                                icon={<TrendingUp className="text-green-600" size={20}/>} 
                                                subtext="Recurring monthly impact"
                                            />
                                            <Card 
                                                title="Employees Affected" 
                                                value={analysis.affectedEmployeeCount} 
                                                icon={<Users className="text-purple-600" size={20}/>} 
                                                subtext="Directly impacted staff"
                                            />
                                            <Card 
                                                title="Effective Date" 
                                                value={analysis.effectiveDate} 
                                                icon={<Calendar className="text-orange-600" size={20}/>} 
                                                subtext="Legislation start date"
                                            />
                                        </div>

                                        {/* Cost Breakdown Chart */}
                                        <ChartContainer 
                                            title="Cost Breakdown"
                                            subtitle="Distribution of additional costs"
                                        >
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                                                <ResponsiveContainer width="100%" height={250}>
                                                    <PieChart>
                                                        <Pie
                                                            data={getCostBreakdownData()}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={false}
                                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                            outerRadius={80}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                        >
                                                            {getCostBreakdownData().map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip formatter={(value) => [formatCurrency(value), 'Cost']} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                                <div className="space-y-3">
                                                    {getCostBreakdownData().map((item, index) => (
                                                        <div key={item.name} className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div 
                                                                    className="w-3 h-3 rounded"
                                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                                />
                                                                <span className="text-sm text-slate-700">{item.name}</span>
                                                            </div>
                                                            <span className="font-semibold text-slate-900">
                                                                {formatCurrency(item.value)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </ChartContainer>
                                    </div>
                                )}

                                {/* Breakdown Tab */}
                                {activeTab === 'breakdown' && analysis.costBreakdown && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-slate-800">Detailed Cost Analysis</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(analysis.costBreakdown).map(([key, value]) => (
                                                <div key={key} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                                    <div className="text-sm text-slate-600 capitalize">
                                                        {key.split(/(?=[A-Z])/).join(' ')}
                                                    </div>
                                                    <div className="text-xl font-bold text-slate-800 mt-1">
                                                        {formatCurrency(value)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Employees Tab */}
                                {activeTab === 'employees' && analysis.affectedEmployees && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-slate-800">Affected Employees</h3>
                                        <div className="space-y-3">
                                            {analysis.affectedEmployees.map((employee, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                    <div>
                                                        <div className="font-medium text-slate-800">{employee.name}</div>
                                                        <div className="text-sm text-slate-600">
                                                            Additional cost: {formatCurrency(employee.additionalCost)}
                                                        </div>
                                                    </div>
                                                    <AlertTriangle className="text-yellow-500" size={16} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recommendations Tab */}
                                {activeTab === 'recommendations' && analysis.recommendations && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-slate-800">Recommended Actions</h3>
                                        <div className="space-y-3">
                                            {analysis.recommendations.map((recommendation, index) => (
                                                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                    <Lightbulb className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                                                    <p className="text-sm text-blue-800">{recommendation}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PredictiveAnalyticsPage;