"""
Company Setup API Router.
Handles enterprise structure company codes, configuration CRUD, and validation.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database.session import get_db
from backend.models.fico_models import Company
from backend.schemas.fico_schemas import CompanyCreate, CompanyUpdate, CompanyResponse
from backend.core.security import oauth2_scheme

router = APIRouter(prefix="/companies", tags=["Company Setup"])

@router.post(
    "/",
    response_model=CompanyResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Company"
)
def create_company(
    company: CompanyCreate,
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
):
    """
    Register and create a new Company.
    Validates required fields, formats, and rejects duplicate company codes (returns 400).
    """
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

@router.get(
    "/",
    response_model=List[CompanyResponse],
    summary="List All Companies"
)
def list_companies(db: Session = Depends(get_db)):
    """Retrieve all registered companies."""
    return db.query(Company).order_by(Company.id.asc()).all()

@router.get(
    "/{company_id}",
    response_model=CompanyResponse,
    summary="Get Company by ID"
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

@router.put(
    "/{company_id}",
    response_model=CompanyResponse,
    summary="Update Company"
)
def update_company(
    company_id: int,
    update_data: CompanyUpdate,
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
):
    """Update existing company details."""
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

@router.delete(
    "/{company_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Company"
)
def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
):
    """Delete a company by ID."""
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company with ID {company_id} not found."
        )

    db.delete(company)
    db.commit()
    return {"message": f"Company '{company.company_name}' ({company.company_code}) deleted successfully."}
