import apiService from './api';
import { Employee, EmployeeFormData, PaginatedResponse, ApiResponse } from '@/types';

/**
 * Employee Service for handling employee-related API calls
 */
class EmployeeService {
  private baseUrl = '/employees';

  /**
   * Get all employees with optional pagination and filtering
   */
  async getEmployees(params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    location?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Employee>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.location) queryParams.append('location', params.location);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiService.get<PaginatedResponse<Employee>>(url);
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id: string): Promise<Employee> {
    return apiService.get<Employee>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get employee by employee ID
   */
  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee> {
    return apiService.get<Employee>(`${this.baseUrl}/employee-id/${employeeId}`);
  }

  /**
   * Create new employee
   */
  async createEmployee(employeeData: EmployeeFormData): Promise<Employee> {
    return apiService.post<Employee>(this.baseUrl, employeeData);
  }

  /**
   * Update employee
   */
  async updateEmployee(id: string, employeeData: Partial<EmployeeFormData>): Promise<Employee> {
    return apiService.put<Employee>(`${this.baseUrl}/${id}`, employeeData);
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id: string): Promise<ApiResponse> {
    return apiService.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Bulk delete employees
   */
  async bulkDeleteEmployees(ids: string[]): Promise<ApiResponse> {
    return apiService.post<ApiResponse>(`${this.baseUrl}/bulk-delete`, { ids });
  }

  /**
   * Export employees to CSV
   */
  async exportEmployees(params?: {
    search?: string;
    department?: string;
    location?: string;
    status?: string;
  }): Promise<void> {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.location) queryParams.append('location', params.location);
    if (params?.status) queryParams.append('status', params.status);

    const url = `${this.baseUrl}/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiService.downloadFile(url, 'employees.csv');
  }

  /**
   * Import employees from CSV
   */
  async importEmployees(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse> {
    return apiService.uploadFile<ApiResponse>(`${this.baseUrl}/import`, file, onProgress);
  }

  /**
   * Get employee analytics
   */
  async getEmployeeAnalytics(): Promise<{
    totalEmployees: number;
    activeEmployees: number;
    departmentDistribution: Array<{ name: string; value: number }>;
    salaryDistribution: Array<{ name: string; value: number }>;
    locationDistribution: Array<{ name: string; value: number }>;
    statusDistribution: Array<{ name: string; value: number }>;
  }> {
    return apiService.get(`${this.baseUrl}/analytics`);
  }

  /**
   * Get departments list
   */
  async getDepartments(): Promise<string[]> {
    return apiService.get<string[]>(`${this.baseUrl}/departments`);
  }

  /**
   * Get locations list
   */
  async getLocations(): Promise<string[]> {
    return apiService.get<string[]>(`${this.baseUrl}/locations`);
  }

  /**
   * Validate employee data
   */
  async validateEmployee(employeeData: Partial<EmployeeFormData>): Promise<{
    isValid: boolean;
    errors: Record<string, string[]>;
  }> {
    return apiService.post(`${this.baseUrl}/validate`, employeeData);
  }
}

// Create and export a singleton instance
const employeeService = new EmployeeService();
export default employeeService;

// Export the class for testing purposes
export { EmployeeService };
