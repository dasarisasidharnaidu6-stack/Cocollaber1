"""
CoCollaber Security & Cryptographic Utilities.
Argon2id password hashing, JWT generation, and secure session tokens.
"""
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHash
import jwt

from apps.api.app.core.config import settings

_hasher = PasswordHasher()

SECRET_KEY = getattr(settings, "SECRET_KEY", "insecure_development_secret_key_change_in_production")
JWT_ALGORITHM = getattr(settings, "JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = getattr(settings, "ACCESS_TOKEN_EXPIRE_MINUTES", 60)

def hash_password(password: str) -> str:
    return _hasher.hash(password)

def verify_password(hashed_password: str, plain_password: str) -> bool:
    try:
        return _hasher.verify(hashed_password, plain_password)
    except (VerifyMismatchError, InvalidHash, Exception):
        return False

def generate_session_token() -> str:
    return secrets.token_urlsafe(32)

def generate_verification_token() -> str:
    return secrets.token_urlsafe(32)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": now})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=JWT_ALGORITHM)

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except (jwt.PyJWTError, Exception):
        return None
