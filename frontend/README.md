# SAP OneERP FICO - Frontend Client

Single-page application for the SAP OneERP Financial Accounting & Controlling dashboard built with React 19, Vite, and Tailwind CSS v4.

## Features
- **Live Real-Time Sync**: Synchronizes KPIs, Company configurations, Chart of Accounts, and Transactions directly with the FastAPI MySQL backend.
- **Interactive Modals**:
  - Company Setup (CRUD with Indian currency settings)
  - Journal Entry with client-side & server-side double-entry balance validation
  - Invoices (Accounts Payable & Accounts Receivable)
  - Fixed Assets Acquisition
  - Budget Planning
  - Financial Report Generation (Balance Sheet and Profit & Loss)
  - User Authentication & Profile settings
- **MySQL Status Indicator**: Live green badge in navbar displaying active database connection (`MySQL 8.0`).

## Directory Structure

```
frontend/
├── public/                 # Static assets & SVG icons
├── src/
│   ├── assets/             # Branding and icons
│   ├── components/         # UI Components
│   │   ├── modals/         # Modal popups for ERP actions
│   │   ├── FinancialSummary.jsx
│   │   ├── KpiCards.jsx
│   │   ├── ModulesGrid.jsx
│   │   ├── Navbar.jsx
│   │   ├── QuickActions.jsx
│   │   ├── RecentTransactionsTable.jsx
│   │   └── Sidebar.jsx
│   ├── data/               # Default financial seed constants
│   │   └── initialData.js
│   ├── services/           # Backend API integration client
│   │   └── api.js
│   ├── App.jsx             # Main dashboard layout and modal orchestrator
│   ├── index.css           # Tailwind CSS imports
│   └── main.jsx            # React root mount
├── index.html              # HTML5 entrypoint
├── package.json            # Dependencies and scripts
└── vite.config.js          # Vite build configuration
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Vite Dev Server
```bash
npm run dev
```
Accessible at [http://localhost:5173/](http://localhost:5173/).

### 3. Production Build
```bash
npm run build
```
