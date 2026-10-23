"""
Fiscal Year Variant & Posting Periods API Router.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database.session import get_db
from backend.models.fico_models import FiscalYear
from backend.schemas.fico_schemas import FiscalYearCreate, FiscalYearResponse
from backend.core.security import oauth2_scheme

router = APIRouter(prefix="/api/fiscal-years", tags=["Fiscal Year"])

@router.get(
    "/",
    response_model=List[FiscalYearResponse],
    summary="List Fiscal Years"
)
def get_fiscal_years(db: Session = Depends(get_db)):
    """Retrieve all configured fiscal year variants and statuses."""
    return db.query(FiscalYear).order_by(FiscalYear.id.asc()).all()

@router.post(
    "/",
    response_model=FiscalYearResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Fiscal Year"
)
def create_fiscal_year(
    fy: FiscalYearCreate,
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
):
    """Register a new fiscal year period."""
    existing = db.query(FiscalYear).filter(FiscalYear.year == fy.year).first()
    if existing:
        raise HTTPException(status_code=400, detail="Fiscal Year already exists.")
    new_fy = FiscalYear(**fy.model_dump())
    db.add(new_fy)
    db.commit()
    db.refresh(new_fy)
    return new_fy
