# SAP OneERP FICO - Backend Service

FastAPI REST API platform conforming to OpenAPI 3.0 for SAP Financial Accounting (FI) and Controlling (CO).

## Architecture & Directory Structure

```
backend/
├── api/                     # Modular API Route Controllers
│   ├── __init__.py
│   ├── auth.py              # User authentication, OAuth2 login & JWT profile
│   ├── companies.py         # Company Code CRUD (Step 6)
│   ├── fiscal_years.py      # Fiscal Year Variant & Period management
│   ├── chart_of_accounts.py # General Ledger hierarchy & balances
│   ├── transactions.py      # Subledger postings & double-entry validation
│   ├── reports.py           # Balance Sheet and Profit & Loss generation
│   └── system.py            # Real-time summary & MySQL database health
├── core/                    # Core configuration and security
│   ├── __init__.py
│   ├── config.py            # App settings and environment variables
│   └── security.py          # Bcrypt hashing & JWT token issuance
├── database/                # Database engine & session
│   ├── __init__.py
│   └── session.py           # MySQL 8.0 engine with SQLite auto-failover
├── models/                  # SQLAlchemy ORM models
│   ├── __init__.py
│   └── fico_models.py       # User, Company, FiscalYear, COA, Transaction
├── schemas/                 # Pydantic V2 Request & Response DTOs
│   ├── __init__.py
│   └── fico_schemas.py      # Input validation & OpenAPI schemas
├── tests/                   # Automated pytest suite
│   ├── __init__.py
│   └── test_api.py          # 10/10 automated test cases
├── main.py                  # Application entrypoint & lifespan
├── requirements.txt         # Pinned python dependencies
└── .env.example             # Environment configuration template
```

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Database
Copy `.env.example` to `.env` if custom database parameters are needed:
```bash
DATABASE_URL=mysql+pymysql://root:Manu@127.0.0.1:3306/saperp
```

### 3. Run Development Server
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive Swagger UI documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 4. Run Test Suite
```bash
python -m pytest backend/tests/test_api.py -v
```
