import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  Legend
} from 'recharts';
import AnimatedLoginForm from './ui/AnimatedLoginForm';

// Color palette for charts
const COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#06B6D4', // cyan
  '#F97316', // orange
  '#84CC16', // lime
  '#EC4899', // pink
  '#6B7280'  // gray
];

// Bar Chart Component
export const BarChartComponent = memo(({
  data, 
  xKey, 
  yKey, 
  title, 
  height = 300,
  showGrid = true,
  showTooltip = true,
  color = COLORS[0],
  className = ''
}) => {
  const handleBarClick = useCallback((barData) => {
    console.log('Bar clicked:', barData);
  }, []);

  return (
    <div className={`bg-white p-6 rounded-lg shadow border border-slate-200 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          <XAxis 
            dataKey={xKey} 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          {showTooltip && (
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
          )}
          <Bar 
            dataKey={yKey} 
            fill={color}
            radius={[4, 4, 0, 0]}
            onClick={handleBarClick}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

// Line Chart Component
export const LineChartComponent = memo(({
  data, 
  xKey, 
  yKey, 
  title, 
  height = 300,
  showGrid = true,
  showTooltip = true,
  color = COLORS[0],
  strokeWidth = 2,
  className = ''
}) => {
  const handleLineClick = useCallback((lineData) => {
    console.log('Line clicked:', lineData);
  }, []);

  return (
    <div className={`bg-white p-6 rounded-lg shadow border border-slate-200 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          <XAxis 
            dataKey={xKey} 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          {showTooltip && (
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
          )}
          <Line 
            type="monotone" 
            dataKey={yKey} 
            stroke={color}
            strokeWidth={strokeWidth}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            onClick={handleLineClick}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

// Area Chart Component
export const AreaChartComponent = memo(({
  data, 
  xKey, 
  yKey, 
  title, 
  height = 300,
  showGrid = true,
  showTooltip = true,
  color = COLORS[0],
  className = ''
}) => {
  const handleAreaClick = useCallback((areaData) => {
    console.log('Area clicked:', areaData);
  }, []);

  return (
    <div className={`bg-white p-6 rounded-lg shadow border border-slate-200 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          <XAxis 
            dataKey={xKey} 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          {showTooltip && (
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
          )}
          <Area 
            type="monotone" 
            dataKey={yKey} 
            stroke={color}
            fill={color}
            fillOpacity={0.3}
            strokeWidth={2}
            onClick={handleAreaClick}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

// Pie Chart Component
export const PieChartComponent = memo(({
  data, 
  dataKey, 
  nameKey, 
  title, 
  height = 300,
  showTooltip = true,
  showLegend = true,
  colors = COLORS,
  className = ''
}) => {
  const handlePieClick = useCallback((pieData) => {
    console.log('Pie slice clicked:', pieData);
  }, []);

  return (
    <div className={`bg-white p-6 rounded-lg shadow border border-slate-200 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
            onClick={handlePieClick}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          {showTooltip && (
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
          )}
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

// Multi-series Line Chart
export const MultiLineChartComponent = memo(({
  data, 
  xKey, 
  series = [], 
  title, 
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  colors = COLORS,
  className = ''
}) => {
  const handleMultiLineClick = useCallback((multiLineData) => {
    console.log('Multi-line data clicked:', multiLineData);
  }, []);

  return (
    <div className={`bg-white p-6 rounded-lg shadow border border-slate-200 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          <XAxis 
            dataKey={xKey} 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          {showTooltip && (
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
          )}
          {showLegend && <Legend />}
          {series.map((serie, index) => (
            <Line
              key={serie.dataKey}
              type="monotone"
              dataKey={serie.dataKey}
              stroke={serie.color || colors[index % colors.length]}
              strokeWidth={serie.strokeWidth || 2}
              dot={{ fill: serie.color || colors[index % colors.length], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: serie.color || colors[index % colors.length], strokeWidth: 2 }}
              name={serie.name}
              onClick={handleMultiLineClick}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

// Stat Card Component
export const StatCard = memo(({
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon,
  trend,
  className = ''
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const getChangeIcon = () => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white p-6 rounded-lg shadow border border-slate-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {change && (
            <p className={`text-sm ${getChangeColor()} mt-1`}>
              {getChangeIcon()} {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-slate-100 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
});

// Data Table Component
export const DataTable = memo(({
  data, 
  columns, 
  title,
  showPagination = true,
  pageSize = 10,
  className = ''
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <div className={`bg-white rounded-lg shadow border border-slate-200 ${className}`}>
      {title && (
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {currentData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && totalPages > 1 && (
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-700">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

// Render the animated login form as the main export
export default AnimatedLoginForm;

// Add this to your main page/component to render the animated login form
// <AnimatedLoginForm />
