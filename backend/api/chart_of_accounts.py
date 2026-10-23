"""
General Ledger Chart of Accounts API Router.
Handles ledger hierarchy, category balance inquiry, and COA configuration.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database.session import get_db
from backend.models.fico_models import ChartOfAccount
from backend.schemas.fico_schemas import ChartOfAccountCreate, ChartOfAccountResponse
from backend.core.security import oauth2_scheme

router = APIRouter(prefix="/api/chart-of-accounts", tags=["Chart of Accounts"])

@router.get(
    "/",
    response_model=List[ChartOfAccountResponse],
    summary="List Chart of Accounts"
)
def get_chart_of_accounts(db: Session = Depends(get_db)):
    """Retrieve all General Ledger accounts ordered by account number."""
    return db.query(ChartOfAccount).order_by(ChartOfAccount.account_no.asc()).all()

@router.post(
    "/",
    response_model=ChartOfAccountResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Ledger Account"
)
def create_chart_of_account(
    coa: ChartOfAccountCreate,
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
):
    """Create a new general ledger account in the chart of accounts."""
    existing = db.query(ChartOfAccount).filter(ChartOfAccount.account_no == coa.account_no.strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Account number already exists.")
    new_coa = ChartOfAccount(**coa.model_dump())
    db.add(new_coa)
    db.commit()
    db.refresh(new_coa)
    return new_coa

@router.delete(
    "/{account_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Account"
)
def delete_chart_of_account(account_id: int, db: Session = Depends(get_db)):
    """Delete a chart of accounts entry by ID."""
    acc = db.query(ChartOfAccount).filter(ChartOfAccount.id == account_id).first()
    if not acc:
        raise HTTPException(status_code=404, detail="Account not found.")
    db.delete(acc)
    db.commit()
    return {"message": "Account deleted successfully."}
