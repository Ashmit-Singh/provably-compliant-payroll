export const mockEmployees = [
  { id: 'EMP001', name: 'Alice Johnson', department: 'Engineering', salary: 120000, plan: 'Premium Health', location: 'USA - California' },
  { id: 'EMP002', name: 'Bob Williams', department: 'Product', salary: 115000, plan: 'Standard Health + Vision', location: 'USA - California' },
  { id: 'EMP003', name: 'Charlie Brown', department: 'Marketing', salary: 95000, plan: 'Standard Health', location: 'Canada - Ontario' },
  { id: 'EMP004', name: 'Diana Miller', department: 'Engineering', salary: 145000, plan: 'Premium Health + Dental', location: 'USA - California' },
  { id: 'EMP005', name: 'Ethan Davis', department: 'Sales', salary: 105000, plan: 'Standard Health', location: 'India - Tamil Nadu' },
  { id: 'EMP006', name: 'Fiona Garcia', department: 'HR', salary: 88000, plan: 'Standard Health + Vision', location: 'Canada - Ontario' },
  { id: 'EMP007', name: 'George Rodriguez', department: 'Engineering', salary: 130000, plan: 'Premium Health', location: 'USA - California' },
];

export const payrollHistoryData = [
  { name: 'May', cost: 68200 },
  { name: 'Jun', cost: 68500 },
  { name: 'Jul', cost: 69100 },
  { name: 'Aug', cost: 71500 },
  { name: 'Sep', cost: 71800 },
  { name: 'Oct', cost: 72300 },
];

export const predictiveAnalyticsData = {
  current: [
    { month: 'Nov', cost: 72500 }, { month: 'Dec', cost: 72800 }, { month: 'Jan', cost: 73100 },
    { month: 'Feb', cost: 73400 }, { month: 'Mar', cost: 73700 }, { month: 'Apr', cost: 74000 },
    { month: 'May', cost: 74300 }, { month: 'Jun', cost: 74600 }, { month: 'Jul', cost: 74900 },
    { month: 'Aug', cost: 75200 }, { month: 'Sep', cost: 75500 }, { month: 'Oct', cost: 75800 },
  ],
  predicted: [
    { month: 'Nov', cost: 72500 }, { month: 'Dec', cost: 72800 }, { month: 'Jan', cost: 76100 },
    { month: 'Feb', cost: 76550 }, { month: 'Mar', cost: 77000 }, { month: 'Apr', cost: 77450 },
    { month: 'May', cost: 77900 }, { month: 'Jun', cost: 78350 }, { month: 'Jul', cost: 78800 },
    { month: 'Aug', cost: 79250 }, { month: 'Sep', cost: 79700 }, { month: 'Oct', cost: 80150 },
  ]
};

export const blockchainTransactions = [
  { 
    id: 1, 
    type: 'Payroll Run', 
    details: 'Payroll Run: September 2025', 
    hash: '0x4a2b1c8d9e0f3a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b', 
    timestamp: '2025-09-30T17:00:00Z', 
    dataHash: 'a1b2c3d4e5f67890', 
    prevHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6' 
  },
  { 
    id: 2, 
    type: 'Benefit Update', 
    details: 'Benefit Plan Update: Jane Doe', 
    hash: '0x5b3c2d9e0f1a4b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8b0c', 
    timestamp: '2025-09-15T11:23:00Z', 
    dataHash: 'c3d4e5f6a7b89012', 
    prevHash: '0x4a2b1c8d9e0f3a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b' 
  },
  { 
    id: 3, 
    type: 'New Employee', 
    details: 'New Employee Added: George Rodriguez', 
    hash: '0x6c4d3e0f1a2b5c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8c1d', 
    timestamp: '2025-09-05T09:05:00Z', 
    dataHash: 'e5f6a7b8c9d01234', 
    prevHash: '0x5b3c2d9e0f1a4b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8b0c' 
  },
  { 
    id: 4, 
    type: 'Salary Update', 
    details: 'Salary Update: Alice Johnson', 
    hash: '0x7d5e4f1a2b3c6d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8d2e', 
    timestamp: '2025-08-20T14:30:00Z', 
    dataHash: 'g7h8i9j0k1l23456', 
    prevHash: '0x6c4d3e0f1a2b5c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8c1d' 
  },
];