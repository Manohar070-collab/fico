"""
Auth package proxy for backward compatibility.
Redirects to backend.core.security.
"""
from backend.core.security import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    oauth2_scheme,
    oauth2_scheme_strict,
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    get_current_user_optional,
)

__all__ = [
    "SECRET_KEY",
    "ALGORITHM",
    "ACCESS_TOKEN_EXPIRE_MINUTES",
    "oauth2_scheme",
    "oauth2_scheme_strict",
    "hash_password",
    "verify_password",
    "create_access_token",
    "get_current_user",
    "get_current_user_optional",
]
