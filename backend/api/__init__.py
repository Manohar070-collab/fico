"""
API Routers Package.
"""
from .auth import router as auth_router
from .companies import router as companies_router
from .fiscal_years import router as fiscal_years_router
from .chart_of_accounts import router as coa_router
from .transactions import router as transactions_router
from .reports import router as reports_router
from .system import router as system_router

__all__ = [
    "auth_router",
    "companies_router",
    "fiscal_years_router",
    "coa_router",
    "transactions_router",
    "reports_router",
    "system_router",
]
