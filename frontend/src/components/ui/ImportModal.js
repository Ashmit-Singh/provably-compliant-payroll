import React, { useState, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, AlertCircle, X, Download, FileText } from 'lucide-react';

const ImportModal = memo(({ 
  isOpen, 
  onClose, 
  onImport, 
  title = 'Import Data',
  acceptedTypes = ['.csv', '.xlsx', '.xls'],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  isLoading = false,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [importOptions, setImportOptions] = useState({
    skipFirstRow: true,
    updateExisting: false,
    validateData: true
  });
  
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleFile = useCallback((file) => {
    setError(null);
    
    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      setError(`Invalid file type. Please upload a ${acceptedTypes.join(', ')} file.`);
      return;
    }
    
    // Validate file size
    if (file.size > maxFileSize) {
      setError(`File too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB.`);
      return;
    }
    
    setSelectedFile(file);
  }, [acceptedTypes, maxFileSize]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      onImport(selectedFile, importOptions);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError(null);
    setDragActive(false);
    onClose();
  };

  const downloadTemplate = () => {
    // Create a simple CSV template
    const template = [
      ['First Name', 'Last Name', 'Email', 'Department', 'Job Role', 'Salary', 'Location', 'Status'],
      ['John', 'Doe', 'john.doe@company.com', 'Engineering', 'Developer', '75000', 'USA - California', 'active'],
      ['Jane', 'Smith', 'jane.smith@company.com', 'Marketing', 'Manager', '65000', 'USA - California', 'active']
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employee-import-template.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'csv':
        return <FileText className="text-green-500" size={24} />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="text-blue-500" size={24} />;
      default:
        return <FileText className="text-slate-500" size={24} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-title"
      >
        <motion.div
          initial={{ scale: 0.9, y: -20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: -20, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`bg-white rounded-lg shadow-2xl w-full max-w-lg ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <Upload className="text-blue-500" size={24} />
              <h2 id="import-title" className="text-xl font-semibold text-slate-800">
                {title}
              </h2>
            </div>
            <button 
              onClick={handleClose} 
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
              aria-label="Close modal"
              disabled={isLoading}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* File Upload Area */}
            <div
              ref={dropZoneRef}
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : selectedFile 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-slate-300 hover:border-slate-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedTypes.join(',')}
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isLoading}
              />
              
              {selectedFile ? (
                <div className="flex flex-col items-center gap-3">
                  {getFileIcon(selectedFile.name)}
                  <div>
                    <p className="font-medium text-slate-900">{selectedFile.name}</p>
                    <p className="text-sm text-slate-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-sm text-red-600 hover:text-red-800"
                    disabled={isLoading}
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="text-slate-400" size={48} />
                  <div>
                    <p className="text-lg font-medium text-slate-900">
                      {dragActive ? 'Drop file here' : 'Choose file or drag and drop'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {acceptedTypes.join(', ')} up to {Math.round(maxFileSize / 1024 / 1024)}MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="text-red-500" size={16} />
                <span className="text-sm text-red-700">{error}</span>
              </motion.div>
            )}

            {/* Import Options */}
            <div className="mt-6 space-y-4">
              <h3 className="font-medium text-slate-900">Import Options</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={importOptions.skipFirstRow}
                    onChange={(e) => setImportOptions(prev => ({ ...prev, skipFirstRow: e.target.checked }))}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-slate-700">Skip first row (header)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={importOptions.updateExisting}
                    onChange={(e) => setImportOptions(prev => ({ ...prev, updateExisting: e.target.checked }))}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-slate-700">Update existing records</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={importOptions.validateData}
                    onChange={(e) => setImportOptions(prev => ({ ...prev, validateData: e.target.checked }))}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-slate-700">Validate data before import</span>
                </label>
              </div>
            </div>

            {/* Template Download */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Need a template?</p>
                  <p className="text-xs text-slate-500">Download our CSV template to get started</p>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  disabled={isLoading}
                >
                  <Download size={16} />
                  Download Template
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!selectedFile || isLoading}
                className="px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Importing...
                  </div>
                ) : (
                  'Import Data'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

export default ImportModal;
