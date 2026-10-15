from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

# ----------------- Company Schemas -----------------
class CompanyBase(BaseModel):
    company_name: str = Field(..., min_length=1, max_length=100, description="Name of company or business unit")
    company_code: str = Field(..., min_length=2, max_length=20, description="Unique organizational code (e.g. ABC001)")
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
    year: str
    start_date: str
    end_date: str
    periods: Optional[int] = 12
    status: Optional[str] = "Active"

class FiscalYearCreate(FiscalYearBase):
    pass

class FiscalYearResponse(FiscalYearBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# ----------------- Chart of Accounts Schemas -----------------
class ChartOfAccountBase(BaseModel):
    account_no: str
    name: str
    category: str
    type: Optional[str] = "Balance Sheet"
    balance: Optional[float] = 0.0

class ChartOfAccountCreate(ChartOfAccountBase):
    pass

class ChartOfAccountResponse(ChartOfAccountBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# ----------------- Transaction Schemas -----------------
class TransactionBase(BaseModel):
    doc_no: str
    date: str
    module: str
    description: str
    amount: float
    status: Optional[str] = "Posted"
    status_color: Optional[str] = "green"

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# ----------------- Journal Entry Schemas -----------------
class JournalItem(BaseModel):
    account: str
    debit: float = 0.0
    credit: float = 0.0

class JournalEntryCreate(BaseModel):
    date: str
    description: str
    items: List[JournalItem]
    status: Optional[str] = "Posted"
