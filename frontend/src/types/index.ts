// Core application types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  employeeId: string;
  department: string;
  jobRole: string;
  salary: number;
  location: string;
  status: EmployeeStatus;
  hireDate: string;
  benefitPlan?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';

export interface PayrollRun {
  id: string;
  payPeriod: string;
  runDate: string;
  totalAmount: number;
  employeeCount: number;
  status: PayrollStatus;
  blockchainTxHash?: string;
  complianceRulesHash?: string;
  createdAt: string;
  processedAt?: string;
}

export type PayrollStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CERTIFIED';

export interface PayrollRequest {
  payPeriod: string;
  payDate: string;
  employeeIds: string[];
  description?: string;
  totalAmount?: number;
  employeeCount?: number;
  status?: PayrollStatus;
}

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  traceId?: string;
  validationErrors?: ValidationError[];
  details?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  rejectedValue: any;
  message: string;
}

// UI Component types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger' | 'success' | 'warning';
  variant?: 'danger' | 'warning' | 'success' | 'info';
  isLoading?: boolean;
  loadingText?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  isVisible: boolean;
}

// Form types
export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  employeeId: string;
  department: string;
  jobRole: string;
  salary: number;
  location: string;
  status: EmployeeStatus;
  hireDate: string;
  benefitPlan?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface PayrollFormData {
  payPeriod: string;
  payDate: string;
  employeeIds: string[];
  description?: string;
}

// Filter and search types
export interface EmployeeFilters {
  search: string;
  department: string;
  location: string;
  status: string;
  salaryRange: {
    min: number;
    max: number;
  };
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
}

// Chart and analytics types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface PayrollAnalytics {
  totalEmployees: number;
  totalPayroll: number;
  averageSalary: number;
  departmentBreakdown: ChartData[];
  statusBreakdown: ChartData[];
  monthlyTrend: ChartData[];
}

export interface EmployeeAnalytics {
  totalEmployees: number;
  activeEmployees: number;
  departmentDistribution: ChartData[];
  salaryDistribution: ChartData[];
  locationDistribution: ChartData[];
  statusDistribution: ChartData[];
}

// Context types
export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  notifications: NotificationProps[];
  addNotification: (notification: Omit<NotificationProps, 'id' | 'isVisible'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Hook types
export interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export interface UseApiReturn<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

// Service types
export interface ApiService {
  get: <T>(url: string, config?: any) => Promise<T>;
  post: <T>(url: string, data?: any, config?: any) => Promise<T>;
  put: <T>(url: string, data?: any, config?: any) => Promise<T>;
  delete: <T>(url: string, config?: any) => Promise<T>;
  patch: <T>(url: string, data?: any, config?: any) => Promise<T>;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Event types
export interface CustomEvent<T = any> {
  type: string;
  payload: T;
  timestamp: number;
}

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

// Constants
export const EMPLOYEE_STATUSES: EmployeeStatus[] = ['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'];
export const PAYROLL_STATUSES: PayrollStatus[] = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CERTIFIED'];

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success' as const,
  ERROR: 'error' as const,
  WARNING: 'warning' as const,
  INFO: 'info' as const,
};

export const MODAL_SIZES = {
  SM: 'sm' as const,
  MD: 'md' as const,
  LG: 'lg' as const,
  XL: 'xl' as const,
  '2XL': '2xl' as const,
  '3XL': '3xl' as const,
  '4XL': '4xl' as const,
  FULL: 'full' as const,
};

export const SORT_DIRECTIONS = {
  ASC: 'asc' as const,
  DESC: 'desc' as const,
};
