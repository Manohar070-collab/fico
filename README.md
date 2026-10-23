# SAP OneERP - FICO (Financial Accounting & Controlling) Platform

Enterprise-grade Financial Accounting (FI) and Controlling (CO) cloud platform implementing standard SAP ERP accounting principles, real-time MySQL database synchronization, and interactive React dashboard.

---

## 🏛️ Project Architecture & Directory Structure

The project is organized into clean, isolated, and readable layers:

```
fico/
├── backend/                       # Python FastAPI REST API Backend
│   ├── api/                       # Modular REST API Routers
│   │   ├── __init__.py
│   │   ├── auth.py                # OAuth2 authentication, login & profile (/api/v1/auth)
│   │   ├── companies.py           # Company Code management & CRUD (/companies)
│   │   ├── fiscal_years.py        # Fiscal periods & year closing (/api/fiscal-years)
│   │   ├── chart_of_accounts.py   # General Ledger accounts & hierarchy (/api/chart-of-accounts)
│   │   ├── transactions.py        # Subledger transactions & double-entry validation (/api/transactions)
│   │   ├── reports.py             # Balance Sheet and Profit & Loss reports (/api/reports)
│   │   └── system.py              # Real-time summary & DB health check (/api/summary, /api/v1/system/status)
│   ├── core/                      # Application settings & security
│   │   ├── __init__.py
│   │   ├── config.py              # Environment variables & constants
│   │   └── security.py            # Bcrypt hashing & JWT token issuance
│   ├── database/                  # Database connectivity
│   │   ├── __init__.py
│   │   └── session.py             # MySQL 8.0 engine with SQLite auto-failover
│   ├── models/                    # SQLAlchemy ORM database models
│   │   ├── __init__.py
│   │   └── fico_models.py         # User, Company, FiscalYear, ChartOfAccount, Transaction
│   ├── schemas/                   # Pydantic V2 Request & Response DTOs
│   │   ├── __init__.py
│   │   └── fico_schemas.py        # Validated data transfer schemas
│   ├── tests/                     # Automated pytest suite
│   │   ├── __init__.py
│   │   └── test_api.py            # 10/10 automated tests
│   ├── main.py                    # Application entrypoint & router orchestration
│   ├── requirements.txt           # Pinned python dependencies
│   ├── .env.example               # Environment variables template
│   └── README.md                  # Backend technical documentation
│
├── frontend/                      # React 19 + Vite + Tailwind CSS Frontend
│   ├── public/                    # Static assets & SVG icons
│   ├── src/                       # Application source code
│   │   ├── assets/                # Logos & icons
│   │   ├── components/            # Reusable UI components
│   │   │   ├── modals/            # ERP action dialogs (Company Setup, Journal, Invoice, Asset, etc.)
│   │   │   ├── FinancialSummary.jsx
│   │   │   ├── KpiCards.jsx
│   │   │   ├── ModulesGrid.jsx
│   │   │   ├── Navbar.jsx         # Live DB connection badge, profile & menu
│   │   │   ├── QuickActions.jsx
│   │   │   ├── RecentTransactionsTable.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── data/                  # Initial financial seed data
│   │   │   └── initialData.js
│   │   ├── services/              # API HTTP client
│   │   │   └── api.js
│   │   ├── App.jsx                # Root layout & real-time state synchronization
│   │   ├── index.css              # Tailwind CSS styles
│   │   └── main.jsx               # React DOM entrypoint
│   ├── index.html                 # Single page application template
│   ├── package.json               # Frontend dependencies and scripts
│   ├── vite.config.js             # Vite configuration
│   └── README.md                  # Frontend technical documentation
│
├── package.json                   # Root workspace runner scripts
├── .gitignore                     # Git ignore rules (Python, Node, DB, OS)
└── README.md                      # This comprehensive guide
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18+) and **npm**
- **Python** (3.10+)
- **MySQL 8.0** running on `localhost:3306` (Optional: auto-falls back to SQLite if MySQL is offline)

### 1. Start Both Services from Root
You can launch everything using npm scripts defined in the root `package.json`:

```bash
# Start frontend development server (http://localhost:5173/)
npm run dev

# Or start the FastAPI backend (http://localhost:8000/)
npm run backend

# Run automated backend test suite
npm test
```

---

## 🗄️ Database Architecture

The backend automatically connects to MySQL 8.0 with automatic fallback:

| Parameter | Configuration |
| :--- | :--- |
| **Engine** | MySQL 8.0 (`PyMySQL` + `SQLAlchemy 2.0`) |
| **Host / Port** | `127.0.0.1:3306` |
| **Database** | `saperp` |
| **Default User** | `root` |
| **Connection String** | `mysql+pymysql://root:Manu@127.0.0.1:3306/saperp` |
| **Failover Mode** | Seamless fallback to `sqlite:///./saperp.db` if MySQL service is stopped |

### Tables Managed
1. **`users`** — System authentication & role assignments (Administrator, FICO User).
2. **`companies`** — Enterprise structure company codes (e.g., `1000`, `2000`) with INR & USD currency settings.
3. **`fiscal_years`** — Fiscal year variants and posting periods (`2025-2026`).
4. **`chart_of_accounts`** — General Ledger master data hierarchy (Assets, Liabilities, Equity, Revenue, Expense).
5. **`transactions`** — Audit trail ledger recording subledger documents with real-time UI balance sync.

---

## 🔐 Authentication & Swagger UI

- **Interactive API Documentation**: Open [http://localhost:8000/docs](http://localhost:8000/docs)
- **Swagger "Authorize" Modal**:
  - Click the **Authorize** lock button on the top right
  - **Username**: `admin`
  - **Password**: `admin123`
  - All protected endpoints can now be executed directly within the browser.

---

## 🧪 Automated Testing

Run the complete 10-test automated verification suite:
```bash
npm test
# Or run pytest directly:
python -m pytest backend/tests/test_api.py -v
```

All 10 test scenarios pass:
- Root welcome endpoint
- OAuth2 login with JWT generation
- Invalid credential rejection
- Authenticated user profile retrieval
- Company creation validation
- Duplicate company code rejection (HTTP 400)
- Non-existent company handling (HTTP 404)
- Company update operations
- Double-entry balance check (Total Debit == Total Credit)
