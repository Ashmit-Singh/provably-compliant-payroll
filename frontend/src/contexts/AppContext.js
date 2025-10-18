import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { useNotifications } from '../components/ui/NotificationSystem';

// App Context
const AppContext = createContext();

// Initial state
const initialState = {
  // UI State
  sidebarOpen: true,
  theme: 'light',
  loading: false,
  
  // Data State
  employees: [],
  payrollHistory: [],
  departments: [],
  jobRoles: [],
  
  // Filter State
  employeeFilters: {
    search: '',
    department: '',
    location: '',
    status: '',
    salaryRange: { min: '', max: '' }
  },
  
  // Pagination State
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  },
  
  // Selection State
  selectedEmployees: new Set(),
  
  // Payroll State
  payrollStatus: 'idle',
  payrollProgress: 0,
  
  // Cache State
  cache: {
    lastFetch: null,
    dataVersion: 0
  }
};

// Action types
const ActionTypes = {
  // UI Actions
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_THEME: 'SET_THEME',
  SET_LOADING: 'SET_LOADING',
  
  // Data Actions
  SET_EMPLOYEES: 'SET_EMPLOYEES',
  ADD_EMPLOYEE: 'ADD_EMPLOYEE',
  UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
  DELETE_EMPLOYEE: 'DELETE_EMPLOYEE',
  BULK_DELETE_EMPLOYEES: 'BULK_DELETE_EMPLOYEES',
  SET_PAYROLL_HISTORY: 'SET_PAYROLL_HISTORY',
  SET_DEPARTMENTS: 'SET_DEPARTMENTS',
  SET_JOB_ROLES: 'SET_JOB_ROLES',
  
  // Filter Actions
  SET_EMPLOYEE_FILTERS: 'SET_EMPLOYEE_FILTERS',
  CLEAR_EMPLOYEE_FILTERS: 'CLEAR_EMPLOYEE_FILTERS',
  
  // Pagination Actions
  SET_PAGINATION: 'SET_PAGINATION',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_ITEMS_PER_PAGE: 'SET_ITEMS_PER_PAGE',
  
  // Selection Actions
  SET_SELECTED_EMPLOYEES: 'SET_SELECTED_EMPLOYEES',
  TOGGLE_EMPLOYEE_SELECTION: 'TOGGLE_EMPLOYEE_SELECTION',
  SELECT_ALL_EMPLOYEES: 'SELECT_ALL_EMPLOYEES',
  CLEAR_EMPLOYEE_SELECTION: 'CLEAR_EMPLOYEE_SELECTION',
  
  // Payroll Actions
  SET_PAYROLL_STATUS: 'SET_PAYROLL_STATUS',
  SET_PAYROLL_PROGRESS: 'SET_PAYROLL_PROGRESS',
  
  // Cache Actions
  UPDATE_CACHE: 'UPDATE_CACHE',
  INVALIDATE_CACHE: 'INVALIDATE_CACHE'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
      
    case ActionTypes.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
      
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case ActionTypes.SET_EMPLOYEES:
      return {
        ...state,
        employees: action.payload,
        pagination: {
          ...state.pagination,
          totalItems: action.payload.length
        }
      };
      
    case ActionTypes.ADD_EMPLOYEE:
      return {
        ...state,
        employees: [...state.employees, action.payload],
        pagination: {
          ...state.pagination,
          totalItems: state.employees.length + 1
        }
      };
      
    case ActionTypes.UPDATE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.map(emp => 
          emp.id === action.payload.id ? action.payload : emp
        )
      };
      
    case ActionTypes.DELETE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.filter(emp => emp.id !== action.payload),
        selectedEmployees: new Set([...state.selectedEmployees].filter(id => id !== action.payload)),
        pagination: {
          ...state.pagination,
          totalItems: state.employees.length - 1
        }
      };
      
    case ActionTypes.BULK_DELETE_EMPLOYEES:
      const deletedIds = action.payload;
      return {
        ...state,
        employees: state.employees.filter(emp => !deletedIds.includes(emp.id)),
        selectedEmployees: new Set(),
        pagination: {
          ...state.pagination,
          totalItems: state.employees.length - deletedIds.length
        }
      };
      
    case ActionTypes.SET_PAYROLL_HISTORY:
      return {
        ...state,
        payrollHistory: action.payload
      };
      
    case ActionTypes.SET_DEPARTMENTS:
      return {
        ...state,
        departments: action.payload
      };
      
    case ActionTypes.SET_JOB_ROLES:
      return {
        ...state,
        jobRoles: action.payload
      };
      
    case ActionTypes.SET_EMPLOYEE_FILTERS:
      return {
        ...state,
        employeeFilters: {
          ...state.employeeFilters,
          ...action.payload
        },
        pagination: {
          ...state.pagination,
          currentPage: 1 // Reset to first page when filters change
        }
      };
      
    case ActionTypes.CLEAR_EMPLOYEE_FILTERS:
      return {
        ...state,
        employeeFilters: initialState.employeeFilters,
        pagination: {
          ...state.pagination,
          currentPage: 1
        }
      };
      
    case ActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload
        }
      };
      
    case ActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          currentPage: action.payload
        }
      };
      
    case ActionTypes.SET_ITEMS_PER_PAGE:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          itemsPerPage: action.payload,
          currentPage: 1 // Reset to first page when page size changes
        }
      };
      
    case ActionTypes.SET_SELECTED_EMPLOYEES:
      return {
        ...state,
        selectedEmployees: new Set(action.payload)
      };
      
    case ActionTypes.TOGGLE_EMPLOYEE_SELECTION:
      const employeeId = action.payload;
      const newSelection = new Set(state.selectedEmployees);
      if (newSelection.has(employeeId)) {
        newSelection.delete(employeeId);
      } else {
        newSelection.add(employeeId);
      }
      return {
        ...state,
        selectedEmployees: newSelection
      };
      
    case ActionTypes.SELECT_ALL_EMPLOYEES:
      return {
        ...state,
        selectedEmployees: new Set(action.payload)
      };
      
    case ActionTypes.CLEAR_EMPLOYEE_SELECTION:
      return {
        ...state,
        selectedEmployees: new Set()
      };
      
    case ActionTypes.SET_PAYROLL_STATUS:
      return {
        ...state,
        payrollStatus: action.payload
      };
      
    case ActionTypes.SET_PAYROLL_PROGRESS:
      return {
        ...state,
        payrollProgress: action.payload
      };
      
    case ActionTypes.UPDATE_CACHE:
      return {
        ...state,
        cache: {
          ...state.cache,
          ...action.payload
        }
      };
      
    case ActionTypes.INVALIDATE_CACHE:
      return {
        ...state,
        cache: {
          ...state.cache,
          dataVersion: state.cache.dataVersion + 1
        }
      };
      
    default:
      return state;
  }
};

// App Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { success, error } = useNotifications();

  // Memoized selectors
  const filteredEmployees = useMemo(() => {
    let filtered = [...state.employees];
    const { search, department, location, status, salaryRange } = state.employeeFilters;

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(emp =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.department.toLowerCase().includes(searchLower) ||
        emp.jobRole.toLowerCase().includes(searchLower) ||
        emp.phone?.toLowerCase().includes(searchLower)
      );
    }

    if (department) {
      filtered = filtered.filter(emp => emp.department === department);
    }

    if (location) {
      filtered = filtered.filter(emp => emp.location === location);
    }

    if (status) {
      filtered = filtered.filter(emp => emp.status === status);
    }

    if (salaryRange.min) {
      filtered = filtered.filter(emp => emp.salary >= parseInt(salaryRange.min));
    }

    if (salaryRange.max) {
      filtered = filtered.filter(emp => emp.salary <= parseInt(salaryRange.max));
    }

    return filtered;
  }, [state.employees, state.employeeFilters]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (state.pagination.currentPage - 1) * state.pagination.itemsPerPage;
    const endIndex = startIndex + state.pagination.itemsPerPage;
    return filteredEmployees.slice(startIndex, endIndex);
  }, [filteredEmployees, state.pagination.currentPage, state.pagination.itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredEmployees.length / state.pagination.itemsPerPage);
  }, [filteredEmployees.length, state.pagination.itemsPerPage]);

  // Action creators
  const actions = useMemo(() => ({
    // UI Actions
    toggleSidebar: () => dispatch({ type: ActionTypes.TOGGLE_SIDEBAR }),
    setTheme: (theme) => dispatch({ type: ActionTypes.SET_THEME, payload: theme }),
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),

    // Data Actions
    setEmployees: (employees) => dispatch({ type: ActionTypes.SET_EMPLOYEES, payload: employees }),
    addEmployee: (employee) => {
      dispatch({ type: ActionTypes.ADD_EMPLOYEE, payload: employee });
      success('Employee added successfully');
    },
    updateEmployee: (employee) => {
      dispatch({ type: ActionTypes.UPDATE_EMPLOYEE, payload: employee });
      success('Employee updated successfully');
    },
    deleteEmployee: (employeeId) => {
      dispatch({ type: ActionTypes.DELETE_EMPLOYEE, payload: employeeId });
      success('Employee deleted successfully');
    },
    bulkDeleteEmployees: (employeeIds) => {
      dispatch({ type: ActionTypes.BULK_DELETE_EMPLOYEES, payload: employeeIds });
      success(`${employeeIds.length} employees deleted successfully`);
    },
    setPayrollHistory: (history) => dispatch({ type: ActionTypes.SET_PAYROLL_HISTORY, payload: history }),
    setDepartments: (departments) => dispatch({ type: ActionTypes.SET_DEPARTMENTS, payload: departments }),
    setJobRoles: (jobRoles) => dispatch({ type: ActionTypes.SET_JOB_ROLES, payload: jobRoles }),

    // Filter Actions
    setEmployeeFilters: (filters) => dispatch({ type: ActionTypes.SET_EMPLOYEE_FILTERS, payload: filters }),
    clearEmployeeFilters: () => dispatch({ type: ActionTypes.CLEAR_EMPLOYEE_FILTERS }),

    // Pagination Actions
    setPagination: (pagination) => dispatch({ type: ActionTypes.SET_PAGINATION, payload: pagination }),
    setCurrentPage: (page) => dispatch({ type: ActionTypes.SET_CURRENT_PAGE, payload: page }),
    setItemsPerPage: (itemsPerPage) => dispatch({ type: ActionTypes.SET_ITEMS_PER_PAGE, payload: itemsPerPage }),

    // Selection Actions
    setSelectedEmployees: (employeeIds) => dispatch({ type: ActionTypes.SET_SELECTED_EMPLOYEES, payload: employeeIds }),
    toggleEmployeeSelection: (employeeId) => dispatch({ type: ActionTypes.TOGGLE_EMPLOYEE_SELECTION, payload: employeeId }),
    selectAllEmployees: (employeeIds) => dispatch({ type: ActionTypes.SELECT_ALL_EMPLOYEES, payload: employeeIds }),
    clearEmployeeSelection: () => dispatch({ type: ActionTypes.CLEAR_EMPLOYEE_SELECTION }),

    // Payroll Actions
    setPayrollStatus: (status) => dispatch({ type: ActionTypes.SET_PAYROLL_STATUS, payload: status }),
    setPayrollProgress: (progress) => dispatch({ type: ActionTypes.SET_PAYROLL_PROGRESS, payload: progress }),

    // Cache Actions
    updateCache: (cacheData) => dispatch({ type: ActionTypes.UPDATE_CACHE, payload: cacheData }),
    invalidateCache: () => dispatch({ type: ActionTypes.INVALIDATE_CACHE })
  }), [success]);

  // Error handling wrapper
  const withErrorHandling = useCallback((asyncFn) => {
    return async (...args) => {
      try {
        state.loading && dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const result = await asyncFn(...args);
        return result;
      } catch (err) {
        error(err.message || 'An error occurred');
        throw err;
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    };
  }, [state.loading, error]);

  const value = useMemo(() => ({
    // State
    ...state,
    filteredEmployees,
    paginatedEmployees,
    totalPages,
    
    // Actions
    ...actions,
    withErrorHandling
  }), [state, filteredEmployees, paginatedEmployees, totalPages, actions, withErrorHandling]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Custom hooks for specific functionality
export const useEmployees = () => {
  const { employees, filteredEmployees, paginatedEmployees, selectedEmployees, ...actions } = useApp();
  return {
    employees,
    filteredEmployees,
    paginatedEmployees,
    selectedEmployees,
    ...actions
  };
};

export const usePayroll = () => {
  const { payrollHistory, payrollStatus, payrollProgress, ...actions } = useApp();
  return {
    payrollHistory,
    payrollStatus,
    payrollProgress,
    ...actions
  };
};

export const useFilters = () => {
  const { employeeFilters, setEmployeeFilters, clearEmployeeFilters } = useApp();
  return {
    employeeFilters,
    setEmployeeFilters,
    clearEmployeeFilters
  };
};

export const usePagination = () => {
  const { pagination, totalPages, setCurrentPage, setItemsPerPage } = useApp();
  return {
    pagination,
    totalPages,
    setCurrentPage,
    setItemsPerPage
  };
};

export default AppContext;
