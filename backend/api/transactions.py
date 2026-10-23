"""
Transactions & Journal Entries API Router.
Handles general ledger postings and validates double-entry accounting rules (Total Debit = Total Credit).
"""
import random
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database.session import get_db
from backend.models.fico_models import Transaction
from backend.schemas.fico_schemas import TransactionCreate, TransactionResponse, JournalEntryCreate
from backend.core.security import oauth2_scheme

router = APIRouter(tags=["Transactions"])

@router.get(
    "/api/transactions/",
    response_model=List[TransactionResponse],
    summary="List Transactions"
)
def get_transactions(db: Session = Depends(get_db)):
    """Retrieve financial transactions in descending order of creation."""
    return db.query(Transaction).order_by(Transaction.id.desc()).all()

@router.post(
    "/api/transactions/",
    response_model=TransactionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Transaction"
)
def create_transaction(
    tx: TransactionCreate,
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
):
    """Post an individual subledger transaction."""
    new_tx = Transaction(**tx.model_dump())
    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)
    return new_tx

@router.post(
    "/api/journal-entries/",
    response_model=TransactionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Post Journal Entry (Double Entry)"
)
def post_journal_entry(
    je: JournalEntryCreate,
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
):
    """
    Validate double entry rules: Total Debit must equal Total Credit.
    Rejects unbalanced entries with HTTP 400.
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
