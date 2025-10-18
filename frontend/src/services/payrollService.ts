import apiService from './api';
import { PayrollRun, PayrollFormData, PaginatedResponse, ApiResponse } from '@/types';

/**
 * Payroll Service for handling payroll-related API calls
 */
class PayrollService {
  private baseUrl = '/payroll';

  /**
   * Get payroll history with optional pagination and filtering
   */
  async getPayrollHistory(params?: {
    page?: number;
    limit?: number;
    status?: string;
    payPeriod?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<PayrollRun>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.payPeriod) queryParams.append('payPeriod', params.payPeriod);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `${this.baseUrl}/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiService.get<PaginatedResponse<PayrollRun>>(url);
  }

  /**
   * Get payroll run by ID
   */
  async getPayrollRun(id: string): Promise<PayrollRun> {
    return apiService.get<PayrollRun>(`${this.baseUrl}/run/${id}`);
  }

  /**
   * Run payroll
   */
  async runPayroll(payrollData: PayrollFormData): Promise<PayrollRun> {
    return apiService.post<PayrollRun>(`${this.baseUrl}/run`, payrollData);
  }

  /**
   * Get payroll run status
   */
  async getPayrollStatus(id: string): Promise<{
    status: string;
    progress: number;
    message: string;
    steps: Array<{ name: string; completed: boolean; timestamp?: string }>;
  }> {
    return apiService.get(`${this.baseUrl}/run/${id}/status`);
  }

  /**
   * Cancel payroll run
   */
  async cancelPayrollRun(id: string): Promise<ApiResponse> {
    return apiService.post<ApiResponse>(`${this.baseUrl}/run/${id}/cancel`);
  }

  /**
   * Approve payroll run
   */
  async approvePayrollRun(id: string): Promise<ApiResponse> {
    return apiService.post<ApiResponse>(`${this.baseUrl}/run/${id}/approve`);
  }

  /**
   * Reject payroll run
   */
  async rejectPayrollRun(id: string, reason: string): Promise<ApiResponse> {
    return apiService.post<ApiResponse>(`${this.baseUrl}/run/${id}/reject`, { reason });
  }

  /**
   * Get payroll analytics
   */
  async getPayrollAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    department?: string;
  }): Promise<{
    totalPayroll: number;
    averagePayroll: number;
    totalEmployees: number;
    departmentBreakdown: Array<{ name: string; value: number }>;
    monthlyTrend: Array<{ name: string; value: number }>;
    statusBreakdown: Array<{ name: string; value: number }>;
  }> {
    const queryParams = new URLSearchParams();
    
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.department) queryParams.append('department', params.department);

    const url = `${this.baseUrl}/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiService.get(url);
  }

  /**
   * Export payroll data
   */
  async exportPayroll(params?: {
    startDate?: string;
    endDate?: string;
    status?: string;
    format?: 'csv' | 'excel' | 'pdf';
  }): Promise<void> {
    const queryParams = new URLSearchParams();
    
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.format) queryParams.append('format', params.format);

    const url = `${this.baseUrl}/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const filename = `payroll-${new Date().toISOString().split('T')[0]}.${params?.format || 'csv'}`;
    return apiService.downloadFile(url, filename);
  }

  /**
   * Get payroll run details with employee breakdown
   */
  async getPayrollRunDetails(id: string): Promise<{
    payrollRun: PayrollRun;
    employees: Array<{
      id: string;
      name: string;
      department: string;
      grossPay: number;
      deductions: number;
      netPay: number;
      status: string;
    }>;
  }> {
    return apiService.get(`${this.baseUrl}/run/${id}/details`);
  }

  /**
   * Retry failed payroll run
   */
  async retryPayrollRun(id: string): Promise<PayrollRun> {
    return apiService.post<PayrollRun>(`${this.baseUrl}/run/${id}/retry`);
  }

  /**
   * Get payroll run logs
   */
  async getPayrollRunLogs(id: string): Promise<Array<{
    timestamp: string;
    level: string;
    message: string;
    details?: any;
  }>> {
    return apiService.get(`${this.baseUrl}/run/${id}/logs`);
  }

  /**
   * Validate payroll data
   */
  async validatePayroll(payrollData: Partial<PayrollFormData>): Promise<{
    isValid: boolean;
    errors: Record<string, string[]>;
    warnings: string[];
  }> {
    return apiService.post(`${this.baseUrl}/validate`, payrollData);
  }

  /**
   * Get available pay periods
   */
  async getPayPeriods(): Promise<Array<{
    value: string;
    label: string;
    startDate: string;
    endDate: string;
  }>> {
    return apiService.get(`${this.baseUrl}/pay-periods`);
  }

  /**
   * Get payroll run statistics
   */
  async getPayrollStatistics(): Promise<{
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    pendingRuns: number;
    totalAmount: number;
    averageAmount: number;
  }> {
    return apiService.get(`${this.baseUrl}/statistics`);
  }
}

// Create and export a singleton instance
const payrollService = new PayrollService();
export default payrollService;

// Export the class for testing purposes
export { PayrollService };
