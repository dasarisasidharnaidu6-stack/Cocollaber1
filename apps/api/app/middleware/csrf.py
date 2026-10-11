"""
CSRF Protection Middleware.
Enforces Double-Submit Cookie CSRF validation for cookie-authenticated state-changing requests per OWASP ASVS.
"""
import secrets
from fastapi import Request
from starlette.responses import JSONResponse
from apps.api.app.core.exceptions import ForbiddenError

STATE_CHANGING_METHODS = {"POST", "PUT", "PATCH", "DELETE"}
CSRF_EXEMPT_PATHS = {
    "/api/v1/auth/login",
    "/api/v1/auth/register",
    "/api/v1/auth/verify-email",
}

async def csrf_protection_middleware(request: Request, call_next):
    # Only validate on state-changing methods
    if request.method in STATE_CHANGING_METHODS:
        path = request.url.path
        # If request has a session cookie and is not on an exempt path
        session_cookie = request.cookies.get("cocol_session")
        auth_header = request.headers.get("Authorization")

        # Cookie-based session without Bearer token requires CSRF protection
        if session_cookie and not (auth_header and auth_header.startswith("Bearer ")):
            if path not in CSRF_EXEMPT_PATHS:
                csrf_header = request.headers.get("X-CSRF-Token")
                csrf_cookie = request.cookies.get("cocol_csrf_token")

                if not csrf_header or not csrf_cookie or not secrets.compare_digest(csrf_header, csrf_cookie):
                    return JSONResponse(
                        status_code=403,
                        content={
                            "error_code": "E-FORB",
                            "message": "CSRF token missing or invalid.",
                            "request_id": getattr(request.state, "request_id", "csrf-blocked"),
                        },
                    )

    return await call_next(request)
