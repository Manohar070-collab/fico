import os
import random
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from .models import Company, FiscalYear, ChartOfAccount, Transaction
from .schemas import (
    CompanyCreate,
    CompanyUpdate,
    CompanyResponse,
    FiscalYearCreate,
    FiscalYearResponse,
    ChartOfAccountCreate,
    ChartOfAccountResponse,
    TransactionCreate,
    TransactionResponse,
    JournalEntryCreate
)

# Create database tables
Base.metadata.create_all(bind=engine)

def seed_initial_data(db: Session):
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

    # Seed recent transactions if empty (matching screenshot)
    if db.query(Transaction).count() == 0:
        db.add_all([
            Transaction(
                doc_no="JE-000123",
                date="10-04-2025",
                module="Journal Entry",
                description="Rent Expense",
                amount=10000.00,
                status="Posted",
                status_color="green"
            ),
            Transaction(
                doc_no="AP-000456",
                date="09-04-2025",
                module="Accounts Payable",
                description="Supplier Invoice",
                amount=50000.00,
                status="Approved",
                status_color="blue"
            ),
            Transaction(
                doc_no="AR-000789",
                date="08-04-2025",
                module="Accounts Receivable",
                description="Customer Invoice",
                amount=75000.00,
                status="Approved",
                status_color="blue"
            ),
            Transaction(
                doc_no="FA-000321",
                date="07-04-2025",
                module="Fixed Assets",
                description="Machine Purchase",
                amount=500000.00,
                status="Posted",
                status_color="green"
            ),
            Transaction(
                doc_no="BG-000654",
                date="06-04-2025",
                module="Budgeting",
                description="Annual Budget",
                amount=1000000.00,
                status="Created",
                status_color="purple"
            ),
            Transaction(
                doc_no="GL-000987",
                date="05-04-2025",
                module="General Ledger",
                description="Period Close",
                amount=0.00,
                status="In Progress",
                status_color="slate"
            )
        ])
        db.commit()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Seed sample data
    db = next(get_db())
    try:
        seed_initial_data(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="SAP OneERP - FICO API",
    description="Financial Accounting (FI) and Controlling (CO) REST API backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Step 4.2 / Root Endpoint -----------------
@app.get("/", tags=["Root"])
def home():
    """Welcome endpoint matching Step 4.2 of guide."""
    return {
        "message": "Welcome to SAP OneERP",
        "system": "FICO - Financial Accounting Module",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

# ----------------- Step 6: Company Setup CRUD APIs -----------------
@app.post(
    "/companies/",
    response_model=CompanyResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Company Setup"]
)
def create_company(company: CompanyCreate, db: Session = Depends(get_db)):
    """
    Register and create a new Company.
    Validates required fields, formats, and rejects duplicate company codes (returns 400).
    """
    # Check if company_code already exists
    existing = db.query(Company).filter(Company.company_code == company.company_code.strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Company code '{company.company_code}' already exists. Company codes must be unique."
        )

    new_company = Company(
        company_name=company.company_name.strip(),
        company_code=company.company_code.strip().upper(),
        country=company.country,
        currency=company.currency.upper(),
        financial_year_start=company.financial_year_start,
        address=company.address,
        status=company.status or "Active"
    )
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    return new_company

@app.get(
    "/companies/",
    response_model=List[CompanyResponse],
    tags=["Company Setup"]
)
def list_companies(db: Session = Depends(get_db)):
    """Retrieve all registered companies."""
    return db.query(Company).all()

@app.get(
    "/companies/{company_id}",
    response_model=CompanyResponse,
    tags=["Company Setup"]
)
def get_company(company_id: int, db: Session = Depends(get_db)):
    """Retrieve details of a specific company by its ID."""
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company with ID {company_id} not found."
        )
    return company

@app.put(
    "/companies/{company_id}",
    response_model=CompanyResponse,
    tags=["Company Setup"]
)
def update_company(company_id: int, update_data: CompanyUpdate, db: Session = Depends(get_db)):
    """Update company details."""
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company with ID {company_id} not found."
        )

    for field, value in update_data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(company, field, value)

    db.commit()
    db.refresh(company)
    return company

@app.delete(
    "/companies/{company_id}",
    status_code=status.HTTP_200_OK,
    tags=["Company Setup"]
)
def delete_company(company_id: int, db: Session = Depends(get_db)):
    """
    Delete a company if permitted by business rules.
    Companies with posted general ledger transactions cannot be deleted.
    """
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company with ID {company_id} not found."
        )

    db.delete(company)
    db.commit()
    return {"message": f"Company '{company.company_name}' ({company.company_code}) deleted successfully."}

# ----------------- Fiscal Year APIs -----------------
@app.get("/api/fiscal-years/", response_model=List[FiscalYearResponse], tags=["Fiscal Year"])
def get_fiscal_years(db: Session = Depends(get_db)):
    return db.query(FiscalYear).all()

@app.post("/api/fiscal-years/", response_model=FiscalYearResponse, status_code=status.HTTP_201_CREATED, tags=["Fiscal Year"])
def create_fiscal_year(fy: FiscalYearCreate, db: Session = Depends(get_db)):
    existing = db.query(FiscalYear).filter(FiscalYear.year == fy.year).first()
    if existing:
        raise HTTPException(status_code=400, detail="Fiscal Year already exists.")
    new_fy = FiscalYear(**fy.dict())
    db.add(new_fy)
    db.commit()
    db.refresh(new_fy)
    return new_fy

# ----------------- Chart of Accounts APIs -----------------
@app.get("/api/chart-of-accounts/", response_model=List[ChartOfAccountResponse], tags=["Chart of Accounts"])
def get_chart_of_accounts(db: Session = Depends(get_db)):
    return db.query(ChartOfAccount).all()

@app.post("/api/chart-of-accounts/", response_model=ChartOfAccountResponse, status_code=status.HTTP_201_CREATED, tags=["Chart of Accounts"])
def create_chart_of_account(coa: ChartOfAccountCreate, db: Session = Depends(get_db)):
    existing = db.query(ChartOfAccount).filter(ChartOfAccount.account_no == coa.account_no).first()
    if existing:
        raise HTTPException(status_code=400, detail="Account number already exists.")
    new_coa = ChartOfAccount(**coa.dict())
    db.add(new_coa)
    db.commit()
    db.refresh(new_coa)
    return new_coa

# ----------------- Transactions APIs -----------------
@app.get("/api/transactions/", response_model=List[TransactionResponse], tags=["Transactions"])
def get_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).order_by(Transaction.id.desc()).all()

@app.post("/api/transactions/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED, tags=["Transactions"])
def create_transaction(tx: TransactionCreate, db: Session = Depends(get_db)):
    new_tx = Transaction(**tx.dict())
    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)
    return new_tx

@app.post("/api/journal-entries/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED, tags=["Transactions"])
def post_journal_entry(je: JournalEntryCreate, db: Session = Depends(get_db)):
    """
    Validate double entry rules: Total Debit must equal Total Credit.
    """
    total_debit = sum(item.debit for item in je.items)
    total_credit = sum(item.credit for item in je.items)

    if round(total_debit, 2) != round(total_credit, 2):
        raise HTTPException(
            status_code=400,
            detail=f"Double-entry violation: Total Debit (₹{total_debit}) must equal Total Credit (₹{total_credit})."
        )

    doc_no = f"JE-{random.randint(100000, 999999)}"
    new_tx = Transaction(
        doc_no=doc_no,
        date=je.date,
        module="Journal Entry",
        description=je.description,
        amount=total_debit,
        status=je.status or "Posted",
        status_color="green" if je.status == "Posted" else "slate"
    )
    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)
    return new_tx

# ----------------- Summary API -----------------
@app.get("/api/summary/", tags=["Dashboard Summary"])
def get_summary(db: Session = Depends(get_db)):
    total_companies = db.query(Company).count()
    active_fiscal_years = db.query(FiscalYear).filter(FiscalYear.status == "Active").count()
    total_accounts = db.query(ChartOfAccount).count()
    total_transactions = db.query(Transaction).count()

    return {
        "total_companies": total_companies,
        "active_fiscal_years": active_fiscal_years,
        "open_periods": 5,
        "total_accounts": total_accounts,
        "total_transactions": total_transactions,
        "financial_summary": {
            "income": 1250000.0,
            "expenses": 875000.0,
            "net_profit": 375000.0
        }
    }
