"""
Models package proxy for backward compatibility.
Redirects to backend.models.fico_models.
"""
from backend.models.fico_models import User, Company, FiscalYear, ChartOfAccount, Transaction

__all__ = ["User", "Company", "FiscalYear", "ChartOfAccount", "Transaction"]
