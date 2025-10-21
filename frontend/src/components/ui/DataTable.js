import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({
  columns,
  data,
  onRowClick,
  selectable = false,
  sortable = true,
  filterable = true,
  pagination = true,
  pageSize = 10,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Filter data
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    let sorted = [...filteredData];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }
    return sorted;
  }, [filteredData, sortConfig]);

  // Paginate
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key) => {
    if (!sortable) return;
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((_, i) => i)));
    }
  };

  const handleSelectRow = (index) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {filterable && (
        <div className="relative">
          <Search className="absolute left-3 top-3 text-secondary-400 dark:text-secondary-500" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-800 dark:text-secondary-50"
            aria-label="Search table"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-secondary-200 dark:border-secondary-700">
        <table className="w-full" role="table">
          <thead>
            <tr className="bg-secondary-50 dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700">
              {selectable && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-4 py-3 text-left text-sm font-semibold text-secondary-900 dark:text-secondary-50 ${
                    sortable ? 'cursor-pointer hover:bg-secondary-100 dark:hover:bg-secondary-700' : ''
                  }`}
                  role="columnheader"
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {sortable && sortConfig.key === col.key && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors cursor-pointer"
                onClick={() => onRowClick?.(row)}
                role="row"
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(idx)}
                      onChange={() => handleSelectRow(idx)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded"
                      aria-label={`Select row ${idx + 1}`}
                    />
                  </td>
                )}
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-sm text-secondary-700 dark:text-secondary-300" role="cell">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-secondary-300 dark:border-secondary-600 rounded-lg disabled:opacity-50 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-primary-600 text-white'
                    : 'border border-secondary-300 dark:border-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-800'
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-secondary-300 dark:border-secondary-600 rounded-lg disabled:opacity-50 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
