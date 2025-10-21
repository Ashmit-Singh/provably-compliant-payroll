import axios from 'axios';

// Define the base URL for your backend API
// Read from environment variable or default to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Development flag - set to false when backend is fully ready
const USE_MOCK_DATA = true;

// Create an axios instance with default settings
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock data for development
const mockData = {
  dashboard: {
    totalEmployees: 47,
    monthlyPayroll: 285000,
    activeProjects: 12,
    complianceScore: 98,
    upcomingPayroll: 5,
    pendingApprovals: 3
  },
  employees: [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+1-555-0101',
      department: 'Engineering',
      jobRole: 'Senior Developer',
      salary: 85000,
      location: 'USA - California',
      status: 'active',
      hireDate: '2023-01-15',
      benefitPlan: 'Premium Healthcare',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+1-555-0102'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      phone: '+1-555-0103',
      department: 'Marketing',
      jobRole: 'Marketing Manager',
      salary: 75000,
      location: 'USA - California',
      status: 'active',
      hireDate: '2023-03-20',
      benefitPlan: 'Standard Healthcare',
      emergencyContact: 'John Smith',
      emergencyPhone: '+1-555-0104'
    },
    {
      id: 3,
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@company.com',
      phone: '+1-555-0105',
      department: 'Sales',
      jobRole: 'Sales Executive',
      salary: 65000,
      location: 'Canada - Ontario',
      status: 'active',
      hireDate: '2023-06-10',
      benefitPlan: 'Standard Healthcare',
      emergencyContact: 'Sarah Johnson',
      emergencyPhone: '+1-555-0106'
    }
  ],
  payrollHistory: [
    {
      id: 1,
      payPeriod: 'October 2025',
      payDate: '2025-10-31',
      totalAmount: 285000,
      employeeCount: 47,
      status: 'completed',
      blockchainTxHash: '0x1a2b3c4d5e6f7890abcdef1234567890',
      timestamp: '2025-10-31T14:30:00Z'
    },
    {
      id: 2,
      payPeriod: 'September 2025',
      payDate: '2025-09-30',
      totalAmount: 282000,
      employeeCount: 46,
      status: 'completed',
      blockchainTxHash: '0x2b3c4d5e6f7890abcdef1234567891',
      timestamp: '2025-09-30T14:30:00Z'
    }
  ],
  blockchainTransactions: [
    {
      id: 1,
      type: 'PAYROLL_RUN',
      details: 'Payroll processed for October 2025',
      hash: '0x1a2b3c4d5e6f7890abcdef1234567890',
      dataHash: '0xabc123def456ghi789',
      prevHash: '0x0987654321fedcba',
      timestamp: '2025-10-31T14:30:00Z',
      blockNumber: 12345,
      amount: 285000,
      employeeName: 'Payroll Batch'
    },
    {
      id: 2,
      type: 'EMPLOYEE_ADD',
      details: 'New employee added: Alice Brown',
      hash: '0x2b3c4d5e6f7890abcdef1234567891',
      dataHash: '0xdef456ghi789abc123',
      prevHash: '0x1a2b3c4d5e6f7890abcdef1234567890',
      timestamp: '2025-10-28T10:15:00Z',
      blockNumber: 12346,
      employeeName: 'Alice Brown'
    }
  ],
  analytics: {
    projectedAnnualCostIncrease: 38500,
    affectedEmployeeCount: 4,
    monthlyIncrease: 3208,
    effectiveDate: '2026-01-01',
    costBreakdown: {
      increasedTaxBurden: 24200,
      digitalServicesTax: 4300,
      healthcareMandate: 10000
    },
    affectedEmployees: [
      { name: 'Alice Johnson', additionalCost: 7200 },
      { name: 'Diana Miller', additionalCost: 9100 },
      { name: 'George Rodriguez', additionalCost: 7800 },
      { name: 'Bob Williams', additionalCost: 5200 }
    ],
    recommendations: [
      'Consider restructuring bonus payments to occur before Jan 2026',
      'Increase Q1 2026 payroll budget by approximately 5.3%',
      'Update payroll system tax tables by Dec 15, 2025',
      'Evaluate remote work policies for tax optimization'
    ]
  },
  payrollTrends: {
    historical: [
      { month: 'May', cost: 68200 },
      { month: 'Jun', cost: 68500 },
      { month: 'Jul', cost: 69100 },
      { month: 'Aug', cost: 71500 },
      { month: 'Sep', cost: 71800 },
      { month: 'Oct', cost: 72300 }
    ],
    predicted: [
      { month: 'Nov', cost: 72500 },
      { month: 'Dec', cost: 72800 },
      { month: 'Jan', cost: 76100 },
      { month: 'Feb', cost: 76550 },
      { month: 'Mar', cost: 77000 },
      { month: 'Apr', cost: 77450 }
    ]
  },
  taxRules: {
    'USA - California': {
      brackets: [
        { range: '$0-$9,325', rate: '1.00%' },
        { range: '$9,326 - $22,107', rate: '2.00%' },
        { range: '$22,108 - $34,892', rate: '4.00%' },
        { range: '$34,893 - $48,435', rate: '6.00%' },
        { range: '$48,436 - $61,214', rate: '8.00%' },
        { range: '$61,215 - $312,686', rate: '9.30%' }
      ],
      notes: 'Includes State Disability Insurance (SDI) tax of 1.1%. Subject to local taxes.'
    },
    'Canada - Ontario': {
      brackets: [
        { range: '$0-$49,231', rate: '5.05%' },
        { range: '$49,232 - $98,463', rate: '9.15%' },
        { range: '$98,464 - $150,000', rate: '11.16%' },
        { range: '$150,001 - $220,000', rate: '12.16%' },
        { range: 'Over $220,000', rate: '13.16%' }
      ],
      notes: 'Rates are for provincial tax only. Federal tax, CPP, and EI deductions apply separately.'
    },
    'India - Tamil Nadu': {
      brackets: [
        { range: '₹0 - ₹2,50,000', rate: '0%' },
        { range: '₹2,50,001 - ₹5,00,000', rate: '5%' },
        { range: '₹5,00,001 - ₹10,00,000', rate: '20%' },
        { range: 'Above ₹10,00,000', rate: '30%' }
      ],
      notes: 'A Health and Education Cess of 4% applies to the income tax amount. Professional Tax levied by the state is also applicable.'
    }
  }
};

// Helper function to simulate API delay
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// --- Authentication Service Functions ---
export const login = async (username, password) => {
  if (USE_MOCK_DATA) {
    await mockDelay(800);
    // In mock mode, we'll let the AuthContext handle the mock login
    throw new Error('Use mock authentication in AuthContext for development');
  }
  
  try {
    const response = await apiClient.post('/auth/login', { username, password });
    if (response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

export const register = async (username, email, password, roles) => {
  if (USE_MOCK_DATA) {
    await mockDelay(800);
    throw new Error('Use mock authentication in AuthContext for development');
  }
  
  try {
    const response = await apiClient.post('/auth/register', {
      username,
      email,
      password,
      roles: roles ? Array.from(roles) : undefined,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Registration failed');
  }
};

export const getCurrentUser = async () => {
  if (USE_MOCK_DATA) {
    await mockDelay(300);
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    throw new Error('No user found');
  }
  
  try {
    const response = await apiClient.get('/users/me');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to get user');
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  delete apiClient.defaults.headers.common['Authorization'];
};

// --- Dashboard Service Functions ---
export const getDashboardMetrics = async () => {
  if (USE_MOCK_DATA) {
    await mockDelay(600);
    return mockData.dashboard;
  }
  
  try {
    const response = await apiClient.get('/dashboard/metrics');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dashboard metrics:", error);
    throw error.response ? error.response.data : new Error('Could not fetch dashboard metrics.');
  }
};

// --- Employee Service Functions ---
export const getEmployees = async (params = {}) => {
  if (USE_MOCK_DATA) {
    await mockDelay(700);
    // Simple filtering for mock data
    let filtered = [...mockData.employees];
    
    if (params.department) {
      filtered = filtered.filter(emp => emp.department === params.department);
    }
    if (params.location) {
      filtered = filtered.filter(emp => emp.location === params.location);
    }
    if (params.status) {
      filtered = filtered.filter(emp => emp.status === params.status);
    }
    
    return filtered;
  }
  
  try {
    const response = await apiClient.get('/employees', { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    throw error.response ? error.response.data : new Error('Could not fetch employees.');
  }
};

export const getEmployeeById = async (id) => {
  if (USE_MOCK_DATA) {
    await mockDelay(400);
    const employee = mockData.employees.find(emp => emp.id === parseInt(id));
    if (!employee) throw new Error('Employee not found');
    return employee;
  }
  
  try {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch employee ${id}:`, error);
    throw error.response ? error.response.data : new Error('Could not fetch employee.');
  }
};

export const addEmployee = async (employeeData) => {
  if (USE_MOCK_DATA) {
    await mockDelay(800);
    const newEmployee = {
      id: Math.max(...mockData.employees.map(e => e.id)) + 1,
      ...employeeData,
      status: 'active',
      hireDate: employeeData.hireDate || new Date().toISOString().split('T')[0]
    };
    mockData.employees.push(newEmployee);
    return newEmployee;
  }
  
  try {
    const response = await apiClient.post('/employees', employeeData);
    return response.data;
  } catch (error) {
    console.error("Failed to add employee:", error);
    throw error.response ? error.response.data : new Error('Could not add employee.');
  }
};

export const updateEmployee = async (id, employeeData) => {
  if (USE_MOCK_DATA) {
    await mockDelay(600);
    const index = mockData.employees.findIndex(emp => emp.id === parseInt(id));
    if (index === -1) throw new Error('Employee not found');
    mockData.employees[index] = { ...mockData.employees[index], ...employeeData };
    return mockData.employees[index];
  }
  
  try {
    const response = await apiClient.put(`/employees/${id}`, employeeData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update employee ${id}:`, error);
    throw error.response ? error.response.data : new Error('Could not update employee.');
  }
};

// Partially updates an employee (PATCH)
export const patchEmployee = async (id, updates) => {
  if (USE_MOCK_DATA) {
    await mockDelay(500);
    const index = mockData.employees.findIndex(emp => emp.id === parseInt(id));
    if (index === -1) throw new Error('Employee not found');
    mockData.employees[index] = { ...mockData.employees[index], ...updates };
    return mockData.employees[index];
  }
  
  try {
    const response = await apiClient.patch(`/employees/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Failed to patch employee ${id}:`, error);
    throw error.response ? error.response.data : new Error('Could not update employee.');
  }
};

export const deleteEmployee = async (id) => {
  if (USE_MOCK_DATA) {
    await mockDelay(500);
    const index = mockData.employees.findIndex(emp => emp.id === parseInt(id));
    if (index === -1) throw new Error('Employee not found');
    mockData.employees.splice(index, 1);
    return;
  }
  
  try {
    await apiClient.delete(`/employees/${id}`);
  } catch (error) {
    console.error(`Failed to delete employee ${id}:`, error);
    throw error.response ? error.response.data : new Error('Could not delete employee.');
  }
};

// Bulk delete employees
export const bulkDeleteEmployees = async (ids) => {
  if (USE_MOCK_DATA) {
    await mockDelay(800);
    mockData.employees = mockData.employees.filter(emp => !ids.includes(emp.id.toString()));
    return;
  }
  
  try {
    await apiClient.post('/employees/bulk-delete', { ids });
  } catch (error) {
    console.error("Failed to bulk delete employees:", error);
    throw error.response ? error.response.data : new Error('Could not delete employees.');
  }
};

// Search employees by various criteria
export const searchEmployees = async (searchCriteria) => {
  if (USE_MOCK_DATA) {
    await mockDelay(600);
    const { query, department, location } = searchCriteria;
    let results = [...mockData.employees];
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(emp => 
        emp.firstName.toLowerCase().includes(lowerQuery) ||
        emp.lastName.toLowerCase().includes(lowerQuery) ||
        emp.email.toLowerCase().includes(lowerQuery)
      );
    }
    if (department) {
      results = results.filter(emp => emp.department === department);
    }
    if (location) {
      results = results.filter(emp => emp.location === location);
    }
    
    return results;
  }
  
  try {
    const response = await apiClient.post('/employees/search', searchCriteria);
    return response.data;
  } catch (error) {
    console.error("Failed to search employees:", error);
    throw error.response ? error.response.data : new Error('Could not search employees.');
  }
};

export const getEmployeeStats = async () => {
  if (USE_MOCK_DATA) {
    await mockDelay(500);
    return {
      totalEmployees: mockData.employees.length,
      totalPayroll: mockData.employees.reduce((sum, emp) => sum + emp.salary, 0),
      departmentCount: new Set(mockData.employees.map(emp => emp.department)).size,
      locationCount: new Set(mockData.employees.map(emp => emp.location)).size
    };
  }
  
  try {
    const response = await apiClient.get('/employees/stats');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch employee stats:", error);
    throw error.response ? error.response.data : new Error('Could not fetch employee statistics.');
  }
};

// Export employees data
export const exportEmployees = async (format = 'csv', filters = {}) => {
  if (USE_MOCK_DATA) {
    await mockDelay(1000);
    // Create a simple CSV string for mock export
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Department', 'Salary'];
    const data = mockData.employees.map(emp => [
      emp.id,
      emp.firstName,
      emp.lastName,
      emp.email,
      emp.department,
      emp.salary
    ].join(','));
    
    const csvContent = [headers.join(','), ...data].join('\n');
    return new Blob([csvContent], { type: 'text/csv' });
  }
  
  try {
    const response = await apiClient.get('/employees/export', {
      params: { format, ...filters },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error("Failed to export employees:", error);
    throw error.response ? error.response.data : new Error('Could not export employees.');
  }
};

// Import employees from file
export const importEmployees = async (file, options = {}) => {
  if (USE_MOCK_DATA) {
    await mockDelay(1500);
    // Mock import result
    return {
      imported: 3,
      errors: [],
      message: 'Successfully imported 3 employees'
    };
  }
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('options', JSON.stringify(options));
    
    const response = await apiClient.post('/employees/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to import employees:", error);
    throw error.response ? error.response.data : new Error('Could not import employees.');
  }
};

// --- Department and Role Management ---

// Get all departments
export const getDepartments = async () => {
  if (USE_MOCK_DATA) {
    await mockDelay(400);
    const departments = [...new Set(mockData.employees.map(emp => emp.department))];
    return departments.map(dept => ({ id: dept.toLowerCase(), name: dept }));
  }
  
  try {
    const response = await apiClient.get('/departments');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    throw error.response ? error.response.data : new Error('Could not fetch departments.');
  }
};

// Get all job roles
export const getJobRoles = async () => {
  if (USE_MOCK_DATA) {
    await mockDelay(400);
    const roles = [...new Set(mockData.employees.map(emp => emp.jobRole))];
    return roles.map(role => ({ id: role.toLowerCase().replace(/\s+/g, '-'), title: role }));
  }
  
  try {
    const response = await apiClient.get('/job-roles');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch job roles:", error);
    throw error.response ? error.response.data : new Error('Could not fetch job roles.');
  }
};

// --- Payroll Service Functions ---
export const runPayroll = async (payrollData) => {
  if (USE_MOCK_DATA) {
    await mockDelay(1500);
    const result = {
      id: Math.max(...mockData.payrollHistory.map(p => p.id)) + 1,
      ...payrollData,
      totalAmount: 285000,
      employeeCount: 47,
      status: 'completed',
      blockchainTxHash: '0x' + Math.random().toString(16).substr(2, 40),
      timestamp: new Date().toISOString()
    };
    mockData.payrollHistory.unshift(result);
    return result;
  }
  
  try {
    const response = await apiClient.post('/payroll/run', payrollData);
    return response.data;
  } catch (error) {
    console.error("Failed to run payroll:", error);
    throw error.response ? error.response.data : new Error('Could not run payroll.');
  }
};

export const getPayrollHistory = async () => {
  if (USE_MOCK_DATA) {
    await mockDelay(600);
    return mockData.payrollHistory;
  }
  
  try {
    const response = await apiClient.get('/payroll/history');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch payroll history:", error);
    throw error.response ? error.response.data : new Error('Could not fetch payroll history.');
  }
};

// Download payroll report
export const downloadPayrollReport = async (payrollId) => {
  if (USE_MOCK_DATA) {
    await mockDelay(800);
    // Create a mock PDF blob (just a simple text file for demo)
    const reportContent = `Payroll Report for ID: ${payrollId}\nGenerated on: ${new Date().toISOString()}\nTotal Amount: $285,000\nEmployees: 47`;
    return new Blob([reportContent], { type: 'application/pdf' });
  }
  
  try {
    const response = await apiClient.get(`/payroll/${payrollId}/report`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error("Failed to download payroll report:", error);
    throw error.response ? error.response.data : new Error('Could not download payroll report.');
  }
};

// --- Compliance & Tax Service Functions ---
export const getTaxRulesForJurisdiction = async (jurisdiction) => {
  if (USE_MOCK_DATA) {
    await mockDelay(500);
    return mockData.taxRules[jurisdiction] || { jurisdiction, rules: [], lastUpdated: new Date().toISOString() };
  }
  
  try {
    const response = await apiClient.get(`/compliance/tax-rules/${encodeURIComponent(jurisdiction)}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch tax rules:", error);
    throw error.response ? error.response.data : new Error('Could not fetch tax rules.');
  }
};

export const calculateTax = async (jurisdiction, annualIncome) => {
  if (USE_MOCK_DATA) {
    await mockDelay(800);
    // Simple mock tax calculation
    let tax = 0;
    if (annualIncome <= 50000) tax = annualIncome * 0.15;
    else if (annualIncome <= 100000) tax = 7500 + (annualIncome - 50000) * 0.25;
    else tax = 20000 + (annualIncome - 100000) * 0.35;
    
    return Math.round(tax);
  }
  
  try {
    const response = await apiClient.get('/compliance/calculate-tax', {
      params: { jurisdiction, annualIncome }
    });
    return response.data.calculatedTax || response.data;
  } catch (error) {
    console.error("Failed to calculate tax:", error);
    throw error.response ? error.response.data : new Error('Could not calculate tax.');
  }
};

// Get current rules hash
export const getCurrentRulesHash = async () => {
  if (USE_MOCK_DATA) {
    await mockDelay(300);
    return 'rules-hash-' + Date.now();
  }
  
  try {
    const response = await apiClient.get('/compliance/rules-hash');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch rules hash:", error);
    throw error.response ? error.response.data : new Error('Could not fetch rules hash.');
  }
};

// --- Analytics Service Functions ---
export const predictLegislationImpact = async (analysisRequest) => {
  if (USE_MOCK_DATA) {
    await mockDelay(1200);
    return mockData.analytics;
  }
  
  try {
    const response = await apiClient.post('/analytics/predict-impact', analysisRequest);
    return response.data;
  } catch (error) {
    console.error("Failed to analyze legislation impact:", error);
    throw error.response ? error.response.data : new Error('Could not analyze legislation impact.');
  }
};

export const getPayrollTrends = async () => {
  if (USE_MOCK_DATA) {
    await mockDelay(700);
    return mockData.payrollTrends;
  }
  
  try {
    const response = await apiClient.get('/analytics/payroll-trends');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch payroll trends:", error);
    throw error.response ? error.response.data : new Error('Could not fetch payroll trends.');
  }
};

// --- Blockchain Service Functions ---
export const getTransactions = async () => {
  if (USE_MOCK_DATA) {
    await mockDelay(600);
    return mockData.blockchainTransactions;
  }
  
  try {
    const response = await apiClient.get('/blockchain/transactions');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    throw error.response ? error.response.data : new Error('Could not fetch transactions.');
  }
};

export const verifyTransaction = async (transactionHash) => {
  if (USE_MOCK_DATA) {
    await mockDelay(400);
    // Mock verification - always returns true for development
    return true;
  }
  
  try {
    const response = await apiClient.get(`/blockchain/verify/${transactionHash}`);
    return response.data;
  } catch (error) {
    console.error("Failed to verify transaction:", error);
    throw error.response ? error.response.data : new Error('Could not verify transaction.');
  }
};

export const getLastHash = async () => {
  if (USE_MOCK_DATA) {
    await mockDelay(300);
    return '0x' + Math.random().toString(16).substr(2, 40);
  }
  
  try {
    const response = await apiClient.get('/blockchain/last-hash');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch last hash:", error);
    throw error.response ? error.response.data : new Error('Could not fetch last hash.');
  }
};

// --- AI Compliance Copilot ---
export const copilotMonitor = async ({ feed_urls = [], ad_hoc_texts = [], current_employee_data = [] } = {}) => {
  if (USE_MOCK_DATA) {
    await mockDelay(800);
    return {
      scanned_at: new Date().toISOString(),
      feed_count: feed_urls.length,
      ad_hoc_count: ad_hoc_texts.length,
      results: [],
      summary_proof: 'mock-proof-' + Date.now()
    };
  }

  try {
    const response = await apiClient.post('/copilot/monitor', { feed_urls, ad_hoc_texts, current_employee_data });
    return response.data;
  } catch (error) {
    console.error('Copilot monitor failed', error);
    throw error.response ? error.response.data : new Error('Copilot monitor failed');
  }
};

export const copilotRisks = async (payroll_data = []) => {
  if (USE_MOCK_DATA) {
    await mockDelay(600);
    return {
      risk_score: 12.5,
      risk_level: 'LOW',
      recommendations: ['No immediate action required'],
      audit_proof: 'mock-proof-' + Date.now()
    };
  }

  try {
    const response = await apiClient.post('/copilot/risks', { payroll_data });
    return response.data;
  } catch (error) {
    console.error('Copilot risks failed', error);
    throw error.response ? error.response.data : new Error('Copilot risks failed');
  }
};

export default apiClient;