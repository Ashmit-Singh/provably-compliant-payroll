import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, CheckCircle2, FileCheck2 } from 'lucide-react';
import Card from '../ui/Card';
import ChartContainer from '../ui/ChartContainer';
import { payrollHistoryData } from '../../data/mockData';

const Dashboard = () => {
  const totalEmployees = 7; // Would come from API
  const monthlyCost = payrollHistoryData[payrollHistoryData.length - 1].cost;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          title="Total Employees" 
          value={totalEmployees} 
          icon={<Users size={24} />} 
        />
        <Card 
          title="Monthly Payroll Cost" 
          value={`$${monthlyCost.toLocaleString()}`} 
          subtext="For October 2025" 
          icon={<DollarSign size={24} />} 
        />
        <Card 
          title="Compliance Status" 
          value="Verified" 
          icon={<CheckCircle2 size={24} className="text-green-500" />} 
        />
        <Card 
          title="Next Payroll Run" 
          value="Nov 30, 2025" 
          icon={<FileCheck2 size={24} />} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Payroll Costs Over Last 6 Months">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={payrollHistoryData} 
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
              <YAxis 
                tickFormatter={(value) => `$${(value/1000)}k`} 
                tick={{ fill: '#64748b' }} 
              />
              <Tooltip 
                cursor={{fill: 'rgba(239, 246, 255, 0.5)'}}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '0.5rem' 
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Payroll Cost']}
              />
              <Legend />
              <Bar 
                dataKey="cost" 
                fill="#3b82f6" 
                name="Payroll Cost" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Department Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'Engineering', count: 3 },
                { name: 'Product', count: 1 },
                { name: 'Marketing', count: 1 },
                { name: 'Sales', count: 1 },
                { name: 'HR', count: 1 },
              ]}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
              <YAxis tick={{ fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '0.5rem' 
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#10b981" 
                name="Employees" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default Dashboard;