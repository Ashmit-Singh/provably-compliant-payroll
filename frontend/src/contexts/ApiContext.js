import React, { createContext, useContext, useCallback, useState } from 'react';

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  const request = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Payroll APIs
  const payrollApi = {
    getPayrolls: () => request('/payroll'),
    getPayroll: (id) => request(`/payroll/${id}`),
    createPayroll: (data) => request('/payroll', { method: 'POST', body: JSON.stringify(data) }),
    updatePayroll: (id, data) => request(`/payroll/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deletePayroll: (id) => request(`/payroll/${id}`, { method: 'DELETE' }),
    processPayroll: (id) => request(`/payroll/${id}/process`, { method: 'POST' }),
  };

  // Employee APIs
  const employeeApi = {
    getEmployees: () => request('/employees'),
    getEmployee: (id) => request(`/employees/${id}`),
    createEmployee: (data) => request('/employees', { method: 'POST', body: JSON.stringify(data) }),
    updateEmployee: (id, data) => request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteEmployee: (id) => request(`/employees/${id}`, { method: 'DELETE' }),
    searchEmployees: (query) => request(`/employees/search?q=${query}`),
  };

  // Compliance APIs
  const complianceApi = {
    getTaxRules: () => request('/compliance/tax-rules'),
    checkCompliance: (data) => request('/compliance/check', { method: 'POST', body: JSON.stringify(data) }),
    getComplianceReport: (id) => request(`/compliance/report/${id}`),
    validatePayroll: (id) => request(`/compliance/validate/${id}`, { method: 'POST' }),
  };

  // Report APIs
  const reportApi = {
    getReports: () => request('/reports'),
    getReport: (id) => request(`/reports/${id}`),
    generateReport: (type, data) => request(`/reports/generate/${type}`, { method: 'POST', body: JSON.stringify(data) }),
    exportReport: (id, format) => request(`/reports/${id}/export?format=${format}`),
    scheduleReport: (data) => request('/reports/schedule', { method: 'POST', body: JSON.stringify(data) }),
  };

  // Audit APIs
  const auditApi = {
    getAuditLogs: (filters) => request(`/audit/logs?${new URLSearchParams(filters)}`),
    getAuditLog: (id) => request(`/audit/logs/${id}`),
    exportAuditLogs: (format) => request(`/audit/logs/export?format=${format}`),
  };

  // Analytics APIs
  const analyticsApi = {
    getDashboardMetrics: () => request('/analytics/dashboard'),
    getPayrollTrends: (period) => request(`/analytics/payroll-trends?period=${period}`),
    getTaxAnalysis: () => request('/analytics/tax-analysis'),
    getEmployeeMetrics: () => request('/analytics/employee-metrics'),
    getComplianceMetrics: () => request('/analytics/compliance-metrics'),
    getPredictions: () => request('/analytics/predictions'),
  };

  // Webhook APIs
  const webhookApi = {
    getWebhooks: () => request('/webhooks'),
    createWebhook: (data) => request('/webhooks', { method: 'POST', body: JSON.stringify(data) }),
    updateWebhook: (id, data) => request(`/webhooks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteWebhook: (id) => request(`/webhooks/${id}`, { method: 'DELETE' }),
    testWebhook: (id) => request(`/webhooks/${id}/test`, { method: 'POST' }),
  };

  return (
    <ApiContext.Provider
      value={{
        isLoading,
        error,
        request,
        payrollApi,
        employeeApi,
        complianceApi,
        reportApi,
        auditApi,
        analyticsApi,
        webhookApi,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within ApiProvider');
  }
  return context;
};

// Specific API hooks for convenience
export const usePayrollApi = () => {
  const { payrollApi } = useApi();
  return payrollApi;
};

export const useEmployeeApi = () => {
  const { employeeApi } = useApi();
  return employeeApi;
};

export const useComplianceApi = () => {
  const { complianceApi } = useApi();
  return complianceApi;
};

export const useReportApi = () => {
  const { reportApi } = useApi();
  return reportApi;
};

export const useAuditApi = () => {
  const { auditApi } = useApi();
  return auditApi;
};

export const useAnalyticsApi = () => {
  const { analyticsApi } = useApi();
  return analyticsApi;
};

export const useWebhookApi = () => {
  const { webhookApi } = useApi();
  return webhookApi;
};
