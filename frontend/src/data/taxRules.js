export const taxRules = {
  'USA - California': {
    brackets: [
      { range: '$0 - $9,325', rate: '1.00%' },
      { range: '$9,326 - $22,107', rate: '2.00%' },
      { range: '$22,108 - $34,892', rate: '4.00%' },
      { range: '$34,893 - $48,435', rate: '6.00%' },
      { range: '$48,436 - $61,214', rate: '8.00%' },
      { range: '$61,215 - $312,686', rate: '9.30%' },
    ],
    notes: 'Includes State Disability Insurance (SDI) tax of 1.1%. Subject to local taxes.'
  },
  'Canada - Ontario': {
    brackets: [
      { range: '$0 - $49,231', rate: '5.05%' },
      { range: '$49,232 - $98,463', rate: '9.15%' },
      { range: '$98,464 - $150,000', rate: '11.16%' },
      { range: '$150,001 - $220,000', rate: '12.16%' },
      { range: 'Over $220,000', rate: '13.16%' },
    ],
    notes: 'Rates are for provincial tax only. Federal tax, CPP, and EI deductions apply separately.'
  },
  'India - Tamil Nadu': {
    brackets: [
      { range: '₹0 - ₹2,50,000', rate: '0%' },
      { range: '₹2,50,001 - ₹5,00,000', rate: '5%' },
      { range: '₹5,00,001 - ₹10,00,000', rate: '20%' },
      { range: 'Above ₹10,00,000', rate: '30%' },
    ],
    notes: 'A Health and Education Cess of 4% applies to the income tax amount. Professional Tax levied by the state is also applicable.'
  }
};