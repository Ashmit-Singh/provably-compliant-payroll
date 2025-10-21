export const mockEmployees = [
    { id: 'EMP001', name: 'Alice Johnson', department: 'Engineering', salary: 120000, plan: 'Premium Health' },
    { id: 'EMP002', name: 'Bob Williams', department: 'Product', salary: 115000, plan: 'Standard Health + Vision' },
    { id: 'EMP003', name: 'Charlie Brown', department: 'Marketing', salary: 95000, plan: 'Standard Health' },
    { id: 'EMP004', name: 'Diana Miller', department: 'Engineering', salary: 145000, plan: 'Premium Health + Dental' },
    { id: 'EMP005', name: 'Ethan Davis', department: 'Sales', salary: 105000, plan: 'Standard Health' },
    { id: 'EMP006', name: 'Fiona Garcia', department: 'HR', salary: 88000, plan: 'Standard Health + Vision' },
    { id: 'EMP007', name: 'George Rodriguez', department: 'Engineering', salary: 130000, plan: 'Premium Health' },
];

export const payrollHistoryData = [
    { name: 'May', cost: 68200 }, 
    { name: 'Jun', cost: 68500 }, 
    { name: 'Jul', cost: 69100 },
    { name: 'Aug', cost: 71500 }, 
    { name: 'Sep', cost: 71800 }, 
    { name: 'Oct', cost: 72300 },
];

// Fixed: Changed 'month' to 'name' for consistency with charts
export const predictiveAnalyticsData = {
    current: [
        { name: 'Nov', cost: 72500 }, 
        { name: 'Dec', cost: 72800 }, 
        { name: 'Jan', cost: 73100 }, 
        { name: 'Feb', cost: 73400 },
        { name: 'Mar', cost: 73700 }, 
        { name: 'Apr', cost: 74000 }, 
        { name: 'May', cost: 74300 }, 
        { name: 'Jun', cost: 74600 },
        { name: 'Jul', cost: 74900 }, 
        { name: 'Aug', cost: 75200 }, 
        { name: 'Sep', cost: 75500 }, 
        { name: 'Oct', cost: 75800 },
    ],
    predicted: [
        { name: 'Nov', cost: 72500 }, 
        { name: 'Dec', cost: 72800 }, 
        { name: 'Jan', cost: 76100 }, 
        { name: 'Feb', cost: 76550 },
        { name: 'Mar', cost: 77000 }, 
        { name: 'Apr', cost: 77450 }, 
        { name: 'May', cost: 77900 }, 
        { name: 'Jun', cost: 78350 },
        { name: 'Jul', cost: 78800 }, 
        { name: 'Aug', cost: 79250 }, 
        { name: 'Sep', cost: 79700 }, 
        { name: 'Oct', cost: 80150 },
    ]
};

export const taxRules = {
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
};

export const taxRulesForApi = {
    'USA - California': {
        jurisdiction: 'USA - California',
        rules: [
            {
                ruleName: 'Bracket 1',
                ruleType: 'INCOME_TAX',
                minIncome: 0,
                maxIncome: 9325,
                taxRate: 0.01,
                isActive: true
            },
            {
                ruleName: 'Bracket 2',
                ruleType: 'INCOME_TAX',
                minIncome: 9326,
                maxIncome: 22107,
                taxRate: 0.02,
                isActive: true
            },
            {
                ruleName: 'SDI Tax',
                ruleType: 'DISABILITY_INSURANCE',
                minIncome: 0,
                maxIncome: null,
                taxRate: 0.011,
                isActive: true
            }
        ],
        lastUpdated: new Date().toISOString()
    }
}

export const blockchainTransactions = [
    { 
        id: 1, 
        type: 'Payroll Run', 
        details: 'Payroll Run: September 2025', 
        hash: '0x4a2b1c8d9e0f3a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b', 
        timestamp: '2025-09-30T17:00:00Z', 
        dataHash: 'a1b2c3d4e5f6', 
        prevHash: '0x9f8e7d6c5b4a39281706050403020100' 
    },
    { 
        id: 2, 
        type: 'Benefit Update', 
        details: 'Benefit Plan Update: Jane Doe', 
        hash: '0x5b3c2d9e0f1a4b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8b0c', 
        timestamp: '2025-09-15T11:23:00Z', 
        dataHash: 'c3d4e5f6a1b2', 
        prevHash: '0x4a2b1c8d9e0f3a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b' 
    },
    { 
        id: 3, 
        type: 'New Employee', 
        details: 'New Employee Added: George Rodriguez', 
        hash: '0x6c4d3e0f1a2b5c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8c1d', 
        timestamp: '2025-09-05T09:05:00Z', 
        dataHash: 'e5f6a1b2c3d4', 
        prevHash: '0x5b3c2d9e0f1a4b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8b0c' 
    },
    { 
        id: 4, 
        type: 'Salary Update', 
        details: 'Salary Update: Alice Johnson', 
        hash: '0x7d5e4f1a2b3c6d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8d2e', 
        timestamp: '2025-08-20T14:30:00Z', 
        dataHash: 'g7h8i9j0k1l2', 
        prevHash: '0x6c4d3e0f1a2b5c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8c1d' 
    },
];

// Helper function to get combined chart data for predictive analytics
export const getCombinedPredictiveData = () => {
    return predictiveAnalyticsData.current.map((item, index) => ({
        name: item.name,
        current: item.cost,
        predicted: predictiveAnalyticsData.predicted[index]?.cost || item.cost
    }));
};