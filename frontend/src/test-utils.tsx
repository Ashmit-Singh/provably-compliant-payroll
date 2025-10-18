import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { NotificationProvider } from './components/ui/NotificationSystem';
import { User, NotificationProps, Employee, PayrollRun } from './types';

// Note: Jest types are provided by `@types/jest` in devDependencies; avoid redeclaring `jest` here to prevent TS2451.

// Mock data
export const mockEmployee: Employee = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  employeeId: 'EMP001',
  department: 'Engineering',
  jobRole: 'Software Engineer',
  salary: 75000,
  location: 'New York',
  status: 'ACTIVE',
  hireDate: '2023-01-15',
  benefitPlan: 'Premium',
  emergencyContact: 'Jane Doe',
  emergencyPhone: '+1234567891',
  createdAt: '2023-01-15T00:00:00Z',
  updatedAt: '2023-01-15T00:00:00Z',
};

export const mockPayrollRun: PayrollRun = {
  id: '1',
  payPeriod: '2024-01',
  runDate: '2024-01-31T00:00:00Z',
  totalAmount: 150000,
  employeeCount: 10,
  status: 'COMPLETED',
  blockchainTxHash: '0x1234567890abcdef',
  complianceRulesHash: 'abc123def456',
  createdAt: '2024-01-31T00:00:00Z',
  processedAt: '2024-01-31T01:00:00Z',
};

export const mockUser: User = {
  id: '1',
  username: 'admin',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  roles: ['ADMIN'],
  isActive: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialUser?: User | null;
  initialNotifications?: NotificationProps[];
  initialLoading?: boolean;
  initialError?: string | null;
}

const AllTheProviders = ({ 
  children, 
  initialUser: _initialUser = null,
  initialNotifications: _initialNotifications = [],
  initialLoading: _initialLoading = false,
  initialError: _initialError = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
  initialNotifications?: NotificationProps[];
  initialLoading?: boolean;
  initialError?: string | null;
}) => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const {
    initialUser,
    initialNotifications,
    initialLoading,
    initialError,
    ...renderOptions
  } = options;

  return render(ui, {
    wrapper: (props: any) => (
      <AllTheProviders
        {...props}
        initialUser={initialUser}
        initialNotifications={initialNotifications}
        initialLoading={initialLoading}
        initialError={initialError}
      />
    ),
    ...renderOptions,
  });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Mock API responses
export const mockApiResponses = {
  employees: {
    success: {
      data: [mockEmployee],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    },
    error: {
      timestamp: '2024-01-01T00:00:00Z',
      status: 500,
      error: 'Internal Server Error',
      message: 'Failed to fetch employees',
      path: '/api/employees',
      traceId: 'trace-123',
    },
  },
  payroll: {
    success: {
      data: [mockPayrollRun],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    },
    error: {
      timestamp: '2024-01-01T00:00:00Z',
      status: 500,
      error: 'Internal Server Error',
      message: 'Failed to fetch payroll data',
      path: '/api/payroll',
      traceId: 'trace-456',
    },
  },
};

// Mock functions
export const mockFunctions = {
  mockFetch: jest.fn(),
  mockConsoleError: jest.spyOn(console, 'error').mockImplementation(() => {}),
  mockConsoleWarn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
  mockLocalStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
};

// Test helpers
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

export const createMockEvent = (target: any = {}) => ({
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  target: {
    value: '',
    checked: false,
    ...target,
  },
});

export const createMockFormEvent = (target: any = {}) => ({
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  target: {
    elements: {
      namedItem: jest.fn(),
    },
    ...target,
  },
});

// Mock IntersectionObserver
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
  return mockIntersectionObserver;
};

// Mock ResizeObserver
export const mockResizeObserver = () => {
  const mockResizeObserver = jest.fn();
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.ResizeObserver = mockResizeObserver;
  return mockResizeObserver;
};
