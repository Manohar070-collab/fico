"""
Pydantic Request & Response Data Transfer Objects (DTOs) for SAP OneERP FICO.
Validates inputs and formats API outputs with OpenAPI schema documentation.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

# ----------------- Auth & User Schemas -----------------
class Token(BaseModel):
    """OAuth2 / JWT Bearer Token Response."""
    access_token: str
    token_type: str = "bearer"
    username: Optional[str] = None
    role: Optional[str] = "FICO Admin"

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Unique username")
    email: Optional[str] = Field(None, max_length=100, description="User email address")
    full_name: Optional[str] = Field("Administrator", max_length=100)
    role: Optional[str] = Field("FICO Admin", max_length=50)
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str = Field(..., min_length=4, max_length=100)

class UserLoginJSON(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# ----------------- Company Schemas -----------------
class CompanyBase(BaseModel):
    company_name: str = Field(..., min_length=1, max_length=100, description="Company or business unit legal name")
    company_code: str = Field(..., min_length=2, max_length=20, description="Unique SAP Company Code (e.g. 1000, 2000)")
    country: Optional[str] = Field("India", max_length=50)
    currency: Optional[str] = Field("INR", max_length=10)
    financial_year_start: Optional[str] = Field("01-April", max_length=50)
    address: Optional[str] = Field("", max_length=255)
    status: Optional[str] = Field("Active", max_length=20)

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    company_name: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=50)
    currency: Optional[str] = Field(None, max_length=10)
    financial_year_start: Optional[str] = Field(None, max_length=50)
    address: Optional[str] = Field(None, max_length=255)
    status: Optional[str] = Field(None, max_length=20)

class CompanyResponse(CompanyBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# ----------------- Fiscal Year Schemas -----------------
class FiscalYearBase(BaseModel):
    year: str = Field(..., description="Fiscal year string (e.g. 2025-2026)")
    start_date: str = Field(..., description="Start date (DD-MM-YYYY)")
    end_date: str = Field(..., description="End date (DD-MM-YYYY)")
    periods: Optional[int] = Field(12, description="Number of posting periods")
    status: Optional[str] = Field("Active", description="Active or Closed")

class FiscalYearCreate(FiscalYearBase):
    pass

class FiscalYearResponse(FiscalYearBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# ----------------- Chart of Accounts Schemas -----------------
class ChartOfAccountBase(BaseModel):
    account_no: str = Field(..., description="6-digit general ledger account number")
    name: str = Field(..., description="Account description")
    category: str = Field(..., description="Assets, Liabilities, Equity, Revenue, Expense")
    type: Optional[str] = Field("Balance Sheet", description="Balance Sheet or Profit & Loss")
    balance: Optional[float] = Field(0.0, description="Current account balance in INR")

class ChartOfAccountCreate(ChartOfAccountBase):
    pass

class ChartOfAccountResponse(ChartOfAccountBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# ----------------- Transaction Schemas -----------------
class TransactionBase(BaseModel):
    doc_no: str = Field(..., description="Document number (e.g. JE-000123)")
    date: str = Field(..., description="Posting date (DD-MM-YYYY)")
    module: str = Field(..., description="Subledger module")
    description: str = Field(..., description="Line description or reference")
    amount: float = Field(..., description="Transaction monetary amount")
    status: Optional[str] = Field("Posted", description="Document status")
    status_color: Optional[str] = Field("green", description="UI badge color tag")

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# ----------------- Journal Entry Schemas -----------------
class JournalItem(BaseModel):
    account: str = Field(..., description="Account name or number")
    debit: float = Field(0.0, description="Debit amount")
    credit: float = Field(0.0, description="Credit amount")

class JournalEntryCreate(BaseModel):
    date: str = Field(..., description="Posting date")
    description: str = Field(..., description="Transaction explanation")
    items: List[JournalItem] = Field(..., description="Line items validating double-entry rules")
    status: Optional[str] = Field("Posted", description="Posting status")
