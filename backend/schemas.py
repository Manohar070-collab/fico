"""
Schemas package proxy for backward compatibility.
Redirects to backend.schemas.fico_schemas.
"""
from backend.schemas.fico_schemas import (
    Token,
    UserBase,
    UserCreate,
    UserLoginJSON,
    UserResponse,
    CompanyBase,
    CompanyCreate,
    CompanyUpdate,
    CompanyResponse,
    FiscalYearBase,
    FiscalYearCreate,
    FiscalYearResponse,
    ChartOfAccountBase,
    ChartOfAccountCreate,
    ChartOfAccountResponse,
    TransactionBase,
    TransactionCreate,
    TransactionResponse,
    JournalItem,
    JournalEntryCreate,
)

__all__ = [
    "Token",
    "UserBase",
    "UserCreate",
    "UserLoginJSON",
    "UserResponse",
    "CompanyBase",
    "CompanyCreate",
    "CompanyUpdate",
    "CompanyResponse",
    "FiscalYearBase",
    "FiscalYearCreate",
    "FiscalYearResponse",
    "ChartOfAccountBase",
    "ChartOfAccountCreate",
    "ChartOfAccountResponse",
    "TransactionBase",
    "TransactionCreate",
    "TransactionResponse",
    "JournalItem",
    "JournalEntryCreate",
]
