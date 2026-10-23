"""
SAP OneERP Cloud Platform - FICO (Financial Accounting & Controlling) REST API.
Conforms to OpenAPI 3.0 specification with interactive Swagger UI at /docs.
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.core.config import settings
from backend.core.security import hash_password
from backend.database.session import engine, Base, SessionLocal
from backend.models.fico_models import User, Company, FiscalYear, ChartOfAccount, Transaction

from backend.api import (
    system_router,
    auth_router,
    companies_router,
    fiscal_years_router,
    coa_router,
    transactions_router,
    reports_router,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("fico")

# 1. Ensure database tables exist
Base.metadata.create_all(bind=engine)

def seed_initial_data(db: Session):
    """Seed initial FICO master data if tables are empty."""
    # Seed default Admin user if not exists
    admin_user = db.query(User).filter(User.username.ilike("admin")).first()
    if not admin_user:
        hashed = hash_password("admin123")
        admin_user = User(
            username="admin",
            email="admin@stackly.erp",
            hashed_password=hashed,
            full_name="SAP OneERP Administrator",
            role="FICO Administrator",
            is_active=True
        )
        db.add(admin_user)
        db.commit()

    # Seed companies if empty
    if db.query(Company).count() == 0:
        db.add_all([
            Company(
                company_name="Stackly Technologies Pvt Ltd",
                company_code="1000",
                country="India",
                currency="INR",
                financial_year_start="01-April",
                address="Tech Park, Bangalore, Karnataka, India",
                status="Active"
            ),
            Company(
                company_name="Stackly Global Solutions Inc",
                company_code="2000",
                country="USA",
                currency="USD",
                financial_year_start="01-January",
                address="Wall Street, New York, USA",
                status="Active"
            )
        ])
        db.commit()

    # Seed fiscal years if empty
    if db.query(FiscalYear).count() == 0:
        db.add_all([
            FiscalYear(year="2025-2026", start_date="01-04-2025", end_date="31-03-2026", periods=12, status="Active"),
            FiscalYear(year="2024-2025", start_date="01-04-2024", end_date="31-03-2025", periods=12, status="Closed")
        ])
        db.commit()

    # Seed chart of accounts if empty
    if db.query(ChartOfAccount).count() == 0:
        db.add_all([
            ChartOfAccount(account_no="100000", name="Cash and Bank Balances", category="Assets", type="Balance Sheet", balance=450000.0),
            ChartOfAccount(account_no="110000", name="Trade Receivables (AR)", category="Assets", type="Balance Sheet", balance=280000.0),
            ChartOfAccount(account_no="150000", name="Plant and Machinery", category="Assets", type="Balance Sheet", balance=1520000.0),
            ChartOfAccount(account_no="200000", name="Trade Payables (AP)", category="Liabilities", type="Balance Sheet", balance=185000.0),
            ChartOfAccount(account_no="300000", name="Equity Share Capital", category="Equity", type="Balance Sheet", balance=1000000.0),
            ChartOfAccount(account_no="400000", name="Software Services Revenue", category="Revenue", type="Profit & Loss", balance=1250000.0),
            ChartOfAccount(account_no="500000", name="Rent and Office Expense", category="Expense", type="Profit & Loss", balance=120000.0)
        ])
        db.commit()

    # Seed recent transactions matching screenshot
    if db.query(Transaction).count() == 0:
        db.add_all([
            Transaction(doc_no="JE-000123", date="10-04-2025", module="Journal Entry", description="Rent Expense", amount=10000.00, status="Posted", status_color="green"),
            Transaction(doc_no="AP-000456", date="09-04-2025", module="Accounts Payable", description="Supplier Invoice", amount=50000.00, status="Approved", status_color="blue"),
            Transaction(doc_no="AR-000789", date="08-04-2025", module="Accounts Receivable", description="Customer Invoice", amount=75000.00, status="Approved", status_color="blue"),
            Transaction(doc_no="FA-000321", date="07-04-2025", module="Fixed Assets", description="Machine Purchase", amount=500000.00, status="Posted", status_color="green"),
            Transaction(doc_no="BG-000654", date="06-04-2025", module="Budgeting", description="Annual Budget", amount=1000000.00, status="Created", status_color="purple"),
            Transaction(doc_no="GL-000987", date="05-04-2025", module="General Ledger", description="Period Close", amount=0.00, status="In Progress", status_color="slate")
        ])
        db.commit()

# Ensure seed data exists on module load
_init_db = SessionLocal()
try:
    seed_initial_data(_init_db)
finally:
    _init_db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup & shutdown events."""
    db = SessionLocal()
    try:
        seed_initial_data(db)
    finally:
        db.close()
    yield

# 2. FastAPI Application Instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    lifespan=lifespan
)

# 3. CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Mount API Routers
app.include_router(system_router)
app.include_router(auth_router)
app.include_router(companies_router)
app.include_router(fiscal_years_router)
app.include_router(coa_router)
app.include_router(transactions_router)
app.include_router(reports_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
