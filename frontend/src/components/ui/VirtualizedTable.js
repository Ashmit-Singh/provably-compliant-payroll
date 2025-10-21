import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { ChevronUp, ChevronDown } from 'lucide-react';

const VirtualizedTable = ({
  columns,
  data,
  rowHeight = 50,
  height = 600,
  sortable = true,
  onSort,
  sortConfig = { key: null, direction: 'asc' },
}) => {
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [data, sortConfig]);

  const Row = ({ index, style }) => {
    const row = sortedData[index];
    const isEven = index % 2 === 0;

    return (
      <div
        style={style}
        className={`flex border-b border-secondary-200 dark:border-secondary-700 ${
          isEven ? 'bg-white dark:bg-secondary-800' : 'bg-secondary-50 dark:bg-secondary-900'
        } hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors`}
      >
        {columns.map(col => (
          <div
            key={col.key}
            className="flex-1 px-4 py-3 text-sm text-secondary-700 dark:text-secondary-300 overflow-hidden text-ellipsis"
          >
            {col.render ? col.render(row[col.key], row) : row[col.key]}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex border-b-2 border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800">
        {columns.map(col => (
          <div
            key={col.key}
            onClick={() => sortable && onSort?.(col.key)}
            className={`flex-1 px-4 py-3 text-sm font-semibold text-secondary-900 dark:text-secondary-50 ${
              sortable ? 'cursor-pointer hover:bg-secondary-100 dark:hover:bg-secondary-700' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              {col.label}
              {sortable && sortConfig.key === col.key && (
                sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Virtualized List */}
      <List
        height={height}
        itemCount={sortedData.length}
        itemSize={rowHeight}
        width="100%"
      >
        {Row}
      </List>

      {/* Footer */}
      <div className="text-sm text-slate-600 dark:text-slate-400 text-right">
        Showing {sortedData.length} rows
      </div>
    </div>
  );
};

export default VirtualizedTable;
