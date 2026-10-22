from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), default="Administrator")
    role = Column(String(50), default="FICO Admin")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    company_name = Column(String(100), nullable=False)
    company_code = Column(String(20), unique=True, nullable=False, index=True)
    country = Column(String(50), default="India")
    currency = Column(String(10), default="INR")
    financial_year_start = Column(String(50), default="01-April")
    address = Column(String(255), nullable=True)
    status = Column(String(20), default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)

class FiscalYear(Base):
    __tablename__ = "fiscal_years"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    year = Column(String(20), unique=True, nullable=False)
    start_date = Column(String(20), nullable=False)
    end_date = Column(String(20), nullable=False)
    periods = Column(Integer, default=12)
    status = Column(String(20), default="Active")

class ChartOfAccount(Base):
    __tablename__ = "chart_of_accounts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    account_no = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)  # Assets, Liabilities, Equity, Revenue, Expense
    type = Column(String(50), default="Balance Sheet")  # Balance Sheet, Profit & Loss
    balance = Column(Float, default=0.0)

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    doc_no = Column(String(50), unique=True, nullable=False, index=True)
    date = Column(String(20), nullable=False)
    module = Column(String(50), nullable=False)
    description = Column(String(255), nullable=False)
    amount = Column(Float, default=0.0)
    status = Column(String(50), default="Posted")
    status_color = Column(String(20), default="green")
    created_at = Column(DateTime, default=datetime.utcnow)
