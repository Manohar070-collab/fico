export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    date: '10-04-2025',
    docNo: 'JE-000123',
    module: 'Journal Entry',
    description: 'Rent Expense',
    amount: 10000.00,
    status: 'Posted',
    statusColor: 'green'
  },
  {
    id: 'tx-2',
    date: '09-04-2025',
    docNo: 'AP-000456',
    module: 'Accounts Payable',
    description: 'Supplier Invoice',
    amount: 50000.00,
    status: 'Approved',
    statusColor: 'blue'
  },
  {
    id: 'tx-3',
    date: '08-04-2025',
    docNo: 'AR-000789',
    module: 'Accounts Receivable',
    description: 'Customer Invoice',
    amount: 75000.00,
    status: 'Approved',
    statusColor: 'blue'
  },
  {
    id: 'tx-4',
    date: '07-04-2025',
    docNo: 'FA-000321',
    module: 'Fixed Assets',
    description: 'Machine Purchase',
    amount: 500000.00,
    status: 'Posted',
    statusColor: 'green'
  },
  {
    id: 'tx-5',
    date: '06-04-2025',
    docNo: 'BG-000654',
    module: 'Budgeting',
    description: 'Annual Budget',
    amount: 1000000.00,
    status: 'Created',
    statusColor: 'purple'
  },
  {
    id: 'tx-6',
    date: '05-04-2025',
    docNo: 'GL-000987',
    module: 'General Ledger',
    description: 'Period Close',
    amount: 0.00,
    status: 'In Progress',
    statusColor: 'slate'
  }
];

export const KPI_DATA = [
  {
    id: 'companies',
    title: 'Total Companies',
    value: '2',
    link: 'View All →',
    colorScheme: 'blue',
    bgColor: 'bg-[#eef8ff]',
    borderColor: 'border-[#d0eaff]',
    iconBg: 'bg-[#0091ff]',
    iconColor: 'text-white',
    linkHover: 'text-[#0077d6]'
  },
  {
    id: 'fiscal_years',
    title: 'Active Fiscal Years',
    value: '2',
    link: 'View All →',
    colorScheme: 'green',
    bgColor: 'bg-[#effbf5]',
    borderColor: 'border-[#c8f2dc]',
    iconBg: 'bg-[#10b981]',
    iconColor: 'text-white',
    linkHover: 'text-[#059669]'
  },
  {
    id: 'open_periods',
    title: 'Open Periods',
    value: '5',
    link: 'View All →',
    colorScheme: 'purple',
    bgColor: 'bg-[#f7f4fe]',
    borderColor: 'border-[#e4dcfc]',
    iconBg: 'bg-[#9333ea]',
    iconColor: 'text-white',
    linkHover: 'text-[#7e22ce]'
  },
  {
    id: 'total_accounts',
    title: 'Total Accounts',
    value: '128',
    link: 'View All →',
    colorScheme: 'orange',
    bgColor: 'bg-[#fff8f2]',
    borderColor: 'border-[#fee3d0]',
    iconBg: 'bg-[#f97316]',
    iconColor: 'text-white',
    valueColor: 'text-[#ea580c]',
    linkHover: 'text-[#2563eb]'
  }
];

export const FICO_MODULES = [
  {
    id: 'company',
    name: 'Company',
    description: 'Manage companies and business units',
    icon: 'Building2',
    iconBg: 'bg-[#e0f2fe]',
    iconColor: 'text-[#0284c7]'
  },
  {
    id: 'chart-of-accounts',
    name: 'Chart of Accounts',
    description: 'Maintain your COA structure and accounts',
    icon: 'ListTree',
    iconBg: 'bg-[#ecfdf5]',
    iconColor: 'text-[#10b981]'
  },
  {
    id: 'journal-entry',
    name: 'Journal Entry',
    description: 'Record and manage journal entries',
    icon: 'PenSquare',
    iconBg: 'bg-[#f5f3ff]',
    iconColor: 'text-[#8b5cf6]'
  },
  {
    id: 'general-ledger',
    name: 'General Ledger',
    description: 'View ledger and trial balance',
    icon: 'BookOpen',
    iconBg: 'bg-[#e0f2fe]',
    iconColor: 'text-[#2563eb]'
  },
  {
    id: 'ap',
    name: 'AP',
    description: 'Manage supplier invoices and payments',
    icon: 'FileText',
    iconBg: 'bg-[#fee2e2]',
    iconColor: 'text-[#ef4444]'
  },
  {
    id: 'ar',
    name: 'AR',
    description: 'Manage customer invoices and receipts',
    icon: 'Receipt',
    iconBg: 'bg-[#f3e8ff]',
    iconColor: 'text-[#9333ea]'
  },
  {
    id: 'fixed-assets',
    name: 'Fixed Assets',
    description: 'Track assets and depreciation',
    icon: 'Boxes',
    iconBg: 'bg-[#ffedd5]',
    iconColor: 'text-[#f97316]'
  },
  {
    id: 'budgeting',
    name: 'Budgeting',
    description: 'Plan and monitor budgets',
    icon: 'BarChart3',
    iconBg: 'bg-[#ecfdf5]',
    iconColor: 'text-[#10b981]'
  },
  {
    id: 'gst',
    name: 'GST',
    description: 'Handle GST transactions and reports',
    icon: 'ShieldCheck',
    iconBg: 'bg-[#e0e7ff]',
    iconColor: 'text-[#4f46e5]'
  },
  {
    id: 'financial-reports',
    name: 'Financial Reports',
    description: 'View and generate financial reports',
    icon: 'FileSpreadsheet',
    iconBg: 'bg-[#f5f3ff]',
    iconColor: 'text-[#7c3aed]'
  }
];

export const QUICK_ACTIONS = [
  {
    id: 'create-je',
    title: 'Create Journal Entry',
    icon: 'PenSquare',
    iconBg: 'bg-[#0284c7]',
    textColor: 'text-white'
  },
  {
    id: 'create-ap',
    title: 'Create AP Invoice',
    icon: 'Receipt',
    iconBg: 'bg-[#10b981]',
    textColor: 'text-white'
  },
  {
    id: 'create-ar',
    title: 'Create AR Invoice',
    icon: 'FileText',
    iconBg: 'bg-[#a855f7]',
    textColor: 'text-white'
  },
  {
    id: 'add-asset',
    title: 'Add Fixed Asset',
    icon: 'Building2',
    iconBg: 'bg-[#f97316]',
    textColor: 'text-white'
  },
  {
    id: 'create-budget',
    title: 'Create Budget',
    icon: 'BarChart3',
    iconBg: 'bg-[#14b8a6]',
    textColor: 'text-white'
  },
  {
    id: 'generate-report',
    title: 'Generate Report',
    icon: 'FileSpreadsheet',
    iconBg: 'bg-[#6366f1]',
    textColor: 'text-white'
  }
];

export const FINANCIAL_SUMMARIES = {
  'This Year': {
    income: '₹ 12,50,000',
    incomeChange: '+12%',
    expenses: '₹ 8,75,000',
    expensesChange: '+8%',
    netProfit: '₹ 3,75,000',
    profitChange: '+15%'
  },
  'This Quarter': {
    income: '₹ 4,20,000',
    incomeChange: '+9%',
    expenses: '₹ 2,90,000',
    expensesChange: '+5%',
    netProfit: '₹ 1,30,000',
    profitChange: '+14%'
  },
  'This Month': {
    income: '₹ 1,45,000',
    incomeChange: '+11%',
    expenses: '₹ 95,000',
    expensesChange: '+4%',
    netProfit: '₹ 50,000',
    profitChange: '+18%'
  },
  'Previous Year': {
    income: '₹ 10,80,000',
    incomeChange: '+6%',
    expenses: '₹ 8,10,000',
    expensesChange: '+7%',
    netProfit: '₹ 2,70,000',
    profitChange: '+5%'
  }
};

export const NOTIFICATIONS = [
  {
    id: 1,
    title: 'Vendor Invoice AP-000456 approved',
    time: '15 mins ago',
    unread: true
  },
  {
    id: 2,
    title: 'Quarterly Period Close reminder for FY 2025',
    time: '1 hour ago',
    unread: true
  },
  {
    id: 3,
    title: 'GST GSTR-3B return due in 4 days',
    time: '3 hours ago',
    unread: true
  }
];

export const COMPANIES_DATA = [
  { id: 'CMP-01', code: '1000', name: 'Stackly Technologies Pvt Ltd', country: 'India', currency: 'INR', status: 'Active' },
  { id: 'CMP-02', code: '2000', name: 'Stackly Global Solutions Inc', country: 'USA', currency: 'USD', status: 'Active' }
];

export const FISCAL_YEARS_DATA = [
  { year: '2025-2026', startDate: '01-04-2025', endDate: '31-03-2026', periods: 12, status: 'Active' },
  { year: '2024-2025', startDate: '01-04-2024', endDate: '31-03-2025', periods: 12, status: 'Closed' }
];

export const CHART_OF_ACCOUNTS_DATA = [
  { accountNo: '100000', name: 'Cash and Bank Balances', category: 'Assets', type: 'Balance Sheet', balance: '₹ 4,50,000.00' },
  { accountNo: '110000', name: 'Trade Receivables (AR)', category: 'Assets', type: 'Balance Sheet', balance: '₹ 2,80,000.00' },
  { accountNo: '150000', name: 'Plant and Machinery', category: 'Assets', type: 'Balance Sheet', balance: '₹ 15,20,000.00' },
  { accountNo: '200000', name: 'Trade Payables (AP)', category: 'Liabilities', type: 'Balance Sheet', balance: '₹ 1,85,000.00' },
  { accountNo: '300000', name: 'Equity Share Capital', category: 'Equity', type: 'Balance Sheet', balance: '₹ 10,00,000.00' },
  { accountNo: '400000', name: 'Software Services Revenue', category: 'Revenue', type: 'Profit & Loss', balance: '₹ 12,50,000.00' },
  { accountNo: '500000', name: 'Rent and Office Expense', category: 'Expense', type: 'Profit & Loss', balance: '₹ 1,20,000.00' }
];
