"""
Database package proxy for backward compatibility.
Redirects to backend.database.session.
"""
from backend.database.session import engine, SessionLocal, Base, get_db

__all__ = ["engine", "SessionLocal", "Base", "get_db"]
